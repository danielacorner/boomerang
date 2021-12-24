import styled from "styled-components";
import { useHeldBoomerangs } from "../../store";

export function BoomerangsIndicator() {
  const [heldBoomerangs] = useHeldBoomerangs();
  return (
    <BoomerangsIndicatorStyles>
      {heldBoomerangs.map(({ status }, idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            transform: `translateX(-${idx * 38}px)`,
            opacity: status === "idle" ? 1 : 0.5,
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
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  font-size: 24px;
  text-shadow: 1px 1px 3px white;
`;

function BoomerangIcon() {
  return <img src="/images/boomerang.png" width="32" height="32" />;
}
