import { usePlayerPositionRef, usePlayerState } from "../../store";
import { useSpring, animated } from "@react-spring/three";
import { RANGEUP_DURATION } from "./usePlayerControls";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

const TIMER_TICKS = [...new Array(RANGEUP_DURATION / 1000)];

export function RangeupCircularTimer(props) {
  const [{ rangeUp }] = usePlayerState();
  const { scale } = useSpring({ scale: rangeUp ? 0.6 : 0 });
  const [countdownStartTime, setCountdownStartTime] = useState<number | null>(
    null
  );
  const [playerPositionRef] = usePlayerPositionRef();
  const outerRef = useRef<THREE.Mesh | null>(null);
  const refs = TIMER_TICKS.map((t) => useRef<THREE.Mesh | null>(null));
  //
  useFrame(({ clock }) => {
    if (!rangeUp || !outerRef.current) {
      return;
    }
    outerRef.current.position.set(...playerPositionRef.current);
    const time = clock.getElapsedTime();
    if (!countdownStartTime) {
      setCountdownStartTime(time);
      refs.forEach((ref) => {
        if (ref.current) {
          ref.current.scale.set(0.4, 0.4, 0.4);
        }
      });
    } else if (countdownStartTime) {
      const timeSinceStart = time - countdownStartTime;
      const timeSinceStartInTicks = Math.floor(timeSinceStart);
      const tickIndex = Math.min(timeSinceStartInTicks, TIMER_TICKS.length - 1);
      console.log(
        "🌟🚨 ~ file: RangeupCircularTimer.tsx ~ line 36 ~ useFrame ~ tickIndex",
        tickIndex
      );
      const tickRef = refs[tickIndex];
      console.log(
        "🌟🚨 ~ file: RangeupCircularTimer.tsx ~ line 38 ~ useFrame ~ tickRef",
        tickRef
      );
      if (tickRef.current) {
        tickRef.current.scale.set(0, 0, 0);
        // tickRef.current.scale.set(0, 0, 0);
      }
      if (timeSinceStart > RANGEUP_DURATION) {
        setCountdownStartTime(null);
      }
    }
  });

  return (
    <animated.mesh
      ref={outerRef}
      scale={scale}
      position={[0, 0, 0]}
      rotation={[0, 0, Math.PI]}
      {...props}
    >
      {/* for each second, show a sphere in a circle around the player's feet */}
      {TIMER_TICKS.map((_, idx) => {
        const tickProgress = idx / TIMER_TICKS.length;
        const tickRef = refs[idx];

        return (
          <mesh
            ref={tickRef}
            key={idx}
            scale={0.4}
            position={[
              Math.sin(tickProgress * Math.PI * 2) * RADIUS,
              0,
              Math.cos(tickProgress * Math.PI * 2) * RADIUS,
            ]}
          >
            <sphereBufferGeometry attach="geometry" args={[1, 16, 16]} />
            <meshBasicMaterial
              attach="material"
              color={"#70d9f3"}
              opacity={0.5}
              transparent={true}
            />
          </mesh>
        );
      })}
    </animated.mesh>
  );
}
const RADIUS = 5;
