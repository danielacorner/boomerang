import { Canvas } from "@react-three/fiber";
import styled from "styled-components";
import { Physics } from "@react-three/cannon";
import { Scene } from "./components/Scene";

function App() {
  return (
    <AppStyles>
      <Canvas
        camera={{
          position: [0, 10 * (3 / 3) /* 120deg */, 10],
        }}
      >
        <Physics>
          <Scene />
        </Physics>
      </Canvas>
    </AppStyles>
  );
}
const AppStyles = styled.div`
  height: 100vh;
`;

export default App;
