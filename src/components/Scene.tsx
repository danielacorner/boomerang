import { Player } from "./Player/Player";
import { Ground } from "./Ground";
import { Instance, Instances, OrbitControls } from "@react-three/drei";
import { Enemy } from "./Enemy";

export function Scene() {
  return (
    <mesh>
      <Ground />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Player />
      <Enemies />
      <OrbitControls />
    </mesh>
  );
}
export type Direction = "ArrowUp" | "ArrowLeft" | "ArrowRight" | "ArrowDown";

function Enemies() {
  const enemies = [...new Array(5)].map((_) => ({
    id: Math.random() * 10 ** 16,
  }));
  return (
    <>
      {enemies.map((e) => (
        <Enemy key={e.id} />
      ))}
    </>
  );
}
