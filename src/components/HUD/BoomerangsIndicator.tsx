import { useRef } from "react";
import styled from "styled-components";
import { useHeldBoomerangs } from "../../store";

export function BoomerangsIndicator() {
  const [heldBoomerangs] = useHeldBoomerangs();
  return (
    <BoomerangsIndicatorStyles>
      {heldBoomerangs.map(({ status }, idx) => (
        <BoomerangIcon key={idx} status={status} />
      ))}
    </BoomerangsIndicatorStyles>
  );
}
const BoomerangsIndicatorStyles = styled.div`
  position: fixed;
  top: 12px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  font-size: 24px;
  text-shadow: 1px 1px 3px white;
`;

function BoomerangIcon({ status }) {
  const rand = useRef(Math.floor(Math.random() * 50 + 330)).current;
  return (
    <span
      style={{
        opacity: status === "idle" ? 1 : 0.5,
        margin: 8,
        transform: `rotate(-${rand}deg)`,
      }}
    >
      <img src="/images/boomerang.png" width="32" height="32" />;
    </span>
  );
}
