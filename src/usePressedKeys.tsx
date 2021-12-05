import { useState } from "react";
import { useKey } from "react-use";
import { Direction } from "./App";
export const [UP, LEFT, RIGHT, DOWN]: Direction[] = [
  "ArrowUp",
  "ArrowLeft",
  "ArrowRight",
  "ArrowDown",
];
export function usePressedKeys() {
  const [pressedKeys, setPressedKeys] = useState<Direction[]>([]);

  useKey("w", () => setPressedKeys([...pressedKeys, UP]));
  useKey("w", () => setPressedKeys(pressedKeys.filter((key) => key !== UP)), {
    event: "keyup",
  });
  useKey("a", () => setPressedKeys([...pressedKeys, LEFT]));
  useKey("a", () => setPressedKeys(pressedKeys.filter((key) => key !== LEFT)), {
    event: "keyup",
  });
  useKey("s", () => setPressedKeys([...pressedKeys, DOWN]));
  useKey("s", () => setPressedKeys(pressedKeys.filter((key) => key !== DOWN)), {
    event: "keyup",
  });
  useKey("d", () => setPressedKeys([...pressedKeys, RIGHT]));
  useKey(
    "d",
    () => setPressedKeys(pressedKeys.filter((key) => key !== RIGHT)),
    { event: "keyup" }
  );
  useKey(UP, () => setPressedKeys([...pressedKeys, UP]));
  useKey(UP, () => setPressedKeys(pressedKeys.filter((key) => key !== UP)), {
    event: "keyup",
  });
  useKey(LEFT, () => setPressedKeys([...pressedKeys, LEFT]));
  useKey(
    LEFT,
    () => setPressedKeys(pressedKeys.filter((key) => key !== LEFT)),
    { event: "keyup" }
  );
  useKey(DOWN, () => setPressedKeys([...pressedKeys, DOWN]));
  useKey(
    DOWN,
    () => setPressedKeys(pressedKeys.filter((key) => key !== DOWN)),
    { event: "keyup" }
  );
  useKey(RIGHT, () => setPressedKeys([...pressedKeys, RIGHT]));
  useKey(
    RIGHT,
    () => setPressedKeys(pressedKeys.filter((key) => key !== RIGHT)),
    { event: "keyup" }
  );
  return pressedKeys;
}
