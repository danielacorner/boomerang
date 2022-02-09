import { Enemy } from "./Enemy";
import { useCallback, useEffect, useRef } from "react";
import { useInterval, usePrevious } from "react-use";
import { useDroppedItems, useEnemies } from "../../store";
import { Virus } from "./Virus";
import { getRandomVirus } from "./VIRUSES";
import { atom, useAtom } from "jotai";
import { WAVES_OF_ENEMIES } from "./WAVES_OF_ENEMIES";

const MAX_ENEMIES = 6;

export function Enemies() {
  const [Enemies] = useSpawnWavesOfEnemies();

  return (
    <>
      {Enemies.map(
        ({
          id,
          Component,
          unmountEnemy,
          unmounted,
          invulnerable,
          maxHp,
          enemyHeight,
          enemyUrl,
          enemyName,
        }) =>
          unmounted ? null : (
            <Enemy
              key={id}
              {...{
                id,
                unmountEnemy,
                invulnerable,
                maxHp,
                enemyHeight,
                enemyUrl,
                enemyName,
              }}
            >
              <Component />
            </Enemy>
          )
      )}
    </>
  );
}

const currentWaveAtom = atom(0);
export const useCurrentWave = () => useAtom(currentWaveAtom);

function useSpawnWavesOfEnemies() {
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
      setTimeout(() => (ready.current = true), 1 * 1000);
    }
  }, [currentWave]);

  // 2. when all enemies AAND items are unmounted, spawn the next wave
  useEffect(() => {
    if (
      ready.current &&
      Enemies.every((enemy) => enemy.unmounted) &&
      // TODO: only works for first stage right now
      (currentWave !== 0 || droppedItems.length === 0)
    ) {
      ready.current = false;
      setCurrentWave(currentWave + 1);
    }
  }, [Enemies, droppedItems]);

  return [Enemies];
}
