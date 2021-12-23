import styled from "styled-components";
import { useHeldBoomerangs } from "../../store";

export function BoomerangsIndicator() {
  const [heldBoomerangs] = useHeldBoomerangs();
  return (
    <BoomerangsIndicatorStyles>
      {heldBoomerangs.map((_, idx) => (
        <div
          key={idx}
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
  return <img src="/images/boomerang.png" width="32" height="32" />;
}
