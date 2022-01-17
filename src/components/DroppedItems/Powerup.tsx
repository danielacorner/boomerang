import { useGLTF } from "@react-three/drei";

export function Powerup(props) {
  const { scene } = useGLTF("/models/power-up_mushroom/scene.gltf");
  return (
    <mesh {...props}>
      <primitive object={scene} />
    </mesh>
  );
}
useGLTF.preload("/models/power-up_mushroom/scene.gltf");
