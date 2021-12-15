import { Player } from "./Player/Player";
import { Ground } from "./Ground";
import { OrbitControls } from "@react-three/drei";
import ElonMusk from "./GLTFs/ElonMusk";
import { Enemies } from "./Enemies/Enemies";
import { Collisions } from "./Player/Collisions";

export function Scene() {
  return (
    <mesh>
      <Ground />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Player />
      <Enemies />
      <Collisions />
      <OrbitControls />
    </mesh>
  );
}
export type Direction = "ArrowUp" | "ArrowLeft" | "ArrowRight" | "ArrowDown";
