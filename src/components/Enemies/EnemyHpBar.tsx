import { Billboard } from "@react-three/drei";
import { useControls } from "leva";
import { Nametag } from "./Nametag";

export function EnemyHpBar({
  health,
  maxHp,
  enemyHeight,
  enemyName,
  enemyUrl,
}) {
  const { x, y, z } = useControls({ x: 0, y: 8.4, z: 0.5 });
  return (
    <Billboard renderOrder={3}>
      {/* backdrop */}
      <mesh scale={1} position={[0, enemyHeight, 0]}>
        <boxGeometry attach="geometry" args={[maxHp, 1.4, 0.1]} />
        <meshBasicMaterial
          attach="material"
          color={"#350101"}
          transparent={true}
          opacity={0.8}
        />
        <Nametag name={enemyName} url={enemyUrl} />
      </mesh>
      {/* remaining hp */}
      <mesh scale={1} position={[0, enemyHeight + 0.01, 0.01]}>
        <boxGeometry attach="geometry" args={[health, 1.4, 0.1]} />
        <meshBasicMaterial
          attach="material"
          color={"#810f0f"}
          transparent={true}
          opacity={0.8}
        />
        <Nametag name={enemyName} url={enemyUrl} />
      </mesh>
    </Billboard>
  );
}
