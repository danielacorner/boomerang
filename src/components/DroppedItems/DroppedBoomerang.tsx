import styled from "styled-components";
import { useCylinder } from "@react-three/cannon";
import { Html } from "@react-three/drei";
import { useState } from "react";
import { useMount } from "react-use";
import {
  PLAYER_NAME,
  BOOMERANG_ITEM_NAME,
  GROUP1,
} from "../../utils/constants";
import BoomerangModel from "../GLTFs/BoomerangModel";
import { BoomerangIcon } from "../HUD/BoomerangsIndicator";

const BOOMERANG_ITEM_HEIGHT = 2;
const BOOMERANG_ITEM_DROP_DURATION = 32 * 1000;
export function DroppedBoomerang({ position }) {
  const [mounted, setMounted] = useState(true);
  useMount(() => {
    setTimeout(() => {
      setMounted(false);
    }, BOOMERANG_ITEM_DROP_DURATION);
  });
  return mounted ? (
    <DroppedBoomerangContent {...{ position, setMounted }} />
  ) : null;
}
export function DroppedBoomerangContent({ position, setMounted }) {
  const [ref, api] = useCylinder(() => ({
    args: [2, 2, BOOMERANG_ITEM_HEIGHT, 6],
    mass: 200,
    position,
    collisionFilterGroup: GROUP1,
    onCollide: (e) => {
      const isCollisionWithPlayer = e.body && e.body.name === PLAYER_NAME;

      if (isCollisionWithPlayer) {
        setMounted(false);
      }
    },
  }));
  return (
    <mesh ref={ref} name={BOOMERANG_ITEM_NAME}>
      <DroppedBoomerangPin />
      <BoomerangModel idx={null} isDroppedBoomerang={true} />
    </mesh>
  );
}

export function DroppedBoomerangPin() {
  return (
    <Html>
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
