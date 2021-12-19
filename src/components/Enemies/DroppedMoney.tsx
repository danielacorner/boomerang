import { useRef, useState } from "react";
import MoneyBag from "../GLTFs/MoneyBag";
import { useSpring, animated } from "@react-spring/three";
import { useMount } from "react-use";
import { useSphere } from "@react-three/cannon";

const BAG_RADIUS = 0.4;

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
  const [mounted, setMounted] = useState(false);
  const [ref, api] = useSphere(() => ({
    mass: 0.1,
    position: [0, 0, 0],
    args: [BAG_RADIUS],
  }));
  useMount(() => {
    if (!ref.current) {
      return;
    }
    setMounted(true);
    const worldPoint: [number, number, number] = [
      ref.current.position.x,
      ref.current.position.y - BAG_RADIUS / 2,
      ref.current.position.z,
    ];
    const kickUp: [number, number, number] = [
      Math.random() * 0.5 - 0.25,
      Math.random() * -2,
      Math.random() * 0.5 - 0.25,
    ];

    api.applyImpulse(kickUp, worldPoint);
  });

  const { opacity } = useSpring({
    opacity: mounted ? 1 : 0,
    config: { mass: 100, tension: 50, friction: 50 },
  });

  return (
    <animated.mesh
      ref={ref}
      scale={0.1}
      material-transparent={true}
      material-opacity={opacity}
    >
      <MoneyBag />
    </animated.mesh>
  );
}
