import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import { DASH_DURATION, useGameStateRef } from "../store";
import { usePressedKeys } from "./Player/usePressedKeys";
import { isEqual } from "lodash";
import { dedupeRepetitiveArray } from "../utils/utils";
import { Direction } from "./Scene";

export const DASH_TIMEOUT = 750;
// double-tap within this time window
const DASH_DETECT_THRESHOLD = 500;

export function useDetectDash() {
  const { pressedKeys } = usePressedKeys();

  // on mobile, use a gesture to initiate dashing
  // save a history of pressed keys
  const pressedKeysHistory = useRef<{ timestamp: number; keys: Direction[] }[]>(
    []
  );
  useEffect(() => {
    pressedKeysHistory.current = dedupeRepetitiveArray([
      ...pressedKeysHistory.current,
      { timestamp: Date.now(), keys: pressedKeys },
    ]).slice(-10);
  }, [pressedKeys]);

  const [gameStateRef] = useGameStateRef();

  // if we drag twice in the same direction, start dashing
  useFrame(() => {
    if (
      gameStateRef.current.dashTime &&
      Date.now() - gameStateRef.current.dashTime < DASH_TIMEOUT
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
      const isWithinThreshold =
        d.timestamp - b.timestamp < DASH_DETECT_THRESHOLD;
      if (
        isEqual(a.keys, c.keys) &&
        isEqual(b.keys, d.keys) &&
        !isEqual(a.keys, b.keys) &&
        Boolean(d.keys?.[0]) &&
        isWithinThreshold
      ) {
        gameStateRef.current.dashTime = Date.now();
        pressedKeysHistory.current = [];
      }
    }
  });
}
