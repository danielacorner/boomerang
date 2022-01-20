import { Billboard } from "@react-three/drei";
import { useControls } from "leva";
import { Nametag } from "./Nametag";

export function EnemyHpBar({
  healthPercent,
  maxHp,
  enemyHeight,
  enemyName,
  enemyUrl,
}) {
  const width = maxHp ** 0.1 * healthPercent;
  const { x, y, z } = useControls({ x: 0, y: 8.4, z: 0.5 });
  return (
    <Billboard renderOrder={3}>
      <mesh scale={1} position={[0, enemyHeight, 0]}>
        <boxGeometry attach="geometry" args={[width, 1.2, 0.1]} />
        <meshBasicMaterial attach="material" color={"#810f0f"} />
        <Nametag name={enemyName} url={enemyUrl} />
      </mesh>
    </Billboard>
  );
}
