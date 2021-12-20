import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { ROTATION_SPEED } from "./BoomerangWithControls";

export function Spin({ children }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.set(0, ref.current.rotation.y + ROTATION_SPEED, 0);
  });

  return <mesh ref={ref}>{children}</mesh>;
}
