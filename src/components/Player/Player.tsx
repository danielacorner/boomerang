import { useGLTF } from "@react-three/drei";
import { useState } from "react";
import { useKey, useMouse } from "react-use";
import BlackMage from "../GLTFs/BlackMage";
import { usePlayerControls } from "./usePlayerControls";
import { useThree } from "@react-three/fiber";
import { BoomerangWithControls } from "./BoomerangWithControls";

export function Player() {
  const [ref] = usePlayerControls();
  const { scene, ...stuff } = useGLTF("/models/black_mage/scene.gltf");
  return (
    <>
      <mesh ref={ref}>
        <BlackMage />
      </mesh>
      <BoomerangWithControls ref={ref} />
    </>
  );
}
