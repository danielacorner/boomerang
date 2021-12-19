import { usePlayerControls } from "./usePlayerControls";
import { BoomerangWithControls } from "./BoomerangWithControls";
import Bm from "../GLTFs/Bm";
import { BoomerangTarget } from "./BoomerangTarget";
import { MouseTarget } from "./MouseTarget";
import { useEffect } from "react";
import { useBoomerangState, usePlayerState } from "../../store";
import { useEventListener } from "../../utils/useEventListener";
import { useSpring, animated } from "@react-spring/three";
import { PLAYER_NAME } from "../../utils/constants";

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

  // move on right click?
  useEventListener("contextmenu", (e) => {
    console.log("🌟🚨 ~ file: Player.tsx ~ line 15 ~ useEventListener ~ e", e);
  });

  const [{ clickTargetPosition }] = useBoomerangState();
  useEffect(() => {
    // rotate the player
    if (playerRef.current && clickTargetPosition) {
      playerRef.current.lookAt(...clickTargetPosition);
      return;
    }
  }, [clickTargetPosition]);
  const { scale } = useSpring({ scale: poweredUp ? 2.4 : 1 });
  return (
    <>
      <MouseTarget>
        <mesh ref={targetRef} />
      </MouseTarget>

      <animated.mesh scale={scale} ref={playerRef} name={PLAYER_NAME}>
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
