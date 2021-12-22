import styled from "styled-components";
import { Controls } from "../../Controls";
import { useGameState } from "../../store";
import { Score } from "./Score";

/** components overlaid on top of the 3d canvas */
const HUD = () => {
  return (
    <>
      <Controls />
      <HPBar />
      <Score />
    </>
  );
};

export default HUD;

function HPBar() {
  const [{ hitpoints }] = useGameState();
  return <HpBarStyles>🩸 {hitpoints} HP</HpBarStyles>;
}
const HpBarStyles = styled.div`
  position: fixed;
  top: 16px;
  left: 16px;
`;
