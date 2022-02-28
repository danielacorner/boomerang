import { Environment, Plane, useTexture, Sky } from "@react-three/drei";
import { usePlane } from "@react-three/cannon";
import {
  useGameStateRef,
  useHeldBoomerangs,
  usePlayerPositionRef,
  usePlayerState,
} from "../store";
import { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { GROUND_NAME, GROUP1, MAX_THROW_DISTANCE } from "../utils/constants";
import { useCallback, useRef, useState } from "react";
import { distanceBetweenPoints } from "../utils/utils";
import { Vector3 } from "three";
import { ProceduralTerrain } from "./ProceduralTerrain/ProceduralTerrain";

export const GROUND_PLANE_PROPS = {
  args: [1000, 1000] as any,
  position: [0, -1, 0] as [number, number, number],
  rotation: [-Math.PI / 2, 0, 0] as [number, number, number],
};

export function GroundBasic() {
  const [planeRef] = usePlane(() => ({
    ...GROUND_PLANE_PROPS,
    collisionFilterGroup: GROUP1,
  }));

  return (
    <Plane
      receiveShadow
      name={GROUND_NAME}
      ref={planeRef}
      {...GROUND_PLANE_PROPS}
    >
      <meshToonMaterial color="#525252" />
    </Plane>
  );
}

export function Ground() {
  const [playerPositionRef] = usePlayerPositionRef();
  const [planeRef] = usePlane(() => ({
    ...GROUND_PLANE_PROPS,
    collisionFilterGroup: GROUP1,
  }));
  const [, setHeldBoomerangs] = useHeldBoomerangs();
  const [gameStateRef] = useGameStateRef();
  const [{ rangeUp }] = usePlayerState();

  // TODO: instead of going straight to the mouse + maximum distance,
  // TODO: aim at the mouse, then hold to charge velocity, let go to shoot
  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (!playerPositionRef.current) return;

    setHeldBoomerangs((currentBoomerangs) => {
      // ! playerPositionRef not working
      const {
        newFarthestTargetPosition,
      }: {
        newFarthestTargetPosition: [number, number, number];
      } = getFarthestTargetPosition(
        getMousePosition(e),
        { current: gameStateRef.current.playerPosition },
        rangeUp
      );

      // if rangeUp is active, send ALL active boomerangs,
      // plus the first available boomerang, to the target position
      if (rangeUp) {
        let found = false;
        const newBoomerangs = currentBoomerangs.map((boom) => {
          if ((!found && boom.status === "held") || boom.status !== "held") {
            if (boom.status === "held") {
              found = true;
            }

            return {
              ...boom,
              status: "flying" as any,
              clickTargetPosition: newFarthestTargetPosition,
            };
          }
          return boom;
        });

        gameStateRef.current.heldBoomerangs = newBoomerangs;
        return newBoomerangs;
      } else {
        // normally,
        // find the first boomerang without a clickTargetPosition,
        // and set it to the current target position
        let found = false;
        const newBoomerangs = currentBoomerangs.map((boom) => {
          if (!found && boom.status === "held") {
            found = true;
            return {
              ...boom,
              status: "flying" as any,
              clickTargetPosition: newFarthestTargetPosition,
            };
          }
          return boom;
        });
        gameStateRef.current.heldBoomerangs = newBoomerangs;
        return newBoomerangs;
      }
    });
  };

  const onPointerMove: (event: ThreeEvent<PointerEvent>) => void = (e) => {
    if (!playerPositionRef.current) return;
    // if ((rangeUp || heldBoomerangs[0].status !== "flying") && playerPositionRef.current) {
    const { x, y, z } = getMousePosition(e);
    const {
      newFarthestTargetPosition,
    }: {
      newFarthestTargetPosition: [number, number, number];
    } = getFarthestTargetPosition(
      { x, y, z },
      { current: gameStateRef.current.playerPosition },
      rangeUp
    ) as any;

    gameStateRef.current = {
      ...gameStateRef.current,
      lookAt: [x, y, z],
      farthestTargetPosition: newFarthestTargetPosition,
    };
  };

  return (
    <>
      {/* <fog attach="fog" args={["#74bbd0", 0, 200]} /> */}
      <ProceduralTerrain />
      <Plane
        receiveShadow
        name={GROUND_NAME}
        ref={planeRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        {...GROUND_PLANE_PROPS}
      >
        <meshBasicMaterial opacity={0} transparent={true} color="#000" />
      </Plane>
    </>
  );
}

export function getFarthestTargetPosition(
  mousePosition: { x: number; y: number; z: number },
  playerPositionRef: { current: [number, number, number] },
  rangeUp: boolean
) {
  const { x, y, z } = mousePosition;
  const [sx, sy, sz] = [Math.sign(x), Math.sign(y), Math.sign(z)];

  // limit the throw distance

  // direction of the throw, normalized vector
  // if above max throw distance, we'll multiply this by maxThrowDistance
  const normalizedThrowDirection = new Vector3(
    x - playerPositionRef.current[0],
    y - playerPositionRef.current[1],
    z - playerPositionRef.current[2]
  ).normalize();

  // distance between points
  const distance = distanceBetweenPoints(playerPositionRef.current, [x, y, z]);

  // if it's above the max distance, shrink it down to the max distance

  const maxThrowDistance = MAX_THROW_DISTANCE * (rangeUp ? 3 : 1);

  // if the distance is above the max distance, scale it down
  // (normalize, then multiply by maxThrowDistance)
  // const [normX, normY, normZ] = normalizeVector([xx, yy, zz]);

  // ! have to scale down the distance to max distance, by normalizing the vector, then multiplying by maxThrowDistance

  const newFarthestTargetPosition: [number, number, number] =
    distance > maxThrowDistance
      ? // if it's above 1, scale it down
        ([
          normalizedThrowDirection.x,
          normalizedThrowDirection.y,
          normalizedThrowDirection.z,
        ].map(
          (v, idx) => v * maxThrowDistance + playerPositionRef.current[idx]
        ) as [number, number, number])
      : [x, y, z];

  // can verify distance2 <= maxThrowDistance
  // const distance2 = distanceBetweenPoints(
  //   playerPosition,
  //   newFarthestTargetPosition
  // );

  return { newFarthestTargetPosition };
}

export function getMousePosition(e: ThreeEvent<PointerEvent>) {
  // const ground = e.intersections.find((i) => i.object.name === GROUND_NAME);

  // const point = ground?.point;
  const point = e.point;
  if (!point) {
    return { x: 0, y: 0, z: 0 };
  }
  const { x, z } = point;
  return { x, y: 1, z };
}
