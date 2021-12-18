import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { Scene } from "./components/Scene";
import { Suspense } from "react";
import { DebugMode } from "./DebugMode";

const CAMERA_DISTANCE = 20;

export function CanvasAndScene() {
  return (
    <Canvas
      camera={{
        position: [0, CAMERA_DISTANCE, -CAMERA_DISTANCE],
        // rotation: [1, 0, 0],
      }}
    >
      <Suspense fallback={null}>
        <Physics gravity={[0, -9.81, 0]}>
          <DebugMode>
            <Scene />
          </DebugMode>
        </Physics>
      </Suspense>
    </Canvas>
  );
}
