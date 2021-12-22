import styled from "styled-components";
import { useGameState } from "../../store";

export function Score() {
  const [{ money }] = useGameState();
  return <ScoreStyles>💰{money}</ScoreStyles>;
}
const ScoreStyles = styled.div`
  position: fixed;
  top: 16px;
  right: 16px;
`;
