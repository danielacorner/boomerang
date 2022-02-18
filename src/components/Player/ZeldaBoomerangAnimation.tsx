import BoomerangModel from "../GLTFs/BoomerangModel";
import { usePlayerPositionRef } from "../../store";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { ANIMATE_HEIGHT } from "../../utils/constants";
import {
  Cloud,
  Sky,
  SpotLight,
  Stars,
  useDepthBuffer,
  useDetectGPU,
} from "@react-three/drei";

const CLOUD_HEIGHT = ANIMATE_HEIGHT + 13;
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
  const gpu = useDetectGPU();

  return (
    <>
      {gpu.tier > 2 && (
        <>
          <Stars
            radius={100}
            depth={500}
            count={5000}
            factor={10}
            saturation={0}
            fade
          />

          {/* <fog attach="fog" args={["white", 0, 40]} /> */}

          {/* <Environment preset="dawn" /> */}
          {/* <Sky sunPosition={[x, y, z]} rayleigh={rayleigh} /> */}
          <Sky rayleigh={0.1} inclination={0.91} azimuth={0.25} />
        </>
      )}
      {[...new Array(gpu.tier > 2 ? 50 : gpu.tier > 1 ? 8 : 0)].map((_, i) => (
        <Cloud
          key={i}
          position={[
            THREE.MathUtils.randFloatSpread(100),
            THREE.MathUtils.randFloat(CLOUD_HEIGHT, CLOUD_HEIGHT + 10),
            THREE.MathUtils.randFloatSpread(100),
          ]}
        />
      ))}

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
        <pointLight intensity={0.5} distance={24} position={[0, 1, -2]} />
        <BoomerangModel {...{ idx: null, rotation: [-0.81, -1.38, 0] }} />
      </mesh>
    </>
  );
}
