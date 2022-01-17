import { useCylinder } from "@react-three/cannon";
import { useState } from "react";
import { useMount } from "react-use";
import {
  BOOMERANG_NAME,
  GROUP1,
  PLAYER_NAME,
  POWERUP_NAME,
} from "../../utils/constants";
import { Powerup } from "./Powerup";

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
    collisionFilterGroup: GROUP1,
    args: [2, 2, POWERUP_HEIGHT, 6],
    mass: 200,
    position,
    onCollide: (e) => {
      const isCollisionWithPlayer = e.body.name === PLAYER_NAME;
      if (isCollisionWithPlayer) {
        setMounted(false);
      }

      if (e.body.name.includes(BOOMERANG_NAME)) {
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
