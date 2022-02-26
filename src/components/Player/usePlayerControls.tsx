import { useFrame, useThree } from "@react-three/fiber";
import { CylinderArgs, useCylinder } from "@react-three/cannon";
import { useEffect, useRef, useState } from "react";
import { usePressedKeys } from "./usePressedKeys";
import {
  useHeldBoomerangs,
  usePlayerState,
  usePlayerPositionRef,
  usePlayerRef,
  useGameStateRef,
  useIsDashing,
  DASH_DURATION,
} from "../../store";
import {
  ENEMY_NAME,
  GROUP2,
  PLAYER_CYLINDER_HEIGHT,
  POWERUP_NAME,
  RANGEUP_NAME,
} from "../../utils/constants";
import { useMount } from "react-use";
import { useEventListener } from "../../utils/useEventListener";
import { useMovePlayer } from "./useMovePlayer";

export const POWERUP_DURATION = 12 * 1000;
export const RANGEUP_DURATION = 12 * 1000;
const MOVE_SPEED = 0.39;

export function usePlayerControls() {
  const [, setHeldBoomerangs] = useHeldBoomerangs();

  const { lastPressedKey, pressedKeys, up, left, down, right } =
    usePressedKeys();

  // we'll wait till we've moved to start the useFrame below (forget why)
  const [hasMoved, setHasMoved] = useState(false);
  const [gameStateRef] = useGameStateRef();
  useEffect(() => {
    if (!hasMoved && pressedKeys.length !== 0) {
      setHasMoved(true);
    }
  }, [pressedKeys]);

  const [{ poweredUp }, setPlayerState] = usePlayerState();

  const [dashing, setDashing] = useIsDashing();
  useEventListener("keydown", (e) => {
    if ([" "].includes(e.key)) {
      e.preventDefault();
      setDashing((prevDashing) => {
        if (prevDashing) {
          return prevDashing;
        } else {
          setTimeout(() => {
            setDashing(0);
          }, DASH_DURATION);
          return Date.now();
        }
      });
    }
  });

  const moveSpeed = MOVE_SPEED * (poweredUp ? 1.5 : 1) * (dashing ? 4 : 1);
  const [playerRef] = usePlayerRef();
  const { clock } = useThree();
  const [cylinderRef, cylinderApi] = useCylinder(
    () => ({
      // collisionFilterGroup: GROUP1,
      collisionFilterGroup: GROUP2,
      mass: 1,
      args: poweredUp
        ? [4, 4, 5]
        : ([2, 2, PLAYER_CYLINDER_HEIGHT] as CylinderArgs),
      position: [0, 2, 0],
      // if collides with powerup, power up!
      onCollide: (e) => {
        // if collides with enemy, take damage
        const isCollisionWithEnemy = e.body?.name === ENEMY_NAME;
        if (isCollisionWithEnemy && !gameStateRef.current.invulnerable) {
          console.log("COLLISION! with ENEMY", e);

          gameStateRef.current = {
            ...gameStateRef.current,
            hitpoints: gameStateRef.current.hitpoints - 1,
            invulnerable: true,
          };

          const INVULNERABLE_DURATION = 6 * 1000;
          setTimeout(() => {
            gameStateRef.current = {
              ...gameStateRef.current,
              invulnerable: false,
            };
          }, INVULNERABLE_DURATION);
        }

        // if collides with powerup, power up!
        const isCollisionWithPowerup = e.body?.name === POWERUP_NAME;
        if (isCollisionWithPowerup) {
          if (gameStateRef.current.powerupTimer) {
            window.clearTimeout(gameStateRef.current.powerupTimer);
          }
          // console.log("COLLISION! with POWERUP", e);
          setPlayerState((p) => ({
            ...p,
            poweredUp: true,
            poweredUpStartTime: clock.getElapsedTime(),
          }));
          gameStateRef.current = {
            ...gameStateRef.current,
            poweredUp: true,
            powerupTimer: window.setTimeout(() => {
              setPlayerState((p) => ({
                ...p,
                poweredUp: false,
                poweredUpStartTime: null,
              }));
              gameStateRef.current = {
                ...gameStateRef.current,
                poweredUp: false,
                powerupTimer: null,
              };
            }, POWERUP_DURATION),
          };
        }

        // if collides with rangeup, range up!
        const isCollisionWithRangeup = e.body?.name === RANGEUP_NAME;
        if (isCollisionWithRangeup) {
          if (gameStateRef.current.rangeupTimer) {
            window.clearTimeout(gameStateRef.current.rangeupTimer);
          }
          console.log("💥 oof a RANGEUP", e);
          const rangeUpStartTime = clock.getElapsedTime();
          setPlayerState((p) => ({
            ...p,
            rangeUp: true,
            rangeUpStartTime,
          }));
          gameStateRef.current = {
            ...gameStateRef.current,
            rangeUp: true,
            rangeUpStartTime,
            rangeupTimer: window.setTimeout(() => {
              setPlayerState((p) => ({
                ...p,
                rangeUp: false,
                rangeUpStartTime: null,
              }));
              gameStateRef.current = {
                ...gameStateRef.current,
                rangeUp: false,
                rangeupTimer: null,
              };
            }, RANGEUP_DURATION),
          };
        }
      },
      type: "Dynamic", // https://github.com/pmndrs/use-cannon#types
      // A static body does not move during simulation and behaves as if it has infinite mass. Static bodies can be moved manually by setting the position of the body. The velocity of a static body is always zero. Static bodies do not collide with other static or kinematic bodies.
    }),
    playerRef,
    [poweredUp]
  );
  useMount(() => {
    gameStateRef.current.cylinderApi = cylinderApi;
    gameStateRef.current.cylinderRef = cylinderRef;
  });

  const positionRef = useRef<[number, number, number]>([0, 0, 0]);
  useFrame(() => {
    gameStateRef.current = {
      ...gameStateRef.current,
      playerPosition: positionRef.current,
    };
  });
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

  // move the player
  useMovePlayer({
    cylinderRef,
    right,
    left,
    moveSpeed,
    down,
    up,
    cylinderApi,
    lastPressedKey,
  });
}
