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
import {
  Boomerang,
  MaxThrowDistanceRangeIndicator,
} from "./MaxThrowDistanceRangeIndicator";
import { usePlayerControls } from "./usePlayerControls";
import { RangeupCircularTimer } from "./RangeupCircularTimer";
import { RangeupIndicator } from "./RangeupIndicator";

export function Player() {
  return (
    <>
      <Mage />
      <Boomerang />
      <RangeupCircularTimer />
      <RangeupIndicator />
      <Target />
      <Controls />
    </>
  );
}

function Controls() {
  usePlayerControls();

  return null;
}
const Target = () => {
  const [targetRef] = useTargetRef();
  return (
    <MouseTarget>
      <mesh ref={targetRef} />
    </MouseTarget>
  );
};

function Mage() {
  const { scale, opacity } = useMageSpring();

  const [playerRef] = usePlayerRef();

  return (
    <animated.mesh
      scale={scale}
      material-transparent={true}
      material-opacity={opacity}
      ref={playerRef}
      name={PLAYER_NAME}
    >
      <BlackMage position={[0, -1, 0]} rotation={[0, Math.PI, 0]} />
      <MaxThrowDistanceRangeIndicator />
      <pointLight intensity={5} distance={24} />
    </animated.mesh>
  );
}
function useMageSpring() {
  const [{ poweredUp }] = usePlayerState();
  const [{ invulnerable }] = useGameState();

  const [blinkOn, setBlinkOn] = useState(false);

  useEffect(() => {
    if (invulnerable) {
      setBlinkOn(true);
    }
  }, [invulnerable]);

  return useSpring({
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
}
