import styled from "styled-components";
import { useGameState } from "../../store";

export function BoomerangsIndicator() {
  const [{ boomerangs }] = useGameState();
  return (
    <BoomerangsIndicatorStyles>
      {[...new Array(boomerangs)].map((_, idx) => (
        <div
          style={{
            position: "absolute",
            transform: `translateX(-${idx * 38}px)`,
          }}
        >
          <BoomerangIcon />
        </div>
      ))}
    </BoomerangsIndicatorStyles>
  );
}
const BoomerangsIndicatorStyles = styled.div`
  position: fixed;
  top: 18px;
  right: 128px;
  font-size: 24px;
  text-shadow: 1px 1px 3px white;
`;

function BoomerangIcon() {
  return <img src="/public/images/boomerang.png" width="32" height="32" />;
}
