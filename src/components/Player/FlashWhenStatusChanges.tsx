import { useEffect, useState } from "react";
import { useHeldBoomerangs } from "../../store";
import { usePrevious } from "react-use";
import { useSpring, animated } from "@react-spring/three";
const FLASH_TIME = 200;

export function FlashWhenStatusChanges({ idx }) {
  const [heldBoomerangs] = useHeldBoomerangs();
  const { status } = heldBoomerangs[idx];
  const [flash, setFlash] = useState(false);
  const prevStatus = usePrevious(status);
  useEffect(() => {
    if (status === "idle" && prevStatus === "returning") {
      setFlash(true);
      setTimeout(() => {
        setFlash(false);
      }, FLASH_TIME);
    }
  }, [status]);

  const { scale, color, opacity } = useSpring({
    scale: flash ? 15 : 0,
    color: flash ? "#ffffff" : "#000",
    opacity: flash ? 0.4 : 0,
    config: {
      mass: 1,
      tension: flash ? 220 : 50,
      friction: 15,
      clamp: true,
    },
  });

  return (
    <animated.mesh scale={scale} position={[-0.25, -0.25, -0.25]}>
      <sphereBufferGeometry args={[0.1]} />
      <animated.meshBasicMaterial
        color={color}
        transparent={true}
        opacity={opacity}
      />
    </animated.mesh>
  );
}
