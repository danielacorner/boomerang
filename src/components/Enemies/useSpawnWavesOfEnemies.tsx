import { useCallback, useEffect, useRef } from "react";
import { usePrevious } from "react-use";
import { useDroppedItems, useEnemies, useGameStateRef } from "../../store";
import { Virus } from "./Virus";
import { getRandomVirus } from "./VIRUSES";
import { WAVES_OF_ENEMIES } from "./WAVES_OF_ENEMIES";
import { MAX_ENEMIES, useCurrentWave } from "./Enemies";
import { useFrame } from "@react-three/fiber";

export function useSpawnWavesOfEnemies() {
  const [gameStateRef] = useGameStateRef();
  const [Enemies, setEnemies] = useEnemies();

  const spawnEnemy = useCallback((virus, randId) => {
    const id = randId || Math.random() * 10 ** 16;

    const { RandomVirus, maxHp, enemyHeight, enemyName, enemyUrl } =
      virus || getRandomVirus(id);

    setEnemies((p) => {
      const newEnemies = [
        ...p,
        {
          maxHp,
          enemyHeight,
          enemyName,
          enemyUrl,
          Component: () => <Virus {...{ id, RandomVirus, maxHp }} />,
          unmounted: false,
          id,
          invulnerable: false,
          unmountEnemy: () =>
            setEnemies((prev) =>
              prev.map((e) => (e.id === id ? { ...e, unmounted: true } : e))
            ),
        },
      ];
      return newEnemies.filter((e) => !e.unmounted).length > MAX_ENEMIES
        ? p
        : newEnemies;
    });
  }, []);

  const [currentWave, setCurrentWave] = useCurrentWave();
  const [droppedItems, setDroppedItems] = useDroppedItems();
  const prevWave = usePrevious(currentWave);
  // 1. spawn a wave of enemies
  const ready = useRef(false);

  // when the wave changes,
  // spawn the associated enemies & items
  useEffect(() => {
    if (prevWave !== currentWave) {
      const { enemies, droppedItems } = WAVES_OF_ENEMIES[currentWave];

      if (droppedItems) {
        setDroppedItems((p) => [
          ...p,
          ...droppedItems.map((item) => ({
            ...item,
            id: String(Math.random() * 10 ** 16),
            unmounted: false,
          })),
        ]);
      }

      enemies.forEach((enemy, idx) => {
        const id = Math.round(Math.random() * 10 ** 16);
        // spawnEnemy(enemy(id), id);
        setTimeout(
          () => spawnEnemy(enemy(id), id),
          idx * 1000 + Math.random() * 2000
        );
      });
      setTimeout(function getReady() {
        if (!gameStateRef.current.isAnimating) {
          setTimeout(getReady, 1000);
        } else {
          ready.current = true;
        }
      }, 1 * 1000);
    }
  }, [currentWave]);

  // 2. when all enemies AND items are unmounted, spawn the next wave
  useFrame(() => {
    if (
      ready.current &&
      !gameStateRef.current.isAnimating &&
      Enemies.every((enemy) => enemy.unmounted) &&
      // TODO: only works for first stage right now
      (currentWave !== 0 || droppedItems.length === 0)
    ) {
      ready.current = false;
      setCurrentWave(currentWave + 1);
    }
  });

  return [Enemies];
}
