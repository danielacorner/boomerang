import {
  Environment,
  Plane,
  useDetectGPU,
  useTexture,
} from "@react-three/drei";
import { usePlane } from "@react-three/cannon";
import { useHeldBoomerangs, usePlayerState } from "../store";
import { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { GROUND_NAME, GROUP1, MAX_THROW_DISTANCE } from "../utils/constants";
import { useWhyDidYouUpdate } from "./useWhyDidYouUpdate";
import { useCallback } from "react";
import * as LANDSCAPE from "three-landscape";
console.log("🌟🚨 ~ file: Ground.tsx ~ line 15 ~ LANDSCAPE", LANDSCAPE);
const PLANE_PROPS = {
  args: [1000, 1000] as any,
  position: [0, -1, 0] as [number, number, number],
  rotation: [-Math.PI / 2, 0, 0] as [number, number, number],
};

export function Ground({ playerPositionRef }) {
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

        setPlayerState((p) => ({
          ...p,
          lookAt,
          farthestTargetPosition: newFarthestTargetPosition,
        }));
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

/** e.g. convert a [1,2,3] array into [1/3,2/3,3/3] */
// function normalizeVector([x, y, z]) {
//   const magnitude = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
//   return [x / magnitude, y / magnitude, z / magnitude];
// }

const Terrain = () => {
  const GPUTier = useDetectGPU();
  const lowPowerDevice = GPUTier.tier === 0 || GPUTier.isMobile;
  const detail = lowPowerDevice ? 32 : 8;
  const [highestQualityLoaded, textures] = LANDSCAPE.useProgressiveTexture([
    [
      "/hd/heightmap.png",
      "/hd/normalmap_y@0.5.png",
      "/simplex-noise.png",
      "/Assets/Cliffs_02/Rock_DarkCrackyCliffs_col.jpg",
      "/Assets/Cliffs_02/Rock_DarkCrackyCliffs_norm.jpg",
      "/Assets/Rock_04/Rock_sobermanRockWall_col.jpg",
      "/Assets/Rock_04/Rock_sobermanRockWall_norm.jpg",
      "/Assets/Mud_03/Ground_WetBumpyMud_col.jpg",
      "/Assets/Mud_03/Ground_WetBumpyMud_norm.jpg",
      "/Assets/Grass_020/ground_Grass1_col.jpg",
      "/hd/splatmap_00@0.5.png",
      "/hd/splatmap_01@0.5.png",
    ],
    [
      "/hd/heightmap.png",
      "/hd/normalmap_y.png",
      "/simplex-noise.png",
      "/Assets/Cliffs_02/Rock_DarkCrackyCliffs_col.jpg",
      "/Assets/Cliffs_02/Rock_DarkCrackyCliffs_norm.jpg",
      "/Assets/Rock_04/Rock_sobermanRockWall_col.jpg",
      "/Assets/Rock_04/Rock_sobermanRockWall_norm.jpg",
      "/Assets/Mud_03/Ground_WetBumpyMud_col.jpg",
      "/Assets/Mud_03/Ground_WetBumpyMud_norm.jpg",
      "/Assets/Grass_020/ground_Grass1_col.jpg",
      "/hd/splatmap_00.png",
      "/hd/splatmap_01.png",
    ],
  ]);

  const [
    displacement,
    normal,
    noise,
    d1,
    n1,
    d2,
    n2,
    d3,
    n3,
    d4,
    splat1,
    splat2,
  ] = textures[highestQualityLoaded];

  const { width, height } = displacement.image;

  return (
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeBufferGeometry args={[100, 100, width / detail, height / detail]} />
      <LANDSCAPE.SplatStandardMaterial
        normalMap={normal}
        splats={[splat1, splat2]}
        normalMaps={[n1, n2, n3]}
        normalWeights={[0.75, 0.75, 0.75]}
        diffuseMaps={[d1, d2, d3, d4, d4, d3]}
        scale={[128 / 4, 128 / 2, 128, 128 * 2, 128, 128, 10]}
        saturation={[1.1, 1.1, 1.1, 1.2, 1.1, 1.1]}
        brightness={[0.0, 0.0, 0.0, -0.075, -0.075, 0.0]}
        noise={noise}
        displacementMap={displacement}
        displacementScale={10}
        displacementBias={-10}
        envMapIntensity={0.5}
      />
    </mesh>
  );
};
