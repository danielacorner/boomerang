import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import {
  useGameStateRef,
  useHeldBoomerangs,
  usePlayerPositionRef,
} from "../../store";
import { getFarthestTargetPosition } from "../Ground";

export function MouseTarget() {
  const ref = useRef<THREE.Mesh | null>(null);
  const [gameStateRef] = useGameStateRef();
  const [playerPositionRef] = usePlayerPositionRef();
  useFrame(() => {
    if (!ref.current) return;
    const [x, y, z] = gameStateRef.current.lookAt;
    const { newFarthestTargetPosition } = getFarthestTargetPosition(
      { x, y, z },
      playerPositionRef,
      gameStateRef.current.rangeUp
    );
    ref.current.position.set(
      newFarthestTargetPosition[0],
      newFarthestTargetPosition[1],
      newFarthestTargetPosition[2]
    );
    const scale = gameStateRef.current.rangeUp ? 3 : 1;
    ref.current.scale.set(scale, scale, scale);
  });
  const [heldBoomerangs] = useHeldBoomerangs();
  const { status } = heldBoomerangs[0] || { status: null };
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <torusBufferGeometry args={[1, 0.1, 16, 16]} />
      <meshBasicMaterial
        color="#c02802"
        transparent={true}
        opacity={status === "held" ? 0.4 : 0}
      />
    </mesh>
  );
}
