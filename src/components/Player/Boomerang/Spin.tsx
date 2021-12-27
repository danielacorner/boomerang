import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const ROTATION_SPEED = -0.2;

export function Spin({ stop = false, children }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!ref.current) return;

    const nextRot = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      ref.current.rotation.y + ROTATION_SPEED,
      stop ? 0 : 1
    );
    ref.current.rotation.set(0, nextRot, 0);
  });

  return <mesh ref={ref}>{children}</mesh>;
}
