import { usePlayerControls } from "./usePlayerControls";
import Bm from "../GLTFs/Bm";
import { BoomerangTarget } from "./Boomerang/BoomerangTarget";
import { MouseTarget } from "./MouseTarget";
import { useEffect, useState } from "react";
import { useBoomerangState, useGameState, usePlayerState } from "../../store";
import { useSpring, animated } from "@react-spring/three";
import { PLAYER_NAME } from "../../utils/constants";
import { BoomerangWithControls } from "./Boomerang/BoomerangWithControls";

export function Player() {
  const [playerRef, targetRef, playerPosition] = usePlayerControls();

  return (
    <>
      w
      <Mage {...{ playerRef, targetRef }} />
      <Boomerang {...{ playerPosition, playerRef }} />
    </>
  );
}

function Mage({ playerRef, targetRef }) {
  const [{ poweredUp }] = usePlayerState();
  const [{ invulnerable }] = useGameState();

  const [{ clickTargetPosition }] = useBoomerangState();
  useEffect(() => {
    // rotate the player
    if (playerRef.current && clickTargetPosition) {
      playerRef.current.lookAt(...clickTargetPosition);
      return;
    }
  }, [clickTargetPosition]);

  const [blinkOn, setBlinkOn] = useState(false);

  useEffect(() => {
    if (invulnerable) {
      setBlinkOn(true);
    }
  }, [invulnerable]);

  const { scale, opacity } = useSpring({
    scale: poweredUp ? 2.4 : 1,
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
        <Bm position={[0, -1, 0]} rotation={[0, Math.PI, 0]} />
      </animated.mesh>
    </>
  );
}

function Boomerang({ playerPosition, playerRef }) {
  return (
    <>
      <BoomerangWithControls playerPosition={playerPosition} ref={playerRef} />

      <BoomerangTarget />
    </>
  );
}
