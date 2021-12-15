import { Enemy } from "./Enemy";
import JeffBezos from "../GLTFs/JeffBezos";
import MarkZuckerberg from "../GLTFs/MarkZuckerberg";

export function Enemies() {
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
      {/* <Enemy>
              <group scale={1} rotation={[0, 0, 0]}>
                <ElonMusk />
              </group>
            </Enemy> */}
    </>
  );
}
