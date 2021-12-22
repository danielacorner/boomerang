import styled from "styled-components";
import { useGameState } from "../../store";

export function PlayerHPBar() {
  const [{ hitpoints }] = useGameState();
  return <PlayerHpBarStyles>🧡 {hitpoints} HP</PlayerHpBarStyles>;
}
const PlayerHpBarStyles = styled.div`
  position: fixed;
  top: 16px;
  left: 16px;
  font-size: 24px;
  text-shadow: 1px 1px 3px white;
`;
