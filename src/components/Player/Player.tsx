import { usePlayerControls } from "./usePlayerControls";
import { useMovePlayerWithJoystick } from "./useMovePlayerWithJoystick";
import { BoomerangWithControls } from "./BoomerangWithControls";
import Bm from "../GLTFs/Bm";
import { animated } from "@react-spring/three";
import { BoomerangTarget } from "./BoomerangTarget";
import { MouseTarget } from "./MouseTarget";

export function Player() {
  const [playerRef, targetRef, playerPosition] = usePlayerControls();
  useMovePlayerWithJoystick();

  return (
    <>
      <MouseTarget>
        <mesh ref={targetRef} />
      </MouseTarget>

      <mesh ref={playerRef}>
        <Bm />
        {/* <BlackMage /> */}
      </mesh>

      <BoomerangWithControls playerPosition={playerPosition} ref={playerRef} />

      <BoomerangTarget />
    </>
  );
}
export function getMousePosition(mouse: THREE.Vector2, viewport: any) {
  return {
    x: (mouse.x * viewport.width) / 2,
    y: 0,
    z: -(mouse.y * viewport.height) / 2,
  };
}
