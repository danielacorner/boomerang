import { Environment, Sky } from "@react-three/drei";

export function Lighting() {
  const { x, y, z } = { x: -0.02, y: 0.01, z: 0 };
  const { rayleigh } = { rayleigh: 0.7 };
  return (
    <>
      <ambientLight intensity={0.6} />
      {/* <directionalLight
        position={[0, 10, 0]}
        intensity={1.5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      /> */}
      <directionalLight
        castShadow
        position={[-1.8, 8, 2]}
        intensity={1}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        // shadow-camera-far={50}
        // shadow-camera-left={-10}
        // shadow-camera-right={10}
        // shadow-camera-top={10}
        // shadow-camera-bottom={-10}
      />

      {/* <pointLight position={[-10, 0, -20]} color="red" intensity={2.5} /> */}
      {/* <pointLight position={[0, -10, 0]} intensity={1.5} /> */}
      {/* <fog attach="fog" args={["white", 0, 40]} /> */}

      <Environment preset="dawn" />
      {/* <Sky sunPosition={[x, y, z]} rayleigh={rayleigh} /> */}
    </>
  );
}
