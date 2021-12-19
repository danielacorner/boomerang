import { useRef, useState } from "react";
import MoneyBag from "../GLTFs/MoneyBag";
import { useSpring, animated } from "@react-spring/three";
import { useMount } from "react-use";
import { useSphere } from "@react-three/cannon";

const BAG_RADIUS = 1;

const MAX_BAGS_DROPPED = 10;
export function DroppedMoney({ position }) {
  return (
    <group>
      {[...new Array(Math.ceil(Math.random() * MAX_BAGS_DROPPED))].map((_) => (
        <Bag {...{ position }} />
      ))}
    </group>
  );
}
function Bag({ position }) {
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
  });

  return (
    <animated.mesh ref={ref} scale={0.1}>
      <MoneyBag />
    </animated.mesh>
  );
}
