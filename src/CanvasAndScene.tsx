import { Canvas } from "@react-three/fiber";
import { Debug, Physics } from "@react-three/cannon";
import { Scene } from "./components/Scene";
import { Joystick } from "./components/Joystick/Joystick";
import { Portal, ToggleButton, useMediaQuery } from "@mui/material";
import { Suspense, useState } from "react";
import { Html } from "@react-three/drei";

export function CanvasAndScene() {
  return (
    <Canvas
      camera={{
        position: [0, 10 * (8 / 3), 1],
      }}
    >
      <Suspense fallback={null}>
        <Physics>
          <DebugInDev>
            <Scene />
          </DebugInDev>
        </Physics>
      </Suspense>
    </Canvas>
  );
}
function DebugInDev({ children }) {
  const [isOn, setIsOn] = useState(false);
  // const isDev = process.env.NODE_ENV === "development";
  return (
    <>
      <Html
        style={{
          zIndex: 1,
        }}
      >
        <Portal>
          <ToggleButton
            value="check"
            selected={isOn}
            onChange={() => setIsOn(!isOn)}
            style={{ textTransform: "none", position: "fixed", bottom: 0 }}
          >
            {isOn ? "❌ Debug off" : "Debug mode 🐛"}
          </ToggleButton>
        </Portal>
      </Html>
      {isOn ? <Debug>{children}</Debug> : children}
    </>
  );
}
export function Controls() {
  const isTouchDevice = useMediaQuery(`(max-width: ${900}px)`);

  return <>{isTouchDevice ? <Joystick /> : null}</>;
}
