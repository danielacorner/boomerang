import { useCylinder } from "@react-three/cannon";
import { useGLTF } from "@react-three/drei";
import { PLAYER_NAME, POWERUP_NAME } from "../../utils/constants";

const POWERUP_HEIGHT = 1;
export function DroppedPowerup({ position, unmount }) {
  const [ref, api] = useCylinder(() => ({
    args: [3, 1, POWERUP_HEIGHT, 6],
    mass: 200,
    position,
    onCollide: (e) => {
      const isCollisionWithPlayer = e.body.name === PLAYER_NAME;
      if (isCollisionWithPlayer) {
        unmount();
      }
    },
  }));
  return (
    <mesh ref={ref} name={POWERUP_NAME}>
      <Powerup />
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
