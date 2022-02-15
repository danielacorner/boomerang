import { useFrame } from "@react-three/fiber";
import { PublicApi } from "@react-three/cannon";
import * as THREE from "three";
import { DOWN, LEFT, RIGHT, UP } from "./usePressedKeys";
import {
  usePlayerPositionRef,
  useIsDashing,
  useGameStateRef,
} from "../../store";
import { useControls } from "leva";
import { useEffect, useRef } from "react";

export function useMovePlayer({
  cylinderRef,
  right,
  left,
  moveSpeed,
  down,
  up,
  cylinderApi,
  lastPressedKey,
}: {
  cylinderRef: any;
  right: boolean;
  left: boolean;
  moveSpeed: number;
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
  const [dashing] = useIsDashing();
  const { xxx } = useControls({ xxx: 0 });
  const [positionRef] = usePlayerPositionRef();
  useFrame(() => {
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

    // }

    const PLAYER_ROTATION_SPEED = 0.2;
    // TODO: UP not working? seems to twitch on x-axis
    const ROT_UP = THREE.MathUtils.degToRad(180);
    const ROT_LEFT = THREE.MathUtils.degToRad(-90);
    const ROT_DOWN = THREE.MathUtils.degToRad(0);
    const ROT_RIGHT = THREE.MathUtils.degToRad(90);

    // animate the rotation if we're dashing
    const [rotX, rotY, rotZ] = [
      dashing ? Math.PI / 2 : 0,
      lastPressedKey === LEFT
        ? ROT_LEFT
        : lastPressedKey === DOWN
        ? ROT_DOWN
        : lastPressedKey === RIGHT
        ? ROT_RIGHT
        : lastPressedKey === UP
        ? ROT_UP
        : 0.001,
      dashing ? Math.PI / 2 : 0,
    ];
    const PLAYER_DASH_ROLL_SPEED = 0.5;

    const [rotXL, rotYL, rotZL] = [
      // rotX,
      // rotY,
      // rotZ,
      THREE.MathUtils.lerp(rotation.current[0], rotX, PLAYER_DASH_ROLL_SPEED),
      // rotY,
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
