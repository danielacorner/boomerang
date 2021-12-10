import { Canvas } from "@react-three/fiber";
import styled from "styled-components";
import { Debug, Physics } from "@react-three/cannon";
import { Scene } from "./components/Scene";
import { Joystick } from "./components/Joystick";
import { useMediaQuery } from "@mui/material";
function App() {
  return (
    <AppStyles>
      <CanvasAndScene />
      <Controls />
    </AppStyles>
  );
}
const AppStyles = styled.div`
  height: 100vh;
`;

export default App;

function CanvasAndScene() {
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
function Controls() {
  const isTouchDevice = useMediaQuery(`(max-width: ${900}px)`);

  return <>{isTouchDevice ? <Joystick /> : null}</>;
}
