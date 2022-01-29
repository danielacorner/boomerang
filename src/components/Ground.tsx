import {
  Environment,
  Plane,
  useDetectGPU,
  useTexture,
} from "@react-three/drei";
import { usePlane } from "@react-three/cannon";
import {
  useHeldBoomerangs,
  usePlayerPositionRef,
  usePlayerState,
} from "../store";
import { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { GROUND_NAME, GROUP1, MAX_THROW_DISTANCE } from "../utils/constants";
import { useWhyDidYouUpdate } from "./useWhyDidYouUpdate";
import { useCallback } from "react";
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

  const [{ rangeUp }, setPlayerState] = usePlayerState();

  // TODO: instead of going straight to the mouse + maximum distance,
  // TODO: aim at the mouse, then hold to charge velocity, let go to shoot
  const onPointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      const {
        newFarthestTargetPosition,
      }: {
        lookAt: [number, number, number];
        newFarthestTargetPosition: [number, number, number];
      } = handlePointerMove(
        e,
        playerPositionRef.current,
        MAX_THROW_DISTANCE,
        rangeUp
      );
      console.log(
        "🌟🚨 ~ file: Ground.tsx ~ line 36 ~ Ground ~ newFarthestTargetPosition",
        newFarthestTargetPosition
      );
      console.log(
        "🌟🚨 ~ file: Ground.tsx ~ line 38 ~ Ground ~ playerPositionRef.current",
        playerPositionRef.current
      );

      setHeldBoomerangs((currentBoomerangs) => {
        // if rangeUp is active, send ALL active boomerangs,
        // plus the first available boomerang, to the target position
        let found = false;
        if (rangeUp) {
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
    [rangeUp]
  );

  const onPointerMove: (event: ThreeEvent<PointerEvent>) => void = useCallback(
    (e) => {
      if (playerPositionRef.current) {
        // if ((rangeUp || heldBoomerangs[0].status !== "flying") && playerPositionRef.current) {
        const {
          lookAt,
          newFarthestTargetPosition,
        }: {
          lookAt: [number, number, number];
          newFarthestTargetPosition: [number, number, number];
        } = handlePointerMove(
          e,
          playerPositionRef.current,
          MAX_THROW_DISTANCE,
          rangeUp
        );

        setPlayerState((p) => {
          return p; // ???
          // if the distance between the previous target position and the new target position
          // is greater than 0.1, then update the target position
          const THRESHOLD = 5;
          if (
            distanceBetweenPoints(p.lookAt, lookAt) > THRESHOLD ||
            distanceBetweenPoints(
              p.farthestTargetPosition,
              newFarthestTargetPosition
            ) > THRESHOLD
          ) {
            return {
              ...p,
              lookAt,
              farthestTargetPosition: newFarthestTargetPosition,
            };
          }
          return p;
        });
      }
    },
    [rangeUp]
  );

  const { texture } = useTexture({ texture: "/textures/grass.jpg" });

  if (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(38, 38);
    texture.anisotropy = 16;
  }

  useWhyDidYouUpdate("Ground", {
    playerPositionRef,
    planeRef,
    setHeldBoomerangs,
    rangeUp,
    setPlayerState,
    onPointerDown,
    onPointerMove,
    texture,
  });

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
  playerPosition: [number, number, number],
  MAX_THROW_DISTANCE: number,
  rangeUp: boolean
) {
  const { x, y, z } = getMousePosition(e);

  // limit the throw distance
  const distance = distanceBetweenPoints(playerPosition, [x, y, z]);

  // if it's above the max distance, shrink it down to the max distance
  const maxThrowDistance = MAX_THROW_DISTANCE * (rangeUp ? 3 : 1);

  const pctOfMax = Math.abs(distance / maxThrowDistance);

  const lookAt: [number, number, number] = [x, y, z];

  // if the distance is above the max distance, scale it down
  // (normalize, then multiply by maxThrowDistance)
  // const [normX, normY, normZ] = normalizeVector([xx, yy, zz]);

  const newFarthestTargetPosition: [number, number, number] =
    pctOfMax > 1
      ? // if it's above 1, scale it down
        [x / pctOfMax, y / pctOfMax, z / pctOfMax]
      : lookAt;

  // can verify distance2 <= maxThrowDistance
  // const distance2 = distanceBetweenPoints(
  //   playerPosition,
  //   newFarthestTargetPosition
  // );

  return { lookAt, newFarthestTargetPosition };
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

function distanceBetweenPoints([x1, y1, z1], [x2, y2, z2]) {
  return Math.sqrt(
    Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2)
  );
}
