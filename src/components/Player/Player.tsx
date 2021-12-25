import { usePlayerControls } from "./usePlayerControls";
import BlackMage from "../GLTFs/BlackMage";
import { BoomerangTarget } from "./Boomerang/BoomerangTarget";
import { MouseTarget } from "./MouseTarget";
import { useEffect, useState } from "react";
import { useHeldBoomerangs, useGameState, usePlayerState } from "../../store";
import { useSpring, animated } from "@react-spring/three";
import { PLAYER_NAME } from "../../utils/constants";
import { BoomerangWithControls } from "./Boomerang/BoomerangWithControls";
import BoomerangModel from "../GLTFs/BoomerangModel";
import { Spin } from "./Boomerang/Spin";

export function Player() {
  const [playerRef, targetRef, playerPosition] = usePlayerControls();

  return (
    <>
      <Mage {...{ playerRef, targetRef }} />
      <Boomerang {...{ playerPosition, playerRef }} />
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
      </animated.mesh>
    </>
  );
}

function RangeupIndicator() {
  const [{ rangeUp }] = usePlayerState();
  const { scale } = useSpring({ scale: rangeUp ? 1 : 0 });
  return (
    <animated.mesh scale={scale} position={[0, 5, 0]}>
      <Spin>
        <BoomerangModel idx={Infinity} keepFlying={true} />
      </Spin>
    </animated.mesh>
  );
}

function Boomerang({ playerPosition, playerRef }) {
  const [heldBoomerangs] = useHeldBoomerangs();
  return (
    <>
      {heldBoomerangs.map((_, idx) => (
        <BoomerangWithControls
          key={idx}
          idx={idx}
          playerPosition={playerPosition}
          ref={playerRef}
        />
      ))}
      <BoomerangTarget />
    </>
  );
}
