import { Environment, Sky } from "@react-three/drei";

export function Lighting() {
  const { x, y, z } = { x: -0.02, y: 0.01, z: 0 };
  const { rayleigh } = { rayleigh: 0.7 };
  return (
    <>
      <directionalLight
        castShadow
        position={[-1.8, 8, 2]}
        intensity={1}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={500}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
    </>
  );
}
