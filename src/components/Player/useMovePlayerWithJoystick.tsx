import { useFrame } from "@react-three/fiber";
import { usePressedKeys } from "./usePressedKeys";
import { JOYSTICK_RADIUS } from "../Joystick";
import { Direction } from "../Scene";
import { useEffect } from "react";
import { useJoystickPosition } from "../../store";

// function getRotationFromNorth(
//   p1: [number, number, number],
//   p2: [number, number, number]
// ): number {
//   const [x1, y1, z1] = p1;
//   const [x2, y2, z2] = p2;
//   const dx = x2 - x1;
//   const dy = y2 - y1;
//   const dz = z2 - z1;
//   const angle = Math.atan2(dz, dx);
//   return angle;
// }

const MIN_X_DETECTION_THRESHOLD = JOYSTICK_RADIUS * 0.2;

export function useMovePlayerWithJoystick() {
  const [joystickPosition] = useJoystickPosition();
  const [pressedKeys, lastPressedKey, setPressedKeys] = usePressedKeys();
  // move the player in the direction of the joystick
  useEffect(() => {
    const [x, y] = joystickPosition;
    if (
      x > -MIN_X_DETECTION_THRESHOLD &&
      x < MIN_X_DETECTION_THRESHOLD &&
      x > -MIN_X_DETECTION_THRESHOLD &&
      x < MIN_X_DETECTION_THRESHOLD
    ) {
      return;
    }
    const nextPressedKeys = [
      ...(y > MIN_X_DETECTION_THRESHOLD ? ["ArrowUp"] : []),
      ...(y < -MIN_X_DETECTION_THRESHOLD ? ["ArrowDown"] : []),
      ...(x < -MIN_X_DETECTION_THRESHOLD ? ["ArrowLeft"] : []),
      ...(x > MIN_X_DETECTION_THRESHOLD ? ["ArrowRight"] : []),
    ] as Direction[];
    console.log("🌟🚨 ~ useFrame ~ nextPressedKeys", nextPressedKeys);
    setPressedKeys(nextPressedKeys);
  }, [joystickPosition, setPressedKeys]);
}
