import { useRef, useState } from "react";
import MoneyBag from "../GLTFs/MoneyBag";
import { useMount } from "react-use";
import { useCylinder } from "@react-three/cannon";
import { useGameState, usePlayerState } from "../../store";
import { useFrame } from "@react-three/fiber";

const BAG_RADIUS = 1;

const MAX_BAGS_DROPPED = 10;
export function DroppedMoney({ position }) {
  const numBags = useRef(Math.ceil(Math.random() * MAX_BAGS_DROPPED)).current;
  return (
    <group>
      <Bag {...{ position }} />
    </group>
  );
}
const UNMOUNT_DELAY = 10 * 1000;

function Bag({ position }) {
  const [mounted, setMounted] = useState(true);

  return mounted ? <BagContent {...{ position, setMounted }} /> : null;
}
function BagContent({ position, setMounted }) {
  const [, setGameState] = useGameState();
  const [ref, api] = useCylinder(() => ({
    args: [1, 1, BAG_RADIUS, 6],
    mass: 1,
    position,
    onCollide: (e) => {
      // when the player touches it, gain +1 money
      if (e.body.name === "player") {
        setGameState((p) => ({ ...p, money: p.money + 1 }));
        setMounted(false);
      }
    },
  }));
  useMount(() => {
    if (!ref.current) {
      return;
    }
    const worldPoint: [number, number, number] = [
      ref.current.position.x,
      ref.current.position.y - BAG_RADIUS / 2,
      ref.current.position.z,
    ];
    const kickUp: [number, number, number] = [
      Math.random() * 0.5 - 0.25,
      Math.random() * -1,
      Math.random() * 0.5 - 0.25,
    ];

    api.applyImpulse(kickUp, worldPoint);

    setTimeout(() => setMounted(false), UNMOUNT_DELAY);
  });

  // pull the bag towards the player
  const [{ playerPosition }] = usePlayerState();
  useFrame(() => {
    if (!ref.current || !playerPosition) return;
    const direction = [
      playerPosition[0] - position[0],
      playerPosition[1] - position[1],
      playerPosition[2] - position[2],
    ];
    const distance = Math.sqrt(
      direction[0] * direction[0] +
        direction[1] * direction[1] +
        direction[2] * direction[2]
    );
    const force: [number, number, number] = [
      direction[0] / distance,
      direction[1] / distance,
      direction[2] / distance,
    ];
    api.applyForce(force, position);
  });

  return (
    <mesh ref={ref} scale={0.1}>
      <mesh position={[0, -4, 0]}>
        <MoneyBag />
      </mesh>
    </mesh>
  );
}
