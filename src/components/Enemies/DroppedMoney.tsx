import { useRef, useState } from "react";
import MoneyBag from "../GLTFs/MoneyBag";
import { useSpring, animated } from "@react-spring/three";
import { useMount } from "react-use";
export function DroppedMoney({ position }) {
  return (
    <group position={position}>
      <Bag />
      <Bag />
      <Bag />
      <Bag />
      <Bag />
    </group>
  );
}
function Bag() {
  const [position, setPosition] = useState([0, 0, 0]);

  useMount(() => {
    setPosition([
      Math.random() * 5 - 2,
      Math.random() * 5 - 2,
      Math.random() * 5 - 2,
    ]);
  });

  const posAnimated = useSpring({ position });
  return (
    <animated.mesh scale={0.1} position={posAnimated as any}>
      <MoneyBag />
    </animated.mesh>
  );
}
