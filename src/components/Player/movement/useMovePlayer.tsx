import { useFrame } from "@react-three/fiber";
import { PublicApi } from "@react-three/cannon";
import * as THREE from "three";
import { DOWN, LEFT, RIGHT, UP } from "./usePressedKeys";
import {
  usePlayerPositionRef,
  useGameStateRef,
  DASH_DURATION,
  usePlayerState,
} from "../../../store";
import { useEffect, useRef } from "react";
import { PLAYER_CYLINDER_HEIGHT } from "../../../utils/constants";
import { walkAnimation } from "./walkAnimation";
const MOVE_SPEED = 0.39;

export function useMovePlayer({
  cylinderRef,
  right,
  left,
  down,
  up,
  cylinderApi,
  lastPressedKey,
}: {
  cylinderRef: any;
  right: boolean;
  left: boolean;
  down: boolean;
  up: boolean;
  cylinderApi: PublicApi;
  lastPressedKey: string;
}) {
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

  const velocityRef = useRef<[number, number, number]>([0, 0, 0]);
  useEffect(() => {
    const unsubscribe = cylinderApi.velocity.subscribe((v) => {
      velocityRef.current = v;
    });
    return unsubscribe;
  }, []);

  const [gameStateRef] = useGameStateRef();

  const [positionRef] = usePlayerPositionRef();
  const [{ poweredUp }] = usePlayerState();

  const frameRef = useRef(0);
  const initialYRef = useRef(0);

  useFrame(() => {
    const dashing =
      gameStateRef.current.dashTime &&
      Date.now() - gameStateRef.current.dashTime < DASH_DURATION;
    const moveSpeed = MOVE_SPEED * (poweredUp ? 1.5 : 1) * (dashing ? 4 : 1);

    if (
      !cylinderRef.current ||
      !positionRef.current ||
      gameStateRef.current.isAnimating
    ) {
      return;
    }
    // current position
    const [x1, y1, z1] = [
      positionRef.current[0],
      positionRef.current[1],
      positionRef.current[2],
    ];

    // next position
    // eslint-disable-next-line prefer-const
    let [x2, y2, z2] = [
      x1 + (right ? -1 : left ? 1 : 0) * moveSpeed,
      Math.min(PLAYER_CYLINDER_HEIGHT / 2, y1),
      z1 + (down ? -1 : up ? 1 : 0) * moveSpeed,
    ];
    // if we're moving, animate the player up and down like they're walking
    const moving = up || down || left || right;
    let [rx, rz] = [0, 0];
    if (moving) {
      const { nextY, nextRotZ } = walkAnimation({
        initialY: y2,
        frameRef,
        initialYRef,
      });
      y2 = nextY;
      if (up || down) {
        rz = nextRotZ;
      } else {
        rx = nextRotZ;
      }
    } else {
      frameRef.current = 0;
    }

    const PLAYER_ROTATION_SPEED = 0.2;
    // TODO: UP not working? seems to twitch on x-axis
    const ROT_UP = THREE.MathUtils.degToRad(97);
    // const ROT_UP = THREE.MathUtils.degToRad(180);
    const ROT_LEFT = THREE.MathUtils.degToRad(-90);
    const ROT_DOWN = THREE.MathUtils.degToRad(0);
    const ROT_RIGHT = THREE.MathUtils.degToRad(90);

    const [rotX, rotY, rotZ] = [
      rx,
      //  rotate on y axis according to last pressed key
      lastPressedKey === LEFT
        ? ROT_LEFT
        : lastPressedKey === DOWN
        ? ROT_DOWN
        : lastPressedKey === RIGHT
        ? ROT_RIGHT
        : lastPressedKey === UP
        ? ROT_UP
        : 0.001,
      rz,
    ];
    const PLAYER_DASH_ROLL_SPEED = 0.5;

    const [rotXL, rotYL, rotZL] = [
      THREE.MathUtils.lerp(rotation.current[0], rotX, PLAYER_DASH_ROLL_SPEED),
      THREE.MathUtils.lerp(rotation.current[1], rotY, PLAYER_ROTATION_SPEED),
      THREE.MathUtils.lerp(rotation.current[2], rotZ, PLAYER_DASH_ROLL_SPEED),
    ];
    // shrink the player if we're dashing
    const DASH_SCALE = 0.5;
    const scale = gameStateRef.current.poweredUp ? 2.4 : 1.4;
    cylinderRef.current.scale.set(
      THREE.MathUtils.lerp(
        cylinderRef.current.scale.x,
        (dashing ? DASH_SCALE * 1.5 : 1) * scale,
        0.3
      ),
      THREE.MathUtils.lerp(
        cylinderRef.current.scale.y,
        (dashing ? DASH_SCALE / 2 : 1) * scale,
        0.3
      ),
      THREE.MathUtils.lerp(
        cylinderRef.current.scale.z,
        (dashing ? DASH_SCALE * 3 : 1) * scale,
        0.3
      )
    );

    const [vx1, vy1, vz1] = velocityRef.current;
    const [vx2, vy2, vz2] = [0, 0, 0];
    const [vx2Lerp, vy2Lerp, vz2Lerp] = [
      THREE.MathUtils.lerp(vx1, vx2, PLAYER_ROTATION_SPEED),
      THREE.MathUtils.lerp(vy1, vy2, PLAYER_ROTATION_SPEED),
      THREE.MathUtils.lerp(vz1, vz2, PLAYER_ROTATION_SPEED),
    ];

    // animated next position
    const [x2Lerp, y2Lerp, z2Lerp] = [
      THREE.MathUtils.lerp(x1, x2, 1),
      THREE.MathUtils.lerp(y1, y2, 1),
      THREE.MathUtils.lerp(z1, z2, 1),
    ];

    cylinderApi.rotation.set(rotXL, rotYL, rotZL);
    cylinderApi.velocity.set(vx2Lerp, vy2Lerp, vz2Lerp);
    cylinderApi.position.set(x2Lerp, y2Lerp, z2Lerp);
  });
}
function getAngleFromCenter([x1, y1], [x2, y2]) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const radians = Math.atan2(dy, dx);
  return radians * (180 / Math.PI);
}
