import { useCylinder } from "@react-three/cannon";
import { useRef, useState } from "react";
import { useMount } from "react-use";
import {
  BOOMERANG_NAME,
  GROUP_1,
  PLAYER_NAME,
  POWERUP_NAME,
} from "../../utils/constants";
import { Powerup } from "../GLTFs/Powerup";

const POWERUP_HEIGHT = 2;
const POWERUP_INVULNERABLE_DURATION = 2 * 1000;

export function DroppedPowerup({ position, setMounted, id }) {
  const [interactive, setInteractive] = useState(false);
  useMount(() => {
    setTimeout(() => {
      setInteractive(true);
    }, POWERUP_INVULNERABLE_DURATION);
  });

  const [ref, api] = useCylinder(
    () => ({
      collisionFilterGroup: GROUP_1,
      args: [2, 2, POWERUP_HEIGHT, 6],
      mass: 200,
      position,
      type: interactive ? "Dynamic" : "Static",
      onCollide: (e) => {
        const isCollisionWithPlayer = e.body?.name === PLAYER_NAME;
        if (isCollisionWithPlayer) {
          setMounted(false);
        }

        if (e.body?.name.includes(BOOMERANG_NAME) && interactive) {
          setMounted(false);
        }
      },
    }),
    null,
    [interactive]
  );
  return (
    <mesh ref={ref} name={POWERUP_NAME}>
      <Powerup />
    </mesh>
  );
}
