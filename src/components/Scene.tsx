import { Player } from "./Player/Player";
import { Ground } from "./Ground";

export function Scene() {
  return (
    <mesh>
      <Ground />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Player />
    </mesh>
  );
}
export type Direction = "ArrowUp" | "ArrowLeft" | "ArrowRight" | "ArrowDown";
