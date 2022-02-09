import styled from "styled-components";
import { Html } from "@react-three/drei";
import { BoomerangIcon } from "../HUD/BoomerangsIndicator";

export function DroppedBoomerangPin() {
  return (
    <Html style={{ pointerEvents: "none" }}>
      <DroppedBoomerangPinStyles>
        <div className="boom">
          <BoomerangIcon
            status="held"
            style={{
              position: "relative",
              transformOrigin: "center",
              transform: "translate(-28px,-60px) rotate(135deg)",
            }}
          />
        </div>
      </DroppedBoomerangPinStyles>
    </Html>
  );
}
const DroppedBoomerangPinStyles = styled.div`
  .boom {
    animation: pulse 1s linear infinite;
    transform-origin: center;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
`;
