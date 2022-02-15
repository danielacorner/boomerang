import { useGameStateRef, usePlayerRef } from "../../store";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useControls } from "leva";
import { useState } from "react";

export function useAnimateMage() {
  // when we pick up the first boomerang, we want to animate the mage
  const [gameStateRef] = useGameStateRef();
  const [playerRef] = usePlayerRef();

  const [isAnimatingBoom, setIsAnimatingBoom] = useState(false);

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
    }

    // animate the mage up
    const MAGE_UP = [0, 14, 0];
    cylinderRef.current.position.set(
      THREE.MathUtils.lerp(cylinderRef.current.position.x, MAGE_UP[0], 0.1),
      THREE.MathUtils.lerp(cylinderRef.current.position.y, MAGE_UP[1], 0.06),
      THREE.MathUtils.lerp(cylinderRef.current.position.z, MAGE_UP[2], 0.1)
    );

    cylinderRef.current.rotation.set(
      0,
      0,
      0
      // lerp(cylinderRef.current.rotation.x, MAGE_UP.rotation[0]),
      // lerp(cylinderRef.current.rotation.y, MAGE_UP.rotation[1]),
      // lerp(cylinderRef.current.rotation.z, MAGE_UP.rotation[2])
    );
    cylinderApi.velocity.set(0, 0, 0);
    cylinderApi.angularVelocity.set(0, 0, 0);
  });
  return isAnimatingBoom;
}
