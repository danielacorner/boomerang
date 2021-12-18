import { usePlayerControls } from "./usePlayerControls";
import { BoomerangWithControls } from "./BoomerangWithControls";
import Bm from "../GLTFs/Bm";
import { BoomerangTarget } from "./BoomerangTarget";
import { MouseTarget } from "./MouseTarget";
import { useEffect } from "react";
import { useBoomerangState } from "../../store";
import { useEventListener } from "../../utils/useEventListener";

export function Player() {
  const [playerRef, targetRef, playerPosition] = usePlayerControls();

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

  return (
    <>
      <MouseTarget>
        <mesh ref={targetRef} />
      </MouseTarget>

      <mesh ref={playerRef}>
        <Bm position={[0, -1, 0]} rotation={[0, Math.PI, 0]} />
      </mesh>

      <BoomerangWithControls playerPosition={playerPosition} ref={playerRef} />

      <BoomerangTarget />
    </>
  );
}
