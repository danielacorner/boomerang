import { Enemy } from "./Enemy";
import JeffBezos from "../GLTFs/JeffBezos";
import MarkZuckerberg from "../GLTFs/MarkZuckerberg";
import ElonMusk from "../GLTFs/ElonMuskRunning";

export function Enemies() {
  return (
    <>
      <Enemy>
        <group scale={1.8} position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <JeffBezos />
        </group>
      </Enemy>
      <Enemy>
        <group scale={1} position={[0, -1.3, 0]} rotation={[0, -1, 0]}>
          <MarkZuckerberg />
        </group>
      </Enemy>
      <Enemy>
        <group scale={1} position={[0, -1.6, 0]} rotation={[0, 0, 0]}>
          <ElonMusk />
        </group>
      </Enemy>
    </>
  );
}
