import { useFrame } from "@react-three/fiber";
import { usePlayerPositionRef, useGameStateRef } from "../../../store";
import { ANIMATE_HEIGHT, CAMERA_POSITIONS } from "../../../utils/constants";
import * as THREE from "three";

export function useMoveCamera() {
  const [gameStateRef] = useGameStateRef();
  const [playerPositionRef] = usePlayerPositionRef();

  useFrame(({ camera }) => {
    const { rangeUp, isAnimating, heldBoomerangs } = gameStateRef.current;

    // move the camera up when rangeUp is active
    const [camX, camY, camZ] = [0, 1, 2].map((idx) => {
      const nextCameraPosition =
        // track player x, z
        (idx === 1 ? 0 : playerPositionRef.current[idx]) +
        (isAnimating
          ? CAMERA_POSITIONS.CLOSEUP_ANIMATION[idx]
          : heldBoomerangs.length === 0
          ? CAMERA_POSITIONS.CLOSEUP[idx]
          : rangeUp
          ? CAMERA_POSITIONS.RANGEUP[idx]
          : CAMERA_POSITIONS.GAMEPLAY[idx]);

      const xyz = idx === 0 ? "x" : idx === 1 ? "y" : "z";
      const cameraMoveSpeed = isAnimating ? 0.08 : 1;
      // return nextCameraPosition;
      return THREE.MathUtils.lerp(
        camera.position[xyz],
        nextCameraPosition,
        cameraMoveSpeed
      );
    });

    const newCameraPosition: [number, number, number] = [camX, camY, camZ];
    camera.position.set(...newCameraPosition);

    camera.lookAt(
      playerPositionRef.current[0],
      0 + (isAnimating ? ANIMATE_HEIGHT : 0),
      playerPositionRef.current[2]
    );
  });
}
