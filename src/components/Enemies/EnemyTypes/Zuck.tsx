import JeffBezos from "../../GLTFs/JeffBezos";
import MarkZuckerberg from "../../GLTFs/MarkZuckerberg";
import ElonMusk from "../../GLTFs/ElonMuskRunning";

export const Zuck = () => (
  <group
    castShadow={true}
    receiveShadow={true}
    scale={2}
    position={[0, -1.3, 0]}
    rotation={[0, -1, 0]}
  >
    <MarkZuckerberg />
  </group>
);
export const Bezos = () => (
  <group
    castShadow={true}
    receiveShadow={true}
    scale={3.6}
    position={[0, 0, 0]}
    rotation={[0, 0, 0]}
  >
    <JeffBezos />
  </group>
);
export const Musk = () => (
  <group
    castShadow={true}
    receiveShadow={true}
    scale={2}
    position={[0, -1.6, 0]}
    rotation={[0, 0, 0]}
  >
    <ElonMusk />
  </group>
);
