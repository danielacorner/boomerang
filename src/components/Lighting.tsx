import { Environment, Sky } from "@react-three/drei";
import { useControls } from "leva";

export function Lighting() {
  const { x, y, z } = useControls({ x: -4, y: 9, z: 4 });
  const { rayleigh } = { rayleigh: 0.7 };
  return (
    <>
      <directionalLight
        castShadow
        position={[x, y, z]}
        intensity={1}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={500}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <ambientLight intensity={0.35} />
    </>
  );
}
