import { useFrame } from "@react-three/fiber";
import { useBox } from "@react-three/cannon";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { DOWN, LEFT, RIGHT, UP, usePressedKeys } from "./usePressedKeys";
import { useEventListener } from "../../utils/useEventListener";
import { usePlayerState } from "../../store";

const [ROT_TOP, ROT_RIGHT, ROT_BOTTOM, ROT_LEFT] = [
  Math.PI * 1,
  Math.PI * 0.5,
  Math.PI * 0,
  Math.PI * -0.5,
];

export function usePlayerControls() {
  const MOVE_SPEED = 0.3;
  const [pressedKeys, lastPressedKey] = usePressedKeys();
  const [{ lookAt }] = usePlayerState();

  const [movedMouse, setMovedMouse] = useState(false);
  useEventListener("mousemove", () => setMovedMouse(true));
  useEffect(() => {
    setMovedMouse(false);
  }, [pressedKeys]);

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
    // move the player
    const [px, py, pz] = [
      position.current[0],
      position.current[1],
      position.current[2],
    ];
    const [x2, y2, z2] = [
      px +
        (pressedKeys.includes(RIGHT)
          ? 1
          : pressedKeys.includes(LEFT)
          ? -1
          : 0) *
          MOVE_SPEED,
      py,
      pz +
        (pressedKeys.includes(DOWN) ? 1 : pressedKeys.includes(UP) ? -1 : 0) *
          MOVE_SPEED,
    ];
    api.position.set(x2, y2, z2);

    // rotate the player
    const p1 = [px, py, pz] as [number, number, number];
    const p2 = [lookAt[0], lookAt[1], lookAt[2]] as [number, number, number];
    console.log("🌟🚨 ~ useFrame ~ lookAt", lookAt);
    console.log("🌟🚨 ~ useFrame ~ p2", p2);
    const newRotY = movedMouse
      ? getRotationFromNorth(p1, p2)
      : getPlayerRotation(lastPressedKey);

    const newRX = THREE.MathUtils.lerp(
      rotation.current[0],
      0,
      PLAYER_ROTATION_SPEED
    );
    const newRY = THREE.MathUtils.lerp(
      rotation.current[1],
      newRotY,
      PLAYER_ROTATION_SPEED
    );
    const newRZ = THREE.MathUtils.lerp(
      rotation.current[2],
      0,
      PLAYER_ROTATION_SPEED
    );
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
const PLAYER_ROTATION_SPEED = 0.08;

function getPlayerRotation(lastPressedKey) {
  return lastPressedKey === LEFT
    ? ROT_LEFT
    : lastPressedKey === DOWN
    ? ROT_BOTTOM
    : lastPressedKey === RIGHT
    ? ROT_RIGHT
    : lastPressedKey === UP
    ? ROT_TOP
    : 0;
}

function getRotationFromNorth(
  p1: [number, number, number],
  p2: [number, number, number]
): number {
  const [x1, y1, z1] = p1;
  const [x2, y2, z2] = p2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dz = z2 - z1;
  const angle = Math.atan2(dz, dx);
  return angle;
}
