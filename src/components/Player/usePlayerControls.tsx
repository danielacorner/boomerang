import { useFrame } from "@react-three/fiber";
import { useBox } from "@react-three/cannon";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { DOWN, LEFT, RIGHT, UP, usePressedKeys } from "./usePressedKeys";

const [ROT_TOP, ROT_RIGHT, ROT_BOTTOM, ROT_LEFT] = [
  Math.PI * 1,
  Math.PI * 0.5,
  Math.PI * 0,
  Math.PI * -0.5,
];

export function usePlayerControls() {
  const MOVE_SPEED = 0.3;
  const [pressedKeys, lastPressedKey] = usePressedKeys();

  const ref = useRef<THREE.Mesh>(null!);
  const [boxRef, api] = useBox(() => ({ mass: 1, position: [0, 2, 0] }), ref);

  const position = useRef([0, 0, 0]);
  useEffect(() => {
    const unsubscribe = api.position.subscribe((v) => (position.current = v));
    return unsubscribe;
  }, []);
  const rotation = useRef([0, 0, 0]);
  useEffect(() => {
    const unsubscribe = api.rotation.subscribe((v) => (rotation.current = v));
    return unsubscribe;
  }, []);
  useFrame(() => {
    if (!boxRef.current) {
      return;
    }
    const [x, y, z] = [
      position.current[0],
      position.current[1],
      position.current[2],
    ];
    const [x2, y2, z2] = [
      x +
        (pressedKeys.includes(RIGHT)
          ? 1
          : pressedKeys.includes(LEFT)
          ? -1
          : 0) *
          MOVE_SPEED,
      y,
      z +
        (pressedKeys.includes(DOWN) ? 1 : pressedKeys.includes(UP) ? -1 : 0) *
          MOVE_SPEED,
    ];
    api.position.set(x2, y2, z2);

    const newRotY =
      lastPressedKey === LEFT
        ? ROT_LEFT
        : lastPressedKey === DOWN
        ? ROT_BOTTOM
        : lastPressedKey === RIGHT
        ? ROT_RIGHT
        : lastPressedKey === UP
        ? ROT_TOP
        : 0;

    const newRX = THREE.MathUtils.lerp(rotation.current[0], 0, 0.1);
    const newRY = THREE.MathUtils.lerp(rotation.current[1], newRotY, 0.1);
    const newRZ = THREE.MathUtils.lerp(rotation.current[2], 0, 0.1);
    api.rotation.set(
      newRX,
      newRY,
      newRZ
      // 0,
      // newRotY,
      // 0
    );
  });

  return [ref, position];
}
