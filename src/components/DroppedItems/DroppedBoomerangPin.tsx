import styled from "styled-components";
import { Html } from "@react-three/drei";
import { BoomerangIcon } from "../HUD/BoomerangsIndicator";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { usePlayerPositionRef } from "../../store";

export function DroppedBoomerangPin({ style = {} }) {
  const [playerPositionRef] = usePlayerPositionRef();
  const ref = useRef<THREE.Mesh | null>(null);

  // pin tracks with the player position to stay on-screen at edges
  const initialPositionRef = useRef(null as any);
  useFrame(({ viewport }) => {
    if (!ref.current) {
      return;
    }
    if (!initialPositionRef.current) {
      initialPositionRef.current = ref.current.position.clone();
    }
    // bound the position to always be within the frame,
    // so we can see this dropped pin from any distance

    // distance from the player to the edge of the screen
    // right edge of the screen
    const maxX = playerPositionRef.current[0] + viewport.width / 2;
    const signMaxX = Math.sign(maxX);
    // left edge of the screen
    const minX = playerPositionRef.current[0] - viewport.width / 2;
    const signMinX = Math.sign(minX);

    // clamp at edges of the screen
    const x = Math.max(minX, Math.min(maxX, initialPositionRef.current.x));

    // const maxY = playerPositionRef.current[1] + viewport.height / 2;
    // const minY = playerPositionRef.current[1] - viewport.height / 2;
    // const y = Math.max(minY, Math.min(maxY, initialPositionRef.current.y));
    const y = initialPositionRef.current.y;

    // TODO: account for inverted values

    const maxZ = playerPositionRef.current[2] + viewport.height / 2;
    const minZ = playerPositionRef.current[2] - viewport.height / 2;
    const z = Math.max(minZ, Math.min(maxZ, initialPositionRef.current.z));

    ref.current.position.set(x, y, z);
  });

  return (
    <mesh ref={ref}>
      <Html
        style={{
          pointerEvents: "none",
          transform: `translate(0px,0px)`,
          ...style,
        }}
      >
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
