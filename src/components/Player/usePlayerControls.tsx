import { useFrame } from "@react-three/fiber";
import { useSphere } from "@react-three/cannon";
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
export function usePlayerControls(): [
  playerRef: React.MutableRefObject<null | THREE.Mesh<
    THREE.BufferGeometry,
    THREE.Material | THREE.Material[]
  >>,
  targetRef: React.MutableRefObject<null | THREE.Mesh<
    THREE.BufferGeometry,
    THREE.Material | THREE.Material[]
  >>,
  playerPosition: number[]
] {
  const MOVE_SPEED = 0.3;
  const { pressedKeys, lastPressedKey } = usePressedKeys();
  const [hasMoved, setHasMoved] = useState(false);
  useEffect(() => {
    if (!hasMoved && pressedKeys.length !== 0) {
      setHasMoved(true);
    }
  }, [pressedKeys]);

  const [{ lookAt }] = usePlayerState();

  const [movedMouse, setMovedMouse] = useState(false);
  useEventListener("mousemove", () => setMovedMouse(true));
  useEffect(() => {
    setMovedMouse(false);
  }, [pressedKeys]);

  const targetRef = useRef<THREE.Mesh>(null);
  const playerRef = useRef<THREE.Mesh>(null);

  const [sphereRef, api] = useSphere(
    () => ({
      mass: 1,
      position: [0, 2, 0],
      onCollide: (e) => {
        console.log("COLLISION!", e);
      },
    }),
    playerRef
  );

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

  // move and rotate the player
  useFrame(() => {
    if (!sphereRef.current || !playerRef.current || !hasMoved) {
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
    if (movedMouse && targetRef.current) {
      playerRef.current.lookAt(targetRef.current.position);
      return;
    }

    const newRotX = 0;
    const newRotY = getPlayerRotation(lastPressedKey);
    const newRotZ = 0;

    // const newRX = THREE.MathUtils.lerp(
    //   rotation.current[0],
    //   newRotX,
    //   PLAYER_ROTATION_SPEED
    // );
    const newRY = THREE.MathUtils.lerp(
      rotation.current[1],
      newRotY,
      PLAYER_ROTATION_SPEED
    );
    // const newRZ = THREE.MathUtils.lerp(
    //   rotation.current[2],
    //   newRotZ,
    //   PLAYER_ROTATION_SPEED
    // );
    api.rotation.set(0, newRY, 0);
    api.velocity.set(0, 0, 0);
  });

  return [playerRef, targetRef, position.current];
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
