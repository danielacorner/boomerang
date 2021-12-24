import { CYLINDER_HEIGHT } from "./Enemy";
const FULL_HEALTH = 4;

export function EnemyHpBar({ healthPercent }) {
  const width = FULL_HEALTH * healthPercent;
  return (
    <mesh position={[0, CYLINDER_HEIGHT / 2 + 1, 0]}>
      <boxGeometry attach="geometry" args={[width, 0.5, 0.5]} />
      <meshBasicMaterial attach="material" color={"#810f0f"} />
    </mesh>
  );
}
