import {
  useGameStateRef,
  usePlayerPositionRef,
  usePlayerState,
} from "../../store";
import { useSpring, animated } from "@react-spring/three";
import { RANGEUP_DURATION } from "./movement/usePlayerControls";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

const TIMER_TICKS = [...new Array(RANGEUP_DURATION / 1000)];
const SCALE = 0.7;
const RADIUS = 10;
export function RangeupCircularTimer(props) {
  const [{ rangeUp, rangeUpStartTime }, setPlayerState] = usePlayerState();
  const { scale } = useSpring({ scale: rangeUp ? 0.6 : 0 });

  const [playerPositionRef] = usePlayerPositionRef();
  const [gameStateRef] = useGameStateRef();
  const outerRef = useRef<THREE.Mesh | null>(null);
  const refs = TIMER_TICKS.map((t) => useRef<THREE.Mesh | null>(null));

  // count down the rangeUpStartTime
  useFrame(({ clock }) => {
    if (!gameStateRef.current.rangeUpStartTime || !outerRef.current) {
      return;
    }
    outerRef.current.position.set(...playerPositionRef.current);
    const time = clock.getElapsedTime();
    const timeSinceStart = time - gameStateRef.current.rangeUpStartTime;

    const timeSinceStartInTicks = Math.floor(timeSinceStart);
    const tickIndex = Math.min(timeSinceStartInTicks, TIMER_TICKS.length - 1);
    const tickRef = refs[tickIndex];

    if (tickRef.current) {
      tickRef.current.scale.set(0, 0, 0);
      // tickRef.current.scale.set(0, 0, 0);
    }
    if (timeSinceStart > RANGEUP_DURATION / 1000 && rangeUp) {
      // stop rangeUp!

      setPlayerState((p) => ({
        ...p,
        rangeUp: false,
        rangeUpStartTime: null,
      }));
      gameStateRef.current = {
        ...gameStateRef.current,
        rangeUp: false,
        rangeUpStartTime: null,
      };
    }
  });

  // when rangeUpStartTime changes, we need to reset the timer
  useEffect(() => {
    if (rangeUpStartTime) {
      refs.forEach((ref) => {
        if (ref.current) {
          ref.current.scale.set(SCALE, SCALE, SCALE);
        }
      });
    }
  }, [rangeUpStartTime]);

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
            scale={SCALE}
            position={[
              Math.sin(tickProgress * Math.PI * 2) * RADIUS,
              0,
              Math.cos(tickProgress * Math.PI * 2) * RADIUS,
            ]}
          >
            <sphereBufferGeometry attach="geometry" args={[1, 16, 16]} />
            <meshStandardMaterial
              metalness={0.5}
              roughness={0.5}
              attach="material"
              color={"#25a1f3"}
              opacity={0.5}
              transparent={true}
            />
          </mesh>
        );
      })}
    </animated.mesh>
  );
}
