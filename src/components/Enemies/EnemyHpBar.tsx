import { Billboard, Text } from "@react-three/drei";

export function EnemyHpBar({
  health,
  maxHp,
  enemyHeight,
  enemyName,
  enemyUrl,
}) {
  return (
    <Billboard renderOrder={1}>
      {/* backdrop */}
      <mesh scale={1} position={[0, enemyHeight, 0]}>
        <boxGeometry attach="geometry" args={[maxHp, 1.4, 0.1]} />
        <meshBasicMaterial
          depthTest={false}
          attach="material"
          color={"#350101"}
          transparent={true}
          opacity={0.8}
        />
      </mesh>
      {/* remaining hp */}
      <mesh position={[0, enemyHeight + 0.01, 0.01]}>
        <mesh scale={[health, 1, 1]} position={[(-maxHp + health) / 2, 0, 0]}>
          <boxGeometry attach="geometry" args={[1, 1.4, 0.1]} />
          <meshBasicMaterial
            depthTest={false}
            attach="material"
            color={"#810f0f"}
            transparent={true}
            opacity={0.8}
          />
        </mesh>
        <Nametag name={enemyName} url={enemyUrl} />
      </mesh>
    </Billboard>
  );
}

function Nametag({ name, url, ...rest }) {
  return (
    <mesh
      renderOrder={1}
      material-depthTest={false}
      position={[0, 0, 0]}
      {...rest}
    >
      <Text
        anchorY={"middle"}
        color={"#ffffff"}
        fontSize={1}
        scale={1}
        position={[0, -0.05, 0.3]}
      >
        {name}
      </Text>
      {/* <Html
          style={{
            fontSize: "1.2rem",
            width: "fit-content",
            textAlign: "center",
            whiteSpace: "nowrap",
            display: "flex",
            justifyContent: "center",
            transform: "translateX(-50%)",
          }}
        >
          <a
            style={{
              color: "white",
              cursor: "pointer",
              textDecoration: "none",
            }}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {name}
          </a>
        </Html> */}
    </mesh>
  );
}
