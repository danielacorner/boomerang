import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useBoomerangState } from "../../store";
import { getMousePosition } from "./Player";

export function MouseTarget({ children }) {
  const ref = useRef<THREE.Mesh | null>(null);
  useFrame(({ mouse, viewport, ...stuff }) => {
    if (!ref.current) {
      return;
    }
    const { x, y, z } = getMousePosition(mouse, viewport);
    ref.current.position.set(x, y, z);
  });
  const [{ status }] = useBoomerangState();
  return (
    <mesh ref={ref}>
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="red" />
      {children}
    </mesh>
  );
}
