import { usePlayerControls } from "./usePlayerControls";
import { BoomerangWithControls } from "./BoomerangWithControls";
import Bm from "../GLTFs/Bm";
import { BoomerangTarget } from "./BoomerangTarget";
import { MouseTarget } from "./MouseTarget";

export function Player() {
  const [playerRef, targetRef, playerPosition] = usePlayerControls();

  return (
    <>
      <MouseTarget>
        <mesh ref={targetRef} />
      </MouseTarget>

      <mesh ref={playerRef}>
        <Bm position={[0, -1, 0]} />
        <Bm position={[1, -1, 0]} />
        <Bm position={[-1, -1, 0]} />
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
