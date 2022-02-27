import { Player } from "./Player/Player";
import { Enemies } from "./Enemies/Enemies";
import { Lighting } from "./Lighting";
import { DroppedItems } from "./DroppedItems/DroppedItems";
import { Ground } from "./Ground";
import { AdaptiveDpr } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import { DASH_DURATION, useGameStateRef } from "../store";
import { usePressedKeys, useKeyboardListeners } from "./Player/usePressedKeys";
import { isEqual } from "lodash";
import { dedupeRepetitiveArray } from "../utils/utils";

export function Scene() {
  useFrame(({ performance }) => {
    performance.regress();
  });
  useKeyboardListeners();
  useDetectDash();
  return (
    <mesh>
      <Lighting />
      <Player />
      <Enemies />
      <DroppedItems />
      <Ground />
      <AdaptiveDpr pixelated />
    </mesh>
  );
}
export type Direction = "ArrowUp" | "ArrowLeft" | "ArrowRight" | "ArrowDown";
function useDetectDash() {
  const { pressedKeys } = usePressedKeys();

  // on mobile, use a gesture to initiate dashing
  // save a history of pressed keys
  const pressedKeysHistory = useRef<Direction[][]>([]);
  useEffect(() => {
    pressedKeysHistory.current = dedupeRepetitiveArray([
      ...pressedKeysHistory.current,
      pressedKeys,
    ]).slice(-10);
  }, [pressedKeys]);

  const [gameStateRef] = useGameStateRef();

  // if we drag twice in the same direction, start dashing
  useFrame(() => {
    if (
      gameStateRef.current.dashTime &&
      Date.now() - gameStateRef.current.dashTime < DASH_DURATION
    ) {
      return;
    }
    // if the last 4 pressedKeys are in a sequence like this,
    // []
    // ['ArrowDown']
    // []
    // ['ArrowDown']
    // then initiate dashing
    if (pressedKeysHistory.current.length >= 4) {
      const [a, b, c, d] = pressedKeysHistory.current.slice(-4);

      if (isEqual(a, c) && isEqual(b, d) && Boolean(d?.[0])) {
        gameStateRef.current.dashTime = Date.now();
      }
    }
  });
}
