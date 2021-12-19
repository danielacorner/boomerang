import { useCylinder } from "@react-three/cannon";
import { useGLTF } from "@react-three/drei";
import { POWERUP_NAME } from "../../utils/constants";

const POWERUP_HEIGHT = 0.5;
export function DroppedPowerup({ position }) {
  const [ref, api] = useCylinder(() => ({
    args: [3, 1, POWERUP_HEIGHT, 6],
    mass: 100,
    position: position.current,
  }));
  return (
    <mesh ref={ref} name={POWERUP_NAME}>
      <Powerup {...{ position }} />
    </mesh>
  );
}

function Powerup(props) {
  const { scene } = useGLTF("/models/power-up_mushroom/scene.gltf");
  return (
    <mesh {...props}>
      <primitive object={scene} />
    </mesh>
  );
}
