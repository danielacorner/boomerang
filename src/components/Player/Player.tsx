import { usePlayerControls } from "./usePlayerControls";
import BlackMage from "../GLTFs/BlackMage";
import { MouseTarget } from "./MouseTarget";
import { useEffect, useState } from "react";
import {
  useGameState,
  usePlayerRef,
  usePlayerState,
  useTargetRef,
} from "../../store";
import { useSpring, animated } from "@react-spring/three";
import { PLAYER_NAME } from "../../utils/constants";
import { RangeupIndicator } from "./RangeupIndicator";
import { Ground } from "../Ground";
import {
  Boomerang,
  MaxThrowDistanceIndicator,
} from "./MaxThrowDistanceIndicator";

export function Player() {
  const {
    positionRef: playerPositionRef,
    velocityRef: playerVelocityRef,
    cylinderRef: playerCylinderRef,
    cylinderApi: playerCylinderApi,
  } = usePlayerControls();

  // TODO: try putting a ref into jotai?
  return (
    <>
      <Ground {...{ playerPositionRef }} />

      <Mage />
      <Boomerang
        {...{
          playerPositionRef,
          playerVelocityRef,
          playerCylinderApi,
        }}
      />
    </>
  );
}

function Mage() {
  const [{ poweredUp }] = usePlayerState();
  const [{ invulnerable }] = useGameState();

  const [blinkOn, setBlinkOn] = useState(false);

  useEffect(() => {
    if (invulnerable) {
      setBlinkOn(true);
    }
  }, [invulnerable]);

  const { scale, opacity } = useSpring({
    scale: poweredUp ? 2.4 : 1.4,
    opacity: blinkOn ? 0 : 1,
    onRest: () => {
      if (invulnerable) {
        setBlinkOn(!blinkOn);
      }
      if (!invulnerable && blinkOn) {
        setBlinkOn(false);
      }
    },
  });

  const [playerRef] = usePlayerRef();
  const [targetRef] = useTargetRef();
  return (
    <>
      <MouseTarget>
        <mesh ref={targetRef} />
      </MouseTarget>
      <animated.mesh
        scale={scale}
        material-transparent={true}
        material-opacity={opacity}
        ref={playerRef}
        name={PLAYER_NAME}
      >
        <BlackMage position={[0, -1, 0]} rotation={[0, Math.PI, 0]} />
        <RangeupIndicator />
        <MaxThrowDistanceIndicator />
        <pointLight intensity={5} distance={24} />
      </animated.mesh>
    </>
  );
}
