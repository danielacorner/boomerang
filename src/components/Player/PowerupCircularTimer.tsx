import { usePlayerPositionRef, usePlayerState } from "../../store";
import { useSpring, animated } from "@react-spring/three";
import { POWERUP_DURATION } from "./usePlayerControls";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

const TIMER_TICKS = [...new Array(POWERUP_DURATION / 1000)];
const SCALE = 1;
const RADIUS = 10;
export function PowerupCircularTimer(props) {
  const [{ poweredUp, poweredUpStartTime }, setPlayerState] = usePlayerState();
  const { scale } = useSpring({ scale: poweredUp ? 0.6 : 0 });

  const [playerPositionRef] = usePlayerPositionRef();
  const outerRef = useRef<THREE.Mesh | null>(null);
  const refs = TIMER_TICKS.map(() => useRef<THREE.Mesh | null>(null));

  useFrame(({ clock }) => {
    if (!poweredUp || !outerRef.current) {
      return;
    }
    outerRef.current.position.set(...playerPositionRef.current);
    const time = clock.getElapsedTime();
    if (poweredUpStartTime) {
      const timeSinceStart = time - poweredUpStartTime;
      const timeSinceStartInTicks = Math.floor(timeSinceStart);
      const tickIndex = Math.min(timeSinceStartInTicks, TIMER_TICKS.length - 1);
      const tickRef = refs[tickIndex];

      if (tickRef.current) {
        tickRef.current.scale.set(0, 0, 0);
        // tickRef.current.scale.set(0, 0, 0);
      }
      if (timeSinceStart > POWERUP_DURATION / 1000 && poweredUp) {
        setPlayerState((p) => ({
          ...p,
          poweredUp: false,
          poweredUpStartTime: null,
        }));
      }
    }
  });

  // when poweredUpStartTime changes, we need to reset the timer
  useEffect(() => {
    if (poweredUpStartTime) {
      refs.forEach((ref) => {
        if (ref.current) {
          ref.current.scale.set(SCALE, SCALE, SCALE);
        }
      });
    }
  }, [poweredUpStartTime]);

  return (
    <animated.mesh
      ref={outerRef}
      scale={scale}
      position={[0, 2, 0]}
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
            <icosahedronBufferGeometry attach="geometry" args={[1, 0]} />
            <meshBasicMaterial
              attach="material"
              color={"#e0764d"}
              opacity={0.5}
              transparent={true}
            />
          </mesh>
        );
      })}
    </animated.mesh>
  );
}
