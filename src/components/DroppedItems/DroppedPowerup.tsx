import { useCylinder } from "@react-three/cannon";
import { useGLTF } from "@react-three/drei";
import { useState } from "react";
import { useMount } from "react-use";
import { PLAYER_NAME, POWERUP_NAME } from "../../utils/constants";

const POWERUP_HEIGHT = 2;
const POWERUP_DROP_DURATION = 24 * 1000;
export function DroppedPowerup({ position }) {
  const [mounted, setMounted] = useState(true);
  useMount(() => {
    setTimeout(() => {
      setMounted(false);
    }, POWERUP_DROP_DURATION);
  });
  return mounted ? (
    <DroppedPowerupContent {...{ position, setMounted }} />
  ) : null;
}
export function DroppedPowerupContent({ position, setMounted }) {
  const [ref, api] = useCylinder(() => ({
    args: [2, 2, POWERUP_HEIGHT, 6],
    mass: 200,
    position,
    onCollide: (e) => {
      const isCollisionWithPlayer = e.body.name === PLAYER_NAME;
      if (isCollisionWithPlayer) {
        setMounted(false);
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
