import styled from "styled-components";
import { CanvasAndScene } from "./CanvasAndScene";
import HUD from "./components/HUD/HUD";

function App() {
  return (
    <AppStyles>
      <CanvasAndScene />
      <HUD />
    </AppStyles>
  );
}

const AppStyles = styled.div`
  height: 100vh;
`;

export default App;
