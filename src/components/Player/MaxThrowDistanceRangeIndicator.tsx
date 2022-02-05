import { BoomerangTarget } from "./Boomerang/BoomerangTarget";
import {
  useHeldBoomerangs,
  usePlayerPositionRef,
  usePlayerState,
} from "../../store";
import { MAX_THROW_DISTANCE } from "../../utils/constants";
import { BoomerangWithControls } from "./Boomerang/BoomerangWithControls";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useSpring, animated } from "@react-spring/three";

/** a white torus of radius MAX_THROW_DISTANCE */
export function MaxThrowDistanceRangeIndicator() {
  const [{ rangeUp }] = usePlayerState();
  // if it's above the max distance, shrink it down to the max distance
  const [{ scale }] = useSpring(
    () => ({
      scale: rangeUp ? 3 : 1,
    }),
    [rangeUp]
  );
  const [playerPositionRef] = usePlayerPositionRef();
  const ref = useRef<THREE.Mesh | null>(null);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.set(
      playerPositionRef.current[0],
      playerPositionRef.current[1],
      playerPositionRef.current[2]
    );
  });
  return (
    <animated.mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} scale={scale}>
      <torusBufferGeometry
        attach="geometry"
        args={[MAX_THROW_DISTANCE, 0.2, 8, 32]}
      />
      <meshBasicMaterial
        attach="material"
        transparent={true}
        opacity={0.15}
        color={0xdcfcfc}
      />
    </animated.mesh>
  );
}
export function Boomerang() {
  const [heldBoomerangs] = useHeldBoomerangs();

  return (
    <>
      {heldBoomerangs.map((_, idx) => (
        <BoomerangWithControls
          key={idx}
          {...{
            idx,
          }}
        />
      ))}
      <BoomerangTarget />
    </>
  );
}
