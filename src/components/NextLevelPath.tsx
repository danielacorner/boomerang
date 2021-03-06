import { useCurrentWave } from "./Enemies/Enemies";
import { useFrame } from "@react-three/fiber";
import { useBox } from "@react-three/cannon";
import { PLAYER_NAME } from "../utils/constants";
import { useGameStateRef } from "../store";
import { LEVELS } from "./Enemies/LEVELS";
import { TempleBlock, TILE_WIDTH } from "./ProceduralTerrain/ProceduralTerrain";
import { useState } from "react";
import { GROUND_PLANE_PROPS } from "./Ground";

// TODO: turn into a fading path... then transition to the next stage from bottom to top, then fade out

export function NextLevelPath() {
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

  //  when the player touches the door, go to the next level
  const [boxRef] = useBox(
    () => ({
      mass: 0,
      position: [
        -TILE_WIDTH / 2,
        0.1,
        (level.terrain.height / 2) * TILE_WIDTH + TILE_WIDTH / 2,
      ].map((p, i) => p + GROUND_PLANE_PROPS.position[i]) as [
        number,
        number,
        number
      ],
      args: [TILE_WIDTH * 2, TILE_WIDTH * 2, TILE_WIDTH * 1.1],
      onCollide: (e) => {
        if (!visible) {
          return;
        }
        if (e.body.name === PLAYER_NAME) {
          console.log(
            "🌟🚨 ~ file: NextLevelPath.tsx ~ line 43 ~ NextLevelPath ~ e",
            e
          );
          // go to the next level
          setCurrentWave(currentWave + 1);
          // move the player to the level's entrance
          gameStateRef.current.cylinderApi?.position.set(
            0,
            0,
            (level.terrain.height / 2) * TILE_WIDTH
          );

          gameStateRef.current.levelStatus = "fighting";
        }
      },
    }),
    null,
    [visible]
  );

  return (
    <mesh ref={boxRef}>
      {visible && (
        <>
          <mesh position={[0, 0, -TILE_WIDTH * 2]}>
            <boxBufferGeometry args={[TILE_WIDTH, 1, TILE_WIDTH]} />
            <TempleBlock />
          </mesh>
          <mesh position={[TILE_WIDTH, 0, -TILE_WIDTH * 2]}>
            <boxBufferGeometry args={[TILE_WIDTH, 1, TILE_WIDTH]} />
            <TempleBlock />
          </mesh>
          <mesh position={[0, 0, -TILE_WIDTH]}>
            <boxBufferGeometry args={[TILE_WIDTH, 1, TILE_WIDTH]} />
            <TempleBlock />
          </mesh>
          <mesh position={[TILE_WIDTH, 0, -TILE_WIDTH]}>
            <boxBufferGeometry args={[TILE_WIDTH, 1, TILE_WIDTH]} />
            <TempleBlock />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxBufferGeometry args={[TILE_WIDTH, 1, TILE_WIDTH]} />
            <TempleBlock />
          </mesh>
          <mesh position={[TILE_WIDTH, 0, 0]}>
            <boxBufferGeometry args={[TILE_WIDTH, 1, TILE_WIDTH]} />
            <TempleBlock />
          </mesh>
          <mesh position={[0, 0, TILE_WIDTH]}>
            <boxBufferGeometry args={[TILE_WIDTH, 1, TILE_WIDTH]} />
            <TempleBlock />
          </mesh>
          <mesh position={[TILE_WIDTH, 0, TILE_WIDTH]}>
            <boxBufferGeometry args={[TILE_WIDTH, 1, TILE_WIDTH]} />
            <TempleBlock />
          </mesh>
        </>
      )}
    </mesh>
  );
}
