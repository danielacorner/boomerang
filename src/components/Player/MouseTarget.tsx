import { ThreeEvent } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useHeldBoomerangs, usePlayerState } from "../../store";

export function MouseTarget({ children }) {
  const ref = useRef<THREE.Mesh | null>(null);

  const [{ lookAt }] = usePlayerState();

  useEffect(() => {
    if (!ref.current || !lookAt) return;
    const [x, y, z] = lookAt;
    ref.current.position.set(x, y, z);
  }, [lookAt]);
  // ref.current.position.set(x, y, z);
  const [heldBoomerangs] = useHeldBoomerangs();
  const { status } = heldBoomerangs[0];
  return (
    <mesh ref={ref}>
      <torusBufferGeometry args={[1, 0.1, 16, 16]} />
      <meshBasicMaterial
        color="#831a00"
        transparent={true}
        opacity={status === "held" ? 0.4 : 0}
      />
      {children}
    </mesh>
  );
}
