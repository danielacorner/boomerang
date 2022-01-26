import { useFrame } from "@react-three/fiber";
import { EffectComposer, SSAO, Bloom } from "@react-three/postprocessing";
import { useRef } from "react";
import { KernelSize, BlendFunction } from "postprocessing";

export default function Effects() {
  const ref = useRef(null as any);
  useFrame((state) => {
    // Disable SSAO on regress
    ref.current.blendMode.setBlendFunction(
      state.performance.current < 1
        ? BlendFunction.SKIP
        : BlendFunction.MULTIPLY
    );
  });
  return (
    <EffectComposer multisampling={8}>
      <SSAO
        ref={ref}
        intensity={15}
        radius={10}
        luminanceInfluence={0}
        bias={0.035}
      />
      <Bloom
        kernelSize={KernelSize.LARGE}
        luminanceThreshold={0.55}
        luminanceSmoothing={0.2}
      />
    </EffectComposer>
  );
}
