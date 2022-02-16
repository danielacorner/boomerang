import {
  useGameStateRef,
  usePlayerPositionRef,
  usePlayerRef,
} from "../../store";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useState } from "react";
import { useControls } from "leva";
import { getAnimationDuration } from "../../utils/constants";

export function useAnimateMage() {
  // when we pick up the first boomerang, we want to animate the mage
  const [gameStateRef] = useGameStateRef();
  const [playerRef] = usePlayerRef();
  const [playerPositionRef] = usePlayerPositionRef();

  const [isAnimatingBoom, setIsAnimatingBoom] = useState(false);
  const { x, y, z } = useControls({ x: 0.9, y: -0.03, z: 0 });
  const { px, py, pz } = useControls({ px: 0, py: 6, pz: 0 });

  // const { x, y, z } = useControls({ x: 0, y: Math.PI, z: 0 });
  useFrame(() => {
    const { cylinderApi, cylinderRef, heldBoomerangs, isAnimating } =
      gameStateRef.current;

    const shouldAnimate =
      isAnimating &&
      cylinderApi &&
      playerRef.current &&
      cylinderRef?.current &&
      heldBoomerangs.length === 1;
    if (!shouldAnimate) {
      return;
    }
    if (!isAnimatingBoom) {
      setIsAnimatingBoom(true);
      setTimeout(() => {
        setIsAnimatingBoom(false);
      }, getAnimationDuration());
    }

    // animate the mage up
    // const MAGE_UP = [0, 14, 0];
    const MAGE_UP = [px, py, pz];
    cylinderApi.position.set(
      THREE.MathUtils.lerp(playerPositionRef.current[0], MAGE_UP[0], 0.1),
      THREE.MathUtils.lerp(playerPositionRef.current[1], MAGE_UP[1], 0.06),
      THREE.MathUtils.lerp(playerPositionRef.current[2], MAGE_UP[2], 0.1)
    );

    cylinderApi.rotation.set(
      x,
      y,
      z
      // lerp(cylinderRef.current.rotation.x, MAGE_UP.rotation[0]),
      // lerp(cylinderRef.current.rotation.y, MAGE_UP.rotation[1]),
      // lerp(cylinderRef.current.rotation.z, MAGE_UP.rotation[2])
    );
    cylinderApi.velocity.set(0, 0, 0);
    cylinderApi.angularVelocity.set(0, 0, 0);
  });
  return isAnimatingBoom;
}
