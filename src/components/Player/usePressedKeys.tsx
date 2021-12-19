import { atom, SetStateAction, useAtom } from "jotai";
import { useKey } from "react-use";
import { Direction } from "../Scene";
export const [UP, LEFT, RIGHT, DOWN]: Direction[] = [
  "ArrowUp",
  "ArrowLeft",
  "ArrowRight",
  "ArrowDown",
];

const INITIAL_DIRECTION = DOWN;

const pressedKeysAtom = atom<Direction[]>([]);
const lastPressedKeyAtom = atom<Direction>(INITIAL_DIRECTION);

export function usePressedKeys(): {
  pressedKeys: Direction[];
  lastPressedKey: Direction;
  setPressedKeys: (update: SetStateAction<Direction[]>) => void;
} {
  const [pressedKeys, setPressedKeys] = useAtom(pressedKeysAtom);
  const [lastPressedKey, setLastPressedKey] = useAtom(lastPressedKeyAtom);

  const handleUp = () => {
    setPressedKeys((p) => [...p, UP]);
    setLastPressedKey(UP);
  };
  const handleLeft = () => {
    setPressedKeys((p) => [...p, LEFT]);
    setLastPressedKey(LEFT);
  };
  const handleDown = () => {
    setPressedKeys((p) => [...p, DOWN]);
    setLastPressedKey(DOWN);
  };
  const handleRight = () => {
    setPressedKeys((p) => [...p, RIGHT]);
    setLastPressedKey(RIGHT);
  };

  useKey("w", handleUp);
  useKey("a", handleLeft);
  useKey("s", handleDown);
  useKey("d", handleRight);
  useKey("W", handleUp);
  useKey("A", handleLeft);
  useKey("S", handleDown);
  useKey("D", handleRight);

  useKey(UP, handleUp);
  useKey(LEFT, handleLeft);
  useKey(DOWN, handleDown);
  useKey(RIGHT, handleRight);

  useKey("w", () => setPressedKeys((p) => p.filter((key) => key !== UP)), {
    event: "keyup",
  });
  useKey("a", () => setPressedKeys((p) => p.filter((key) => key !== LEFT)), {
    event: "keyup",
  });
  useKey("s", () => setPressedKeys((p) => p.filter((key) => key !== DOWN)), {
    event: "keyup",
  });
  useKey("d", () => setPressedKeys((p) => p.filter((key) => key !== RIGHT)), {
    event: "keyup",
  });

  useKey(UP, () => setPressedKeys((p) => p.filter((key) => key !== UP)), {
    event: "keyup",
  });
  useKey(LEFT, () => setPressedKeys((p) => p.filter((key) => key !== LEFT)), {
    event: "keyup",
  });
  useKey(DOWN, () => setPressedKeys((p) => p.filter((key) => key !== DOWN)), {
    event: "keyup",
  });
  useKey(RIGHT, () => setPressedKeys((p) => p.filter((key) => key !== RIGHT)), {
    event: "keyup",
  });

  return {
    pressedKeys,
    lastPressedKey,
    setPressedKeys,
  };
}
