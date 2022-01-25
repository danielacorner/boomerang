import { useFrame } from "@react-three/fiber";
import { PublicApi, useCylinder } from "@react-three/cannon";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { DOWN, LEFT, RIGHT, UP, usePressedKeys } from "./usePressedKeys";
import { useEventListener } from "../../utils/useEventListener";
import {
  useHeldBoomerangs,
  useGameState,
  usePlayerState,
  usePlayerRef,
  useTargetRef,
  usePlayerPositionRef,
} from "../../store";
import {
  BOOMERANG_ITEM_NAME,
  ENEMY_NAME,
  GROUP2,
  POWERUP_NAME,
  RANGEUP_NAME,
} from "../../utils/constants";
import { useInterval, useMount } from "react-use";
import { useWhyDidYouUpdate } from "../useWhyDidYouUpdate";

const POWERUP_DURATION = 10 * 1000;
const MOVE_SPEED = 0.39;

export function usePlayerControls(): {
  cylinderApi: PublicApi;
} {
  const [, setHeldBoomerangs] = useHeldBoomerangs();

  const { lastPressedKey, pressedKeys, up, left, down, right } =
    usePressedKeys();

  // we'll wait till we've moved to start the useFrame below (forget why)
  const [hasMoved, setHasMoved] = useState(false);
  const [, setGameState] = useGameState();
  useEffect(() => {
    if (!hasMoved && pressedKeys.length !== 0) {
      setHasMoved(true);
    }
  }, [pressedKeys]);

  // record a small "ramp-up" speed from 0 to 1 as long as at least one key is pressed
  // const [speed, setSpeed] = useState(0);
  // useInterval(() => {
  //   if (speed < 1 && pressedKeys.length > 0) {
  //     setSpeed(speed + 0.2);
  //   } else if (speed > 0 && pressedKeys.length === 0) {
  //     setSpeed(speed - 0.2);
  //   }
  // }, 10);

  const [{ lookAt, poweredUp }, setPlayerState] = usePlayerState();
  const moveSpeed = MOVE_SPEED * (poweredUp ? 1.5 : 1);
  // const moveSpeed = speed * MOVE_SPEED * (poweredUp ? 1.5 : 1);

  const [movedMouse, setMovedMouse] = useState(false);
  useEventListener("mousemove", () => setMovedMouse(true));
  useEffect(() => {
    setMovedMouse(false);
  }, [pressedKeys]);
  const [playerRef] = usePlayerRef();
  const [targetRef] = useTargetRef();

  const [cylinderRef, cylinderApi] = useCylinder(
    () => ({
      collisionFilterGroup: GROUP2,
      mass: 1,
      args: poweredUp ? [2, 2, 4] : [1, 1, 3],
      position: [0, 2, 0],
      // if collides with powerup, power up!
      onCollide: (e) => {
        // if collides with enemy, take damage
        const isCollisionWithEnemy = e.body?.name === ENEMY_NAME;
        if (isCollisionWithEnemy) {
          // console.log("COLLISION! with ENEMY", e);
          setGameState((p) =>
            p.invulnerable
              ? p
              : {
                  ...p,
                  hitpoints: Math.max(0, p.hitpoints - 1),
                  invulnerable: true,
                }
          );
          const INVULNERABLE_DURATION = 6 * 1000;
          setTimeout(() => {
            setGameState((p) => ({ ...p, invulnerable: false }));
          }, INVULNERABLE_DURATION);
        }

        // if collides with powerup, power up!
        const isCollisionWithPowerup = e.body?.name === POWERUP_NAME;
        if (isCollisionWithPowerup) {
          // console.log("COLLISION! with POWERUP", e);
          setPlayerState((p) => ({ ...p, poweredUp: true }));
          setTimeout(() => {
            setPlayerState((p) => ({ ...p, poweredUp: false }));
          }, POWERUP_DURATION);
        }

        // if collides with rangeup, range up!
        const isCollisionWithRangeup = e.body?.name === RANGEUP_NAME;
        if (isCollisionWithRangeup) {
          // console.log("COLLISION! with RANGEUP", e);
          setPlayerState((p) => ({ ...p, rangeUp: true }));
          setTimeout(() => {
            setPlayerState((p) => ({ ...p, rangeUp: false }));
          }, POWERUP_DURATION);
        }

        // if collides with dropped boomerang, record it
        const isCollisionWithBoomerang = e.body?.name === BOOMERANG_ITEM_NAME;
        if (isCollisionWithBoomerang) {
          // console.log("COLLISION! with boomerang", e);
          const newBoomerang = {
            status: "held" as any,
            clickTargetPosition: null,
          };
          setHeldBoomerangs((p) => [...p, newBoomerang]);
        }
      },
      type: "Dynamic", // https://github.com/pmndrs/use-cannon#types
      // A static body does not move during simulation and behaves as if it has infinite mass. Static bodies can be moved manually by setting the position of the body. The velocity of a static body is always zero. Static bodies do not collide with other static or kinematic bodies.
    }),
    playerRef,
    [poweredUp]
  );

  const positionRef = useRef<[number, number, number]>([0, 0, 0]);
  useEffect(() => {
    const unsubscribe = cylinderApi.position.subscribe((v) => {
      positionRef.current = v;
    });
    return unsubscribe;
  }, []);
  const [, setPlayerPositionRef] = usePlayerPositionRef();
  useMount(() => {
    setPlayerPositionRef(positionRef);
  });

  const velocityRef = useRef<[number, number, number]>([0, 0, 0]);
  useEffect(() => {
    const unsubscribe = cylinderApi.velocity.subscribe((v) => {
      velocityRef.current = v;
    });
    return unsubscribe;
  }, []);

  const rotation = useRef([0, 0, 0]);

  // last known player position... use for innacurate needs only
  useInterval(() => {
    setPlayerState((p) => ({ ...p, playerPosition: positionRef.current }));
  }, 5 * 1000);

  useEffect(() => {
    const unsubscribe = cylinderApi.rotation.subscribe(
      (v) => (rotation.current = v)
    );
    return unsubscribe;
  }, []);

  // move the player
  useFrame(({ camera }) => {
    if (
      !cylinderRef.current ||
      !playerRef.current ||
      !positionRef.current ||
      !hasMoved
    ) {
      return;
    }
    const [x1, y1, z1] = [
      positionRef.current[0],
      positionRef.current[1],
      positionRef.current[2],
    ];

    const [x2, y2, z2] = [
      x1 + (right ? -1 : left ? 1 : 0) * moveSpeed,
      y1,
      z1 + (down ? -1 : up ? 1 : 0) * moveSpeed,
    ];

    const [x2Lerp, y2Lerp, z2Lerp] = [
      THREE.MathUtils.lerp(x1, x2, 1),
      THREE.MathUtils.lerp(y1, y2, 1),
      THREE.MathUtils.lerp(z1, z2, 1),
    ];

    // cylinderApi.velocity.set(0, 0, 0);

    // prevents twitchy movement
    // const delta = Math.abs(x2 - x1) + Math.abs(y2 - y1) + Math.abs(z2 - z1);
    // const isAboveThreshold = delta > 0.1;
    // if (isAboveThreshold) {
    cylinderApi.position.set(x2Lerp, y2Lerp, z2Lerp);
    // }

    // TODO: rotate to lookAt position
    // const newRotY = -getAngleFromCenter(
    //   [playerRef.current.position.x, playerRef.current.position.z],
    //   [lookAt[0], lookAt[2]]
    // );
    const newRotY = getPlayerRotation(lastPressedKey);

    const PLAYER_ROTATION_SPEED = 0.08;

    const [, ry1] = rotation.current;
    const [, ry2] = [0.01, newRotY, 0.01];
    const ry2Lerp = THREE.MathUtils.lerp(ry1, ry2, PLAYER_ROTATION_SPEED);
    // TODO: UP not working?

    cylinderApi.rotation.set(0, ry2Lerp, 0);
    const [vx1, vy1, vz1] = velocityRef.current;
    const [vx2, vy2, vz2] = [0, 0, 0];
    const [vx2Lerp, vy2Lerp, vz2Lerp] = [
      THREE.MathUtils.lerp(vx1, vx2, PLAYER_ROTATION_SPEED),
      THREE.MathUtils.lerp(vy1, vy2, PLAYER_ROTATION_SPEED),
      THREE.MathUtils.lerp(vz1, vz2, PLAYER_ROTATION_SPEED),
    ];
    cylinderApi.velocity.set(vx2Lerp, vy2Lerp, vz2Lerp);
  });

  useWhyDidYouUpdate("Player", {
    playerRef,
    cylinderRef,
    positionRef,
    velocityRef,
    rotation,
    setPlayerState,
    setPlayerPositionRef,
    setHeldBoomerangs,
    setHasMoved,
  });

  return {
    cylinderApi,
  };
}
const ROT_LEFT = Math.PI * -1;
const ROT_DOWN = Math.PI * 0;
const ROT_RIGHT = Math.PI * 1;
const ROT_UP = Math.PI * 2;
function getPlayerRotation(lastPressedKey) {
  return lastPressedKey === LEFT
    ? ROT_LEFT
    : lastPressedKey === DOWN
    ? ROT_DOWN
    : lastPressedKey === RIGHT
    ? ROT_RIGHT
    : lastPressedKey === UP
    ? ROT_UP
    : 0;
}

function getAngleFromCenter([x1, y1], [x2, y2]) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const radians = Math.atan2(dy, dx);
  return radians * (180 / Math.PI);
}
