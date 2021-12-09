import { Canvas } from "@react-three/fiber";
import styled from "styled-components";
import { Physics } from "@react-three/cannon";
import { Scene } from "./components/Scene";
import { Joystick } from "./components/Joystick";
function App() {
  return (
    <AppStyles>
      <Canvas
        camera={{
          position: [0, 10 * (8 / 3), 1],
        }}
      >
        <Physics>
          <Scene />
        </Physics>
      </Canvas>
      <Controls />
    </AppStyles>
  );
}
const AppStyles = styled.div`
  height: 100vh;
`;

export default App;

function Controls() {
  return (
    <>
      <Joystick />
    </>
  );
}
