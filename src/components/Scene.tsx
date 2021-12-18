import { Player } from "./Player/Player";
import { Ground } from "./Ground";
import { Enemies } from "./Enemies/Enemies";
import { Collisions } from "./Player/Collisions";
import { Lighting } from "./Lighting";
import { OrbitControls } from "@react-three/drei";

export function Scene() {
  return (
    <mesh>
      <Ground />
      <Lighting />
      <Player />
      <Enemies />
      {/* <Collisions /> */}
      <OrbitControls />
    </mesh>
  );
}
export type Direction = "ArrowUp" | "ArrowLeft" | "ArrowRight" | "ArrowDown";
