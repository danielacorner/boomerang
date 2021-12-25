import { useEffect } from "react";
import styled from "styled-components";
import { INITIAL_HITPOINTS, useGameState } from "../../store";

export function PlayerHPBar() {
  const [{ hitpoints }] = useGameState();

  // TODO: when we die, restart the game!
  useEffect(() => {
    if (hitpoints === 0) {
      console.log("You died!");
    }
  }, [hitpoints]);
  return (
    <PlayerHpBarStyles>
      {[...new Array(hitpoints)].map((_) => "🧡 ")}
      {[...new Array(INITIAL_HITPOINTS - hitpoints)].map((_, idx) => (
        <span key={idx} style={{ opacity: 0.4 }}>
          💔{" "}
        </span>
      ))}
    </PlayerHpBarStyles>
  );
}
const PlayerHpBarStyles = styled.div`
  position: fixed;
  top: 16px;
  left: 16px;
  font-size: 16px;
  text-shadow: 1px 1px 3px white;
  @media (min-width: 768px) {
    font-size: 24px;
  }
`;
