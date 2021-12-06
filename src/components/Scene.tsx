import { OrbitControls } from "@react-three/drei";
import { Player } from "./Player/Player";
import { Ground } from "./Ground";

export function Scene() {
  return (
    <>
      <OrbitControls {...({} as any)} />
      <Ground />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Player />
    </>
  );
}
export type Direction = "ArrowUp" | "ArrowLeft" | "ArrowRight" | "ArrowDown";
