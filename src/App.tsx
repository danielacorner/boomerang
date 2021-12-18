import styled from "styled-components";
import { CanvasAndScene } from "./CanvasAndScene";
import { Controls } from "./Controls";

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
