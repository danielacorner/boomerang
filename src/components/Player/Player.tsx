import { usePlayerControls } from "./usePlayerControls";
import { useMovePlayerWithJoystick } from "./useMovePlayerWithJoystick";
import { BoomerangWithControls } from "./BoomerangWithControls";
import Bm from "../GLTFs/Bm";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export function Player() {
  const [playerRef, targetRef, playerPosition] = usePlayerControls();
  useMovePlayerWithJoystick();

  return (
    <>
      <BoxFollowsMouse>
        <mesh ref={targetRef}>
          <meshBasicMaterial color="blue" />
          <boxBufferGeometry args={[0.5, 1, 1]} />
        </mesh>
      </BoxFollowsMouse>

      <mesh ref={playerRef}>
        <Bm />
        {/* <BlackMage /> */}
      </mesh>

      <BoomerangWithControls playerPosition={playerPosition} ref={playerRef} />
    </>
  );
}
function BoxFollowsMouse({ children }) {
  const ref = useRef<THREE.Mesh | null>(null);
  useFrame(({ mouse, viewport, ...stuff }) => {
    if (!ref.current) {
      return;
    }
    const { x, y, z } = getMousePosition(mouse, viewport);
    ref.current.position.set(x, y, z);
  });
  return (
    <mesh ref={ref}>
      <meshBasicMaterial color="red" />
      <boxBufferGeometry args={[1, 1, 1]} />
      {children}
    </mesh>
  );
}

export function getMousePosition(mouse: THREE.Vector2, viewport: any) {
  return {
    x: (mouse.x * viewport.width) / 2,
    y: 0,
    z: -(mouse.y * viewport.height) / 2,
  };
}
