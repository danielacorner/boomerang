import { useRef } from "react";
import MoneyBag from "../GLTFs/MoneyBag";

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
  const position = useRef([
    Math.random() * 5 - 2,
    Math.random() * 5 - 2,
    Math.random() * 5 - 2,
  ]).current;
  return (
    <mesh scale={0.1} position={position as any}>
      <MoneyBag />
    </mesh>
  );
}
