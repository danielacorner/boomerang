import { useFrame } from "@react-three/fiber";
import { PublicApi } from "@react-three/cannon";
import * as THREE from "three";
import { DOWN, LEFT, RIGHT, UP } from "./usePressedKeys";
import {
  usePlayerPositionRef,
  useIsDashing,
  useGameStateRef,
} from "../../store";
import { CAMERA_POSITIONS } from "../../utils/constants";

export function useMovePlayer(
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
  const [gameStateRef] = useGameStateRef();
  const [dashing] = useIsDashing();
  const [playerPositionRef] = usePlayerPositionRef();
  useFrame(({ camera }) => {
    if (
      !cylinderRef.current ||
      !positionRef.current ||
      gameStateRef.current.isAnimating
    ) {
      return;
    }
    const rangeUp = gameStateRef.current.rangeUp;
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
      rangeUp ? CAMERA_POSITIONS.RANGEUP[1] : CAMERA_POSITIONS.GAMEPLAY[1],
      0.05
    );

    const position = [
      CAMERA_POSITIONS.GAMEPLAY[0],
      cameraY,
      CAMERA_POSITIONS.GAMEPLAY[2],
    ];

    const newCameraPosition: [number, number, number] = [
      position[0] + playerPositionRef.current[0],
      position[1],
      position[2] + playerPositionRef.current[2],
    ];
    if (gameStateRef.current.heldBoomerangs.length > 0) {
      camera.position.set(...newCameraPosition);
      camera.lookAt(
        playerPositionRef.current[0],
        playerPositionRef.current[1],
        playerPositionRef.current[2]
      );
    }

    const PLAYER_ROTATION_SPEED = 0.08;

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
const ROT_LEFT = Math.PI * -1;
const ROT_DOWN = Math.PI * 0;
const ROT_RIGHT = Math.PI * 1;
const ROT_UP = Math.PI * 2;
