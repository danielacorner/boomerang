import { Canvas } from "@react-three/fiber";
import { Debug, Physics } from "@react-three/cannon";
import { Scene } from "./components/Scene";
import { Joystick } from "./components/Joystick/Joystick";
import { useMediaQuery } from "@mui/material";

export function CanvasAndScene() {
  return (
    <Canvas
      camera={{
        position: [0, 10 * (8 / 3), 1],
      }}
    >
      <Physics>
        <DebugInDev>
          <Scene />
        </DebugInDev>
      </Physics>
    </Canvas>
  );
}
function DebugInDev({ children }) {
  const isDev = process.env.NODE_ENV === "development";
  return isDev ? <Debug>{children}</Debug> : children;
}
export function Controls() {
  const isTouchDevice = useMediaQuery(`(max-width: ${900}px)`);

  return <>{isTouchDevice ? <Joystick /> : null}</>;
}
