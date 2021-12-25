import { Canvas, useThree } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { Scene } from "./components/Scene";
import { Suspense, useRef } from "react";
import { DebugMode } from "./DebugMode";
import { Loader, Plane, Sphere } from "@react-three/drei";
import * as THREE from "three";

const CAMERA_DISTANCE = 26;

export function CanvasAndScene() {
  return (
    <>
      <Loader />
      <Canvas
        shadows
        camera={{
          position: [1, CAMERA_DISTANCE * 2, -CAMERA_DISTANCE],
          fov: 50,
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
    </>
  );
}
