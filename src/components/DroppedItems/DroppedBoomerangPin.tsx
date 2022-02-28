import styled from "styled-components";
import { Billboard, Html } from "@react-three/drei";
import { BoomerangIcon } from "../HUD/BoomerangsIndicator";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";

export function DroppedBoomerangPin() {
  // TODO: stay on-screen at edges

  const { viewport } = useThree();
  console.log(
    "🌟🚨 ~ file: DroppedBoomerangPin.tsx ~ line 12 ~ DroppedBoomerangPin ~ viewport",
    viewport
  );
  const ref = useRef<THREE.Mesh | null>(null);
  useFrame(({ camera }) => {
    if (!ref.current) {
      return;
    }

    // bound the position to always be within the frame,
    // so we can see this dropped pin from any distance
    ref.current.position.set(
      Math.max(
        Math.min(ref.current.position.x, viewport.width / 2),
        -viewport.width / 2
      ),
      Math.max(
        Math.min(ref.current.position.y, viewport.height / 2),
        -viewport.height / 2
      ),
      ref.current.position.z
    );
  });

  return (
    <mesh ref={ref}>
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
    </mesh>
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
