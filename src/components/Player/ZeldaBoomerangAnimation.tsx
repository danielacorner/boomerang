import BoomerangModel from "../GLTFs/BoomerangModel";
import { usePlayerPositionRef } from "../../store";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { ANIMATE_HEIGHT } from "../../utils/constants";
import { SpotLight, useDepthBuffer } from "@react-three/drei";

export function ZeldaBoomerangAnimation() {
  const [playerPositionRef] = usePlayerPositionRef();
  const ref = useRef<THREE.Mesh | null>(null);
  const spotlightRef = useRef<THREE.SpotLight | null>(null);
  useFrame(() => {
    if (!ref.current || !spotlightRef.current) {
      return;
    }
    ref.current.position.set(
      playerPositionRef.current[0],
      THREE.MathUtils.lerp(
        ref.current.position.y,
        playerPositionRef.current[1] + ANIMATE_HEIGHT,
        0.08
      ),
      playerPositionRef.current[2]
    );

    spotlightRef.current.position.set(
      playerPositionRef.current[0],
      playerPositionRef.current[1] + ANIMATE_HEIGHT + 5,
      playerPositionRef.current[2]
    );
    // spotlightRef.current.lookAt(
    //   playerPositionRef.current[0],
    //   playerPositionRef.current[1] + 2,
    //   playerPositionRef.current[2]
    // );
  });
  const depthBuffer = useDepthBuffer();

  return (
    <>
      <SpotLight
        ref={spotlightRef}
        depthBuffer={depthBuffer}
        color={"#9e9a5b"}
        intensity={0.4}
        angle={0.4}
        attenuation={5}
        opacity={0.3}
      />
      <mesh ref={ref}>
        <BoomerangModel {...{ idx: null, rotation: [-0.81, -1.38, 0] }} />
      </mesh>
    </>
  );
}
