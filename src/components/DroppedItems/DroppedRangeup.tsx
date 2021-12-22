import { useCylinder } from "@react-three/cannon";
import { useState } from "react";
import { useMount } from "react-use";
import { PLAYER_NAME, RANGEUP_NAME } from "../../utils/constants";
import Rangeup from "../GLTFs/Rangeup";

const RANGEUP_HEIGHT = 1;
const RANGEUP_DROP_DURATION = 16 * 1000;
export function DroppedRangeup({ position }) {
  const [mounted, setMounted] = useState(true);
  useMount(() => {
    setTimeout(() => {
      setMounted(false);
    }, RANGEUP_DROP_DURATION);
  });
  return mounted ? (
    <DroppedRangeupContent {...{ position, setMounted }} />
  ) : null;
}
export function DroppedRangeupContent({ position, setMounted }) {
  const [ref, api] = useCylinder(() => ({
    args: [3, 1, RANGEUP_HEIGHT, 6],
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
    <mesh ref={ref} name={RANGEUP_NAME}>
      <Rangeup />
    </mesh>
  );
}
