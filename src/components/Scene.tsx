import { Player } from "./Player/Player";
import { Ground } from "./Ground";
import { OrbitControls } from "@react-three/drei";
import { Enemy } from "./Enemy";
import JeffBezos from "./GLTFs/JeffBezos";
import ElonMusk from "./GLTFs/ElonMusk";
import MarkZuckerberg from "./GLTFs/MarkZuckerberg";

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
  return (
    <>
      <Enemy>
        <group scale={1.8} position={[0, 1, 0]} rotation={[0, 0, 0]}>
          <JeffBezos />
        </group>
      </Enemy>
      <Enemy>
        <group scale={1} rotation={[0, 0, 0]}>
          <MarkZuckerberg />
        </group>
      </Enemy>
    </>
  );
}
