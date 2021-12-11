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
      <sphereBufferGeometry args={[0.6, 16, 16]} />
      <meshBasicMaterial
        color="#b90f0f"
        transparent={true}
        opacity={status === "idle" ? 0.2 : 0}
      />
      {children}
    </mesh>
  );
}
