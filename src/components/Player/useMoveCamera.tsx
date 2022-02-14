import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePlayerPositionRef, useGameStateRef } from "../../store";
import { ANIMATE_HEIGHT, CAMERA_POSITIONS } from "../../utils/constants";

export function useMoveCamera() {
  const [gameStateRef] = useGameStateRef();
  const [playerPositionRef] = usePlayerPositionRef();

  useFrame(({ camera }) => {
    const { rangeUp, isAnimating, heldBoomerangs } = gameStateRef.current;
    console.log(
      "🌟🚨 ~ file: useMoveCamera.tsx ~ line 12 ~ useFrame ~ heldBoomerangs",
      heldBoomerangs
    );
    console.log(
      "🌟🚨 ~ file: useMoveCamera.tsx ~ line 12 ~ useFrame ~ isAnimating",
      isAnimating
    );

    // move the camera up when rangeUp is active

    const [camX, camY, camZ] = [0, 1, 2].map((idx) => {
      const xyz = idx === 0 ? "x" : idx === 1 ? "y" : "z";
      return THREE.MathUtils.lerp(
        camera.position[xyz],
        playerPositionRef.current[idx] +
          (isAnimating
            ? CAMERA_POSITIONS.CLOSEUP_ANIMATION[idx]
            : heldBoomerangs.length === 0
            ? CAMERA_POSITIONS.CLOSEUP[idx]
            : rangeUp
            ? CAMERA_POSITIONS.RANGEUP[idx]
            : CAMERA_POSITIONS.GAMEPLAY[idx]),
        0.05
      );
    });

    const newCameraPosition: [number, number, number] = [camX, camY, camZ];
    camera.position.set(...newCameraPosition);

    camera.lookAt(
      playerPositionRef.current[0],
      isAnimating
        ? playerPositionRef.current[1] + ANIMATE_HEIGHT
        : playerPositionRef.current[1],
      playerPositionRef.current[2]
    );
  });
}
