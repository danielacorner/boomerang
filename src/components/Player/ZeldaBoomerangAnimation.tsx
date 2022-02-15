import BoomerangModel from "../GLTFs/BoomerangModel";
import { usePlayerPositionRef } from "../../store";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { ANIMATE_HEIGHT } from "../../utils/constants";
import { SpotLight } from "@react-three/drei";

export function ZeldaBoomerangAnimation() {
  const [playerPositionRef] = usePlayerPositionRef();
  const ref = useRef<THREE.Mesh | null>(null);
  const spotlightRef = useRef<THREE.Mesh | null>(null);
  useFrame(() => {
    if (!ref.current || !spotlightRef.current) {
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

    spotlightRef.current.position.set(
      playerPositionRef.current[0],
      playerPositionRef.current[1] + 9,
      playerPositionRef.current[2]
    );
  });
  return (
    <>
      <mesh ref={spotlightRef}>
        <SpotLight
          lookAt={
            [
              playerPositionRef.current[0],
              playerPositionRef.current[1] + ANIMATE_HEIGHT,
              playerPositionRef.current[2],
            ] as any
          }
          color={"#908c52"}
          intensity={0.4}
          angle={0.3}
        />
      </mesh>
      <mesh ref={ref}>
        <BoomerangModel {...{ idx: null, rotation: [-0.81, -1.38, 0] }} />
      </mesh>
    </>
  );
}
