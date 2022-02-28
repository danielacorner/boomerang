import styled from "styled-components";
import { Billboard, Html } from "@react-three/drei";
import { BoomerangIcon } from "../HUD/BoomerangsIndicator";
import { useFrame, useThree } from "@react-three/fiber";

export function DroppedBoomerangPin() {
  // TODO: stay on-screen at edges

  const { viewport } = useThree();
  console.log(
    "🌟🚨 ~ file: DroppedBoomerangPin.tsx ~ line 12 ~ DroppedBoomerangPin ~ viewport",
    viewport
  );
  // useFrame(({camera}) => {

  // })
  return (
    <Billboard follow={true}>
      <Html style={{ pointerEvents: "none", transform: `translate(0px,0px)` }}>
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
    </Billboard>
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
