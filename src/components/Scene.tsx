import { Player } from "./Player/Player";
import { Enemies } from "./Enemies/Enemies";
import { Lighting } from "./Lighting";
import { DroppedItems } from "./DroppedItems/DroppedItems";
import { Ground } from "./Ground";
import { AdaptiveDpr, Sky, useDetectGPU } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useKeyboardListeners } from "./Player/usePressedKeys";
import { useDetectDash } from "./useDetectDash";
import { NextLevelDoor } from "./NextLevelDoor";

export function Scene() {
  useFrame(({ performance }) => {
    performance.regress();
  });
  useKeyboardListeners();
  useDetectDash();
  const gpu = useDetectGPU();
  return (
    <mesh>
      <Lighting />
      <Player />
      <Enemies />
      <DroppedItems />
      <Ground />
      {gpu.tier <= 2 && <AdaptiveDpr pixelated />}
      <NextLevelDoor />
      <color attach="background" args={["#000"]} />
    </mesh>
  );
}
export type Direction = "ArrowUp" | "ArrowLeft" | "ArrowRight" | "ArrowDown";
