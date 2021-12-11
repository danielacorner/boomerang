import { Player } from "./Player/Player";
import { Ground } from "./Ground";
import JeffBezos from "./GLTFs/JeffBezos";
import { useControls } from "leva";
import { OrbitControls } from "@react-three/drei";

export function Scene() {
  return (
    <mesh>
      <Ground />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Player />
      <Enemy />
      <OrbitControls />
    </mesh>
  );
}
export type Direction = "ArrowUp" | "ArrowLeft" | "ArrowRight" | "ArrowDown";

function Enemy() {
  const { x, y, z } = useControls({ x: 0, y: 0, z: 0 });

  return (
    <mesh position={[x, y, z]}>
      <meshBasicMaterial color={"#FFFFFF"} />
      <sphereBufferGeometry attach="geometry" args={[1, 32, 32]} />
      <JeffBezos />;
    </mesh>
  );
}
