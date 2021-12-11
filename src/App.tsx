import styled from "styled-components";
import { CanvasAndScene, Controls } from "./CanvasAndScene";
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
