import { useCylinder } from "@react-three/cannon";
import { useState } from "react";
import { useMount } from "react-use";
import { PLAYER_NAME, BOOMERANG_ITEM_NAME } from "../../utils/constants";
import BoomerangModel from "../GLTFs/BoomerangModel";

const BOOMERANG_ITEM_HEIGHT = 1;
const BOOMERANG_ITEM_DROP_DURATION = 32 * 1000;
export function DroppedBoomerang({ position }) {
  const [mounted, setMounted] = useState(true);
  useMount(() => {
    setTimeout(() => {
      setMounted(false);
    }, BOOMERANG_ITEM_DROP_DURATION);
  });
  return mounted ? (
    <DroppedBoomerangContent {...{ position, setMounted }} />
  ) : null;
}
export function DroppedBoomerangContent({ position, setMounted }) {
  const [ref, api] = useCylinder(() => ({
    args: [2, 2, BOOMERANG_ITEM_HEIGHT, 6],
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
    <mesh ref={ref} name={BOOMERANG_ITEM_NAME}>
      <BoomerangModel />
    </mesh>
  );
}
