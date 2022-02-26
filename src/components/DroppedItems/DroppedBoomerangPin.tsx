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
              transform: "translate(-38px,-80px) rotate(135deg)",
              width: 48,
              height: 48,
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
    transform-origin: left;
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
