import { useCurrentWave } from "./Enemies/Enemies";
import { Cloud, MeshWobbleMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useBox } from "@react-three/cannon";
import { PLAYER_NAME } from "../utils/constants";
import { useGameStateRef } from "../store";
import { LEVELS } from "./Enemies/LEVELS";
import { TILE_WIDTH } from "./ProceduralTerrain/ProceduralTerrain";
import { useRef, useState } from "react";

export function NextLevelDoor() {
  const [currentWave, setCurrentWave] = useCurrentWave();
  const level = LEVELS[currentWave];
  const [gameStateRef] = useGameStateRef();

  const [visible, setVisible] = useState(false);
  useFrame(() => {
    if (!visible && gameStateRef.current.levelStatus === "won") {
      setVisible(true);
    } else if (visible && gameStateRef.current.levelStatus === "fighting") {
      setVisible(false);
    }
  });

  // TODO: when the player touches the door, go to the next level
  const [boxRef] = useBox(
    () => ({
      mass: 0,
      position: [0, TILE_WIDTH / 2, (level.terrain.height / 2) * TILE_WIDTH],
      args: [TILE_WIDTH * 2, TILE_WIDTH * 2, TILE_WIDTH * 0.2],
      onCollide: (e) => {
        if (!visible) {
          return;
        }
        if (e.body.name === PLAYER_NAME) {
          setCurrentWave(currentWave + 1);
          gameStateRef.current.levelStatus = "fighting";
        }
      },
    }),
    null,
    [visible]
  );
  const rand = useRef(Math.random()).current - 1;
  return (
    <mesh ref={boxRef}>
      <>
        <sphereBufferGeometry attach="geometry" args={[TILE_WIDTH * 0.75]} />
        <MeshWobbleMaterial
          opacity={visible ? 0.8 : 0}
          transparent
          alphaWrite={false}
          factor={2}
          speed={1}
          attach="material"
          color="#ff009d"
        />
        <Cloud
          speed={1}
          scale={1}
          opacity={visible ? 0.4 : 0}
          position={[rand, -rand, -rand * 2]}
        />
        <Cloud
          speed={1}
          scale={1}
          opacity={visible ? 0.4 : 0}
          position={[rand, rand, -rand * 2]}
        />
        <Cloud
          speed={1}
          scale={1}
          opacity={visible ? 0.4 : 0}
          position={[-rand, -rand, -rand * 2]}
        />
      </>
    </mesh>
  );
}
