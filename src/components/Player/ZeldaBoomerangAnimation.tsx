import BoomerangModel from "../GLTFs/BoomerangModel";
import { useControls } from "leva";
import { usePlayerPositionRef } from "../../store";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { ANIMATE_HEIGHT } from "../../utils/constants";

export function ZeldaBoomerangAnimation() {
  const [playerPositionRef] = usePlayerPositionRef();
  const ref = useRef<THREE.Mesh | null>(null);
  useFrame(() => {
    if (!ref.current) {
      return;
    }
    ref.current.position.set(
      playerPositionRef.current[0],
      THREE.MathUtils.lerp(
        ref.current.position.y,
        playerPositionRef.current[1] + ANIMATE_HEIGHT,
        0.05
      ),
      playerPositionRef.current[2]
    );
  });
  return (
    <mesh ref={ref}>
      <BoomerangModel {...{ idx: null, rotation: [-0.81, -1.38, 0] }} />
    </mesh>
  );
}
