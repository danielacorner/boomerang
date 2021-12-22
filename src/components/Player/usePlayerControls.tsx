import { useFrame } from "@react-three/fiber";
import { useSphere } from "@react-three/cannon";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { DOWN, LEFT, RIGHT, UP, usePressedKeys } from "./usePressedKeys";
import { useEventListener } from "../../utils/useEventListener";
import { useBoomerangState, useGameState, usePlayerState } from "../../store";
import { useOrbitControlsAngle } from "../OrbitControlsWithAngle";
import { ENEMY_NAME, POWERUP_NAME } from "../../utils/constants";

const POWERUP_DURATION = 10 * 1000;
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
  const [{ clickTargetPosition }] = useBoomerangState();

  // const [isShiftDown, setIsShiftDown] = useState(false);
  // useEventListener("keydown", (e) => {
  //   if (e.key === "Shift") {
  //     setIsShiftDown(true);
  //   }
  // });
  // useEventListener("keyup", (e) => {
  //   if (e.key === "Shift") {
  //     setIsShiftDown(false);
  //   }
  // });

  const moveSpeed = 0.35;
  // const moveSpeed = isShiftDown ? 0.4 : 0.3;

  const { pressedKeys, lastPressedKey } = usePressedKeys();

  // we'll wait till we've moved to start the useFrame below (forget why)
  const [hasMoved, setHasMoved] = useState(false);
  const [{ invulnerable }, setGameState] = useGameState();
  useEffect(() => {
    if (!hasMoved && pressedKeys.length !== 0) {
      setHasMoved(true);
    }
  }, [pressedKeys]);

  const [{ lookAt }, setPlayerState] = usePlayerState();

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
        // if collides with powerup, power up!
        const isCollisionWithPowerup = e.body.name === POWERUP_NAME;

        if (isCollisionWithPowerup) {
          console.log("COLLISION! with POWERUP", e);
          setPlayerState((p) => ({ ...p, poweredUp: true }));
          setTimeout(() => {
            setPlayerState((p) => ({ ...p, poweredUp: false }));
          }, POWERUP_DURATION);
        }

        // if collides with enemy, take damage
        const isCollisionWithEnemy = e.body.name === ENEMY_NAME;
        if (isCollisionWithEnemy && !invulnerable) {
          console.log("COLLISION! with ENEMY", e);
          setGameState((p) => ({
            ...p,
            hitpoints: p.hitpoints - 1,
            invulnerable: true,
          }));
          const INVULNERABLE_DURATION = 6 * 1000;
          setTimeout(() => {
            setGameState((p) => ({ ...p, invulnerable: false }));
          }, INVULNERABLE_DURATION);
        }
      },
      type: "Static", // https://github.com/pmndrs/use-cannon#types
      // A static body does not move during simulation and behaves as if it has infinite mass. Static bodies can be moved manually by setting the position of the body. The velocity of a static body is always zero. Static bodies do not collide with other static or kinematic bodies.
    }),
    playerRef
  );

  const position = useRef<[number, number, number]>([0, 0, 0]);
  useEffect(() => {
    const unsubscribe = api.position.subscribe((v) => {
      position.current = v;
      setPlayerState((p) => ({ ...p, playerPosition: v }));
    });
    return unsubscribe;
  }, []);
  const rotation = useRef([0, 0, 0]);
  useEffect(() => {
    const unsubscribe = api.rotation.subscribe((v) => (rotation.current = v));
    return unsubscribe;
  }, []);
  const [orbitControlsAngle, setOrbitControlsAngle] = useOrbitControlsAngle();

  // move  the player
  useFrame(({ camera }) => {
    if (!sphereRef.current || !playerRef.current || !hasMoved) {
      return;
    }
    const [px, py, pz] = [
      position.current[0],
      position.current[1],
      position.current[2],
    ];

    const [up, right, down, left] = [
      pressedKeys.includes(UP),
      pressedKeys.includes(RIGHT),
      pressedKeys.includes(DOWN),
      pressedKeys.includes(LEFT),
    ];

    const [x2, y2, z2] = [
      px + (right ? -1 : left ? 1 : 0) * moveSpeed,
      py,
      pz + (down ? -1 : up ? 1 : 0) * moveSpeed,
    ];
    api.position.set(x2, y2, z2);

    // TODO: account for orbitControls rotation

    const newRotY = orbitControlsAngle;
    // const newRotY = getPlayerRotation(lastPressedKey) + orbitControlsAngle;

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
