import { useRef, useState } from "react";
import MoneyBag from "../GLTFs/MoneyBag";
import { useMount } from "react-use";
import { useSphere } from "@react-three/cannon";
import { MeshWobbleMaterial } from "@react-three/drei";

const BAG_RADIUS = 1;

const MAX_BAGS_DROPPED = 10;
export function DroppedMoney({ position }) {
  const numBags = useRef(Math.ceil(Math.random() * MAX_BAGS_DROPPED)).current;
  return (
    <group>
      {[...new Array(numBags)].map((_, idx) => (
        <Bag key={idx} {...{ position }} />
      ))}
      <DroppedDollarBills />
    </group>
  );
}
function DroppedDollarBills() {
  return (
    <mesh>
      <boxBufferGeometry attach="geometry" args={[3, 1, 0.001]} />
      <MeshWobbleMaterial color="#37b830" {...({} as any)} />
    </mesh>
  );
}

const UNMOUNT_DELAY = 3 * 1000;

function Bag({ position }) {
  const [mounted, setMounted] = useState(true);

  return mounted ? <BagContent {...{ position, setMounted }} /> : null;
}
function BagContent({ position, setMounted }) {
  const [ref, api] = useSphere(() => ({
    mass: 0.8,
    position,
    args: [BAG_RADIUS],
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

  return (
    <mesh ref={ref} scale={0.1}>
      <MoneyBag />
    </mesh>
  );
}
