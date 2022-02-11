import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { Scene } from "./components/Scene";
import { Suspense, useRef } from "react";
import { DebugMode } from "./DebugMode";
import { Loader, Stats } from "@react-three/drei";
import * as THREE from "three";
import Effects from "./components/Effects";
import { CAMERA_POSITIONS } from "./utils/constants";

export function CanvasAndScene() {
  return (
    <>
      <Loader />
      <Canvas
        mode="concurrent"
        frameloop="demand"
        gl={{ alpha: false, antialias: false }}
        performance={{ min: 0.8 }}
        shadows
        camera={{
          position: CAMERA_POSITIONS.CLOSEUP,
          // fov: 50,
          // near: 0.5,
          // far: 100,
          // rotation: [1, 0, 0],
        }}
      >
        {process.env.NODE_ENV === "development" && <Stats />}
        <fog attach="fog" args={["#000", 0.5, 200]} />
        <Suspense fallback={null}>
          <Physics gravity={[0, -9.81, 0]}>
            <DebugMode>
              <Scene />
            </DebugMode>
          </Physics>
        </Suspense>
        {/* https://docs.pmnd.rs/react-three-fiber/advanced/scaling-performance */}
        <Effects />
      </Canvas>
    </>
  );
}

function useLerpedMouse() {
  const mouse = useThree((state) => state.mouse);
  const lerped = useRef(mouse.clone());
  const previous = new THREE.Vector2();
  useFrame((state) => {
    previous.copy(lerped.current);
    lerped.current.lerp(mouse, 0.1);
    // Regress system when the mouse is moved
    if (!previous.equals(lerped.current)) state.performance.regress();
  });
  return lerped;
}
