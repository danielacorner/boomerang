import { usePlayerPositionRef, usePlayerState } from "../../store";
import { useSpring, animated } from "@react-spring/three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { BlinkingWaveAnimation } from "./BlinkingWaveAnimation";

export function RangeupIndicator() {
  const [{ rangeUp }] = usePlayerState();
  const { scale } = useSpring({ scale: rangeUp ? 1.5 : 0 });
  const ref = useRef<THREE.Mesh | null>(null);
  const [playerPositionRef] = usePlayerPositionRef();
  useFrame(() => {
    if (!ref.current || !playerPositionRef.current) return;
    ref.current.position.set(...playerPositionRef.current);
  });

  // TODO: blinking radio waves animation, one from the player's position, one from the boomerang's position

  return (
    <mesh ref={ref}>
      <animated.mesh scale={scale} position={[0, 5, 0]}>
        <BlinkingWaveAnimation offsetTime={0} />
        <BlinkingWaveAnimation offsetTime={0.5} />
        <BlinkingWaveAnimation offsetTime={1} />
      </animated.mesh>
    </mesh>
  );
}
