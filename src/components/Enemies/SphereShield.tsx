import { useState } from "react";
import { animated, useSpring } from "@react-spring/three";
import { useInterval } from "react-use";
import { useEnemies } from "../../store";

export default function SphereShield({ id, ...meshProps }) {
  const [shieldActive, setShieldActive] = useState(false);
  const [shieldInvisible, setShieldInvisible] = useState(true);

  const [, setEnemies] = useEnemies();

  const setInvulnerable = (isInvulnerable: boolean) => {
    setEnemies((p) =>
      p.map((enemy) =>
        enemy.id === id ? { ...enemy, invulnerable: isInvulnerable } : enemy
      )
    );
  };
  const SHIELD_DURATION = 2 * 1000;
  const SHIELD_INTERVAL = 9 * 1000;
  useInterval(() => {
    setShieldActive(true);
    setInvulnerable(true);
    setShieldInvisible(false);
    setTimeout(() => {
      setShieldActive(false);
      setInvulnerable(false);
      setTimeout(() => {
        setShieldInvisible(true);
      }, 300);
    }, SHIELD_DURATION);
  }, SHIELD_INTERVAL);

  const { shieldOpacity } = useSpring({
    shieldOpacity: shieldActive ? 0.5 : 0,
    config: {
      mass: 1,
      tension: 100,
      friction: 50,
    },
  });

  return shieldInvisible ? null : (
    <mesh {...meshProps}>
      <sphereBufferGeometry args={[1, 32, 32]} />
      <animated.meshLambertMaterial
        transparent={true}
        opacity={shieldOpacity}
        color={0x950000}
      />
    </mesh>
  );
}
