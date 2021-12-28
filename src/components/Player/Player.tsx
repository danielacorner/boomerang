import { usePlayerControls } from "./usePlayerControls";
import BlackMage from "../GLTFs/BlackMage";
import { BoomerangTarget } from "./Boomerang/BoomerangTarget";
import { MouseTarget } from "./MouseTarget";
import { useEffect, useState } from "react";
import { useHeldBoomerangs, useGameState, usePlayerState } from "../../store";
import { useSpring, animated } from "@react-spring/three";
import { PLAYER_NAME } from "../../utils/constants";
import { BoomerangWithControls } from "./Boomerang/BoomerangWithControls";
import { RangeupIndicator } from "./RangeupIndicator";

export function Player() {
  const {
    playerRef,
    targetRef,
    positionRef: playerPositionRef,
    velocityRef: playerVelocityRef,
    cylinderRef: playerCylinderRef,
    cylinderApi: playerCylinderApi,
  } = usePlayerControls();

  return (
    <>
      <Mage {...{ playerRef, targetRef }} />
      <Boomerang
        {...{
          playerPositionRef,
          playerVelocityRef,
          playerCylinderApi,
          playerRef,
        }}
      />
    </>
  );
}

function Mage({ playerRef, targetRef }) {
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
        <pointLight intensity={0.8} distance={10} />
      </animated.mesh>
    </>
  );
}

function Boomerang({
  playerPositionRef,
  playerCylinderApi,
  playerRef,
  playerVelocityRef,
}) {
  const [heldBoomerangs] = useHeldBoomerangs();
  return (
    <>
      {heldBoomerangs.map((_, idx) => (
        <BoomerangWithControls
          key={idx}
          ref={playerRef}
          {...{
            idx,
            playerPositionRef,
            playerCylinderApi,
            playerVelocityRef,
          }}
        />
      ))}
      <BoomerangTarget />
    </>
  );
}
