import { Environment, Plane, useTexture } from "@react-three/drei";
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
import { useCallback } from "react";
import { distanceBetweenPoints } from "../utils/utils";
import { Vector3 } from "three";
const PLANE_PROPS = {
  args: [1000, 1000] as any,
  position: [0, -1, 0] as [number, number, number],
  rotation: [-Math.PI / 2, 0, 0] as [number, number, number],
};

export function GroundBasic() {
  const [planeRef] = usePlane(() => ({
    ...PLANE_PROPS,
    collisionFilterGroup: GROUP1,
  }));

  return (
    <Plane receiveShadow name={GROUND_NAME} ref={planeRef} {...PLANE_PROPS}>
      <meshToonMaterial color="#525252" />
    </Plane>
  );
}

export function Ground() {
  const [playerPositionRef] = usePlayerPositionRef();
  const [planeRef] = usePlane(() => ({
    ...PLANE_PROPS,
    collisionFilterGroup: GROUP1,
  }));
  const [, setHeldBoomerangs] = useHeldBoomerangs();
  const [gameStateRef] = useGameStateRef();
  const [{ rangeUp }] = usePlayerState();

  // TODO: instead of going straight to the mouse + maximum distance,
  // TODO: aim at the mouse, then hold to charge velocity, let go to shoot
  const onPointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (!playerPositionRef.current) return;

      // ! not working
      const {
        newFarthestTargetPosition,
      }: {
        newFarthestTargetPosition: [number, number, number];
      } = handlePointerMove(e, playerPositionRef, rangeUp);

      // const { x, y, z } = getMousePosition(e);
      // const newFarthestTargetPosition: [number, number, number] = [x, y, z];

      console.log(
        "🌟🚨 ~ file: Ground.tsx ~ line 55 ~ Ground ~ playerPositionRef/current",
        playerPositionRef.current
      );
      console.log(
        "🌟🚨 ~ file: Ground.tsx ~ line 59 ~ Ground ~ newFarthestTargetPosition",
        newFarthestTargetPosition
      );

      setHeldBoomerangs((currentBoomerangs) => {
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
          return newBoomerangs;
        }
      });
    },
    [rangeUp, playerPositionRef]
  );

  const onPointerMove: (event: ThreeEvent<PointerEvent>) => void = useCallback(
    (e) => {
      if (!playerPositionRef.current) return;
      // if ((rangeUp || heldBoomerangs[0].status !== "flying") && playerPositionRef.current) {
      const {
        lookAt,
        newFarthestTargetPosition,
      }: {
        lookAt: [number, number, number];
        newFarthestTargetPosition: [number, number, number];
      } = handlePointerMove(e, playerPositionRef, rangeUp) as any;

      gameStateRef.current = {
        ...gameStateRef.current,
        lookAt,
        farthestTargetPosition: newFarthestTargetPosition,
      };
    },
    [rangeUp, playerPositionRef]
  );

  const { texture } = useTexture({ texture: "/textures/grass.jpg" });

  if (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(38, 38);
    texture.anisotropy = 16;
  }

  return (
    <>
      <Environment preset="park" />
      <fog attach="fog" args={["#74bbd0", 0, 200]} />
      {/* <Terrain /> */}
      <Plane
        receiveShadow
        name={GROUND_NAME}
        ref={planeRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        {...PLANE_PROPS}
      >
        <meshToonMaterial color="#525252" map={texture} />
      </Plane>
      {/* <Plane {...PLANE_PROPS} position={[0, 0, 0]}>
        <meshToonMaterial color="#ffffff" opacity={0.5} transparent={true} />
      </Plane> */}
    </>
  );
}
function handlePointerMove(
  e: ThreeEvent<PointerEvent>,
  playerPositionRef: { current: [number, number, number] },
  rangeUp: boolean
) {
  const { x, y, z } = getMousePosition(e);
  const [sx, sy, sz] = [Math.sign(x), Math.sign(y), Math.sign(z)];

  // limit the throw distance

  // direction of the throw, normalized vector
  // if above max throw distance, we'll multiply this by maxThrowDistance
  const normalizedThrowDirection = new Vector3(
    x - playerPositionRef.current[0],
    y - playerPositionRef.current[1],
    z - playerPositionRef.current[2]
  ).normalize();
  console.log(
    "🌟🚨 ~ file: Ground.tsx ~ line 180 ~ Ground ~ normalizedThrowDirection",
    normalizedThrowDirection
  );

  // distance between points
  const distance = distanceBetweenPoints(playerPositionRef.current, [x, y, z]);

  console.log(
    "🌟🚨 ~ file: Ground.tsx ~ line 168 ~ Ground ~ distance",
    distance
  );

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
        ].map((v) => v * maxThrowDistance) as [number, number, number])
      : [x, y, z];
  console.log(
    "🌟🚨 ~ file: Ground.tsx ~ line 189 ~ Ground ~ newFarthestTargetPosition",
    newFarthestTargetPosition
  );

  // can verify distance2 <= maxThrowDistance
  // const distance2 = distanceBetweenPoints(
  //   playerPosition,
  //   newFarthestTargetPosition
  // );

  return { lookAt: [x, y, z], newFarthestTargetPosition };
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
