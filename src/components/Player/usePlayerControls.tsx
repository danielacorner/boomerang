import { useFrame, useThree } from "@react-three/fiber";
import { CylinderArgs, PublicApi, useCylinder } from "@react-three/cannon";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { DOWN, LEFT, RIGHT, UP, usePressedKeys } from "./usePressedKeys";
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
  BOOMERANG_ITEM_NAME,
  CAMERA_POSITION,
  CAMERA_RANGEUP_HEIGHT,
  ENEMY_NAME,
  GROUP2,
  POWERUP_NAME,
  RANGEUP_NAME,
} from "../../utils/constants";
import { useInterval, useMount } from "react-use";
import { useEventListener } from "../../utils/useEventListener";

export const POWERUP_DURATION = 16 * 1000;
export const RANGEUP_DURATION = 16 * 1000;
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

  const moveSpeed = MOVE_SPEED * (poweredUp ? 1.5 : 1) * (dashing ? 2 : 1);
  const [playerRef] = usePlayerRef();
  const { clock } = useThree();
  const [cylinderRef, cylinderApi] = useCylinder(
    () => ({
      collisionFilterGroup: GROUP2,
      mass: 1,
      args: poweredUp ? [4, 4, 5] : ([2, 2, 3] as CylinderArgs),
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
          // console.log("COLLISION! with POWERUP", e);
          setPlayerState((p) => ({
            ...p,
            poweredUp: true,
            poweredUpStartTime: clock.getElapsedTime(),
          }));
          gameStateRef.current = { ...gameStateRef.current, poweredUp: true };
          setTimeout(() => {
            setPlayerState((p) => ({
              ...p,
              poweredUp: false,
              poweredUpStartTime: null,
            }));
            gameStateRef.current = {
              ...gameStateRef.current,
              poweredUp: false,
            };
          }, POWERUP_DURATION);
        }

        // if collides with rangeup, range up!
        const isCollisionWithRangeup = e.body?.name === RANGEUP_NAME;
        if (isCollisionWithRangeup) {
          console.log("💥 oof a RANGEUP", e);
          setPlayerState((p) => ({
            ...p,
            rangeUp: true,
            rangeUpStartTime: clock.getElapsedTime(),
          }));
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

  const rotation = useRef<[number, number, number]>([0, 0, 0]);

  // last known player position... use for inaccurate needs only (updating it faster impacts performance)
  // useInterval(() => {
  //   setPlayerState((p) => ({ ...p, playerPosition: positionRef.current }));
  // }, 5 * 1000);

  useEffect(() => {
    const unsubscribe = cylinderApi.rotation.subscribe(
      (v) => (rotation.current = v)
    );
    return unsubscribe;
  }, []);

  // move the player
  useMovePlayer(
    cylinderRef,
    positionRef,
    right,
    left,
    moveSpeed,
    down,
    up,
    cylinderApi,
    lastPressedKey,
    rotation,
    velocityRef
  );
}
const ROT_LEFT = Math.PI * -1;
const ROT_DOWN = Math.PI * 0;
const ROT_RIGHT = Math.PI * 1;
const ROT_UP = Math.PI * 2;
function useMovePlayer(
  cylinderRef,
  positionRef,
  right: boolean,
  left: boolean,
  moveSpeed: number,
  down: boolean,
  up: boolean,
  cylinderApi: PublicApi,
  lastPressedKey: string,
  rotation: React.MutableRefObject<[number, number, number]>,
  velocityRef
) {
  const [{ rangeUp }] = usePlayerState();
  const [dashing] = useIsDashing();
  const [playerPositionRef] = usePlayerPositionRef();
  useFrame(({ camera }) => {
    if (!cylinderRef.current || !positionRef.current) {
      return;
    }
    // current position
    const [x1, y1, z1] = [
      positionRef.current[0],
      positionRef.current[1],
      positionRef.current[2],
    ];

    // next position
    const [x2, y2, z2] = [
      x1 + (right ? -1 : left ? 1 : 0) * moveSpeed,
      y1,
      z1 + (down ? -1 : up ? 1 : 0) * moveSpeed,
    ];

    // animated next position
    const [x2Lerp, y2Lerp, z2Lerp] = [
      THREE.MathUtils.lerp(x1, x2, 1),
      THREE.MathUtils.lerp(y1, y2, 1),
      THREE.MathUtils.lerp(z1, z2, 1),
    ];

    cylinderApi.position.set(x2Lerp, y2Lerp, z2Lerp);

    // move the camera up when rangeUp is active
    const cameraY = THREE.MathUtils.lerp(
      camera.position.y,
      rangeUp ? CAMERA_RANGEUP_HEIGHT : CAMERA_POSITION[1],
      0.05
    );

    const newCameraPosition: [number, number, number] = [
      CAMERA_POSITION[0] + playerPositionRef.current[0],
      cameraY,
      CAMERA_POSITION[2] + playerPositionRef.current[2],
    ];
    camera.position.set(...newCameraPosition);
    camera.lookAt(
      playerPositionRef.current[0],
      playerPositionRef.current[1],
      playerPositionRef.current[2]
    );

    const PLAYER_ROTATION_SPEED = 0.08;

    console.log(
      "🌟🚨 ~ file: usePlayerControls.tsx ~ line 266 ~ useFrame ~ lastPressedKey",
      lastPressedKey
    );
    // animate the rotation if we're dashing
    const [rotX, rotY, rotZ] = [
      dashing ? Math.PI / 2 : 0.001,
      // TODO: UP not working?
      lastPressedKey === LEFT
        ? ROT_LEFT
        : lastPressedKey === DOWN
        ? ROT_DOWN
        : lastPressedKey === RIGHT
        ? ROT_RIGHT
        : lastPressedKey === UP
        ? ROT_UP
        : 0.001,
      dashing ? Math.PI / 2 : 0.001,
    ];
    const PLAYER_DASH_ROLL_SPEED = 0.5;
    const [rotXL, rotYL, rotZL] = [
      THREE.MathUtils.lerp(rotation.current[0], rotX, PLAYER_DASH_ROLL_SPEED),
      THREE.MathUtils.lerp(rotation.current[1], rotY, PLAYER_ROTATION_SPEED),
      THREE.MathUtils.lerp(rotation.current[2], rotZ, PLAYER_DASH_ROLL_SPEED),
    ];
    cylinderApi.rotation.set(rotXL, rotYL, rotZL);

    const [vx1, vy1, vz1] = velocityRef.current;
    const [vx2, vy2, vz2] = [0, 0, 0];
    const [vx2Lerp, vy2Lerp, vz2Lerp] = [
      THREE.MathUtils.lerp(vx1, vx2, PLAYER_ROTATION_SPEED),
      THREE.MathUtils.lerp(vy1, vy2, PLAYER_ROTATION_SPEED),
      THREE.MathUtils.lerp(vz1, vz2, PLAYER_ROTATION_SPEED),
    ];
    cylinderApi.velocity.set(vx2Lerp, vy2Lerp, vz2Lerp);
  });
}

function getAngleFromCenter([x1, y1], [x2, y2]) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const radians = Math.atan2(dy, dx);
  return radians * (180 / Math.PI);
}
