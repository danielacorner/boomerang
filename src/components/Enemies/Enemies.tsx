import { Enemy } from "./Enemy";
import { useCallback, useEffect, useState } from "react";
import { useInterval, useMount, usePrevious } from "react-use";
import { useEnemies } from "../../store";
import { Virus } from "./Virus";
import {
  BACTERIOPHAGE_PHI29_PROHEAD,
  BACTERIOPHAGE_P68_120,
  getRandomVirus,
  HERPES,
  HIV,
  ADENOVIRUS_160_OUTER,
  HPV_100,
  JEFF_BEZOS,
} from "./VIRUSES";
import { atom, useAtom } from "jotai";

const MAX_ENEMIES = 6;

export function Enemies() {
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

  useSpawnWavesOfEnemies(spawnEnemy);

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

const WAVES = [
  {
    enemies: [
      () => BACTERIOPHAGE_PHI29_PROHEAD(),
      () => BACTERIOPHAGE_PHI29_PROHEAD(),
      () => BACTERIOPHAGE_PHI29_PROHEAD(),
      () => BACTERIOPHAGE_PHI29_PROHEAD(),
    ],
  },
  {
    enemies: [
      () => BACTERIOPHAGE_PHI29_PROHEAD(),
      () => BACTERIOPHAGE_PHI29_PROHEAD(),
      () => HIV(),
      () => HIV(),
    ],
  },
  {
    enemies: [
      () => BACTERIOPHAGE_PHI29_PROHEAD(),
      () => HIV(),
      () => HPV_100(),
      (id) => HERPES({ shield: true, id }),
    ],
  },
  {
    enemies: [
      (id) => BACTERIOPHAGE_P68_120({ shield: false, id }),
      (id) => BACTERIOPHAGE_P68_120({ shield: true, id }),
      (id) => HERPES({ shield: true, id }),
      (id) => HERPES({ shield: true, id }),
      () => HPV_100(),
      () => HPV_100(),
    ],
  },
  {
    enemies: [
      (id) => BACTERIOPHAGE_P68_120({ shield: false, id }),
      (id) => BACTERIOPHAGE_P68_120({ shield: true, id }),
      (id) => ADENOVIRUS_160_OUTER({ shield: true, id }),
      (id) => ADENOVIRUS_160_OUTER({ shield: true, id }),
      () => JEFF_BEZOS(),
    ],
  },
  {
    enemies: [
      (id) => BACTERIOPHAGE_P68_120({ shield: false, id }),
      (id) => BACTERIOPHAGE_P68_120({ shield: true, id }),
      (id) => BACTERIOPHAGE_P68_120({ shield: true, id }),
      (id) => BACTERIOPHAGE_P68_120({ shield: true, id }),
      (id) => ADENOVIRUS_160_OUTER({ shield: true, id }),
      (id) => ADENOVIRUS_160_OUTER({ shield: true, id }),
      () => HPV_100(),
      () => HPV_100(),
      () => HPV_100(),
      () => HPV_100(),
    ],
  },
  {
    enemies: [
      (id) => ADENOVIRUS_160_OUTER({ shield: true, id }),
      (id) => ADENOVIRUS_160_OUTER({ shield: true, id }),
      (id) => ADENOVIRUS_160_OUTER({ shield: true, id }),
      (id) => ADENOVIRUS_160_OUTER({ shield: true, id }),
      () => HPV_100(),
      () => HPV_100(),
      () => HPV_100(),
      () => HPV_100(),
    ],
  },
];

const currentWaveAtom = atom(0);
export const useCurrentWave = () => useAtom(currentWaveAtom);
function useSpawnWavesOfEnemies(spawnEnemy) {
  const [currentWave, setCurrentWave] = useCurrentWave();
  const prevWave = usePrevious(currentWave);
  // 1. spawn a wave of enemies

  // when the wave changes,
  // spawn the associated enemies
  useEffect(() => {
    if (prevWave !== currentWave) {
      WAVES[currentWave].enemies.forEach((enemy, idx) => {
        const id = Math.round(Math.random() * 10 ** 16);
        spawnEnemy(typeof enemy === "function" ? enemy(id) : enemy, id);
        // setTimeout(() => spawnEnemy(enemy), idx * 1000);
      });
    }
  }, [currentWave]);

  // 2. when all enemies are unmounted, spawn the next wave
  const [Enemies, setEnemies] = useEnemies();
  useEffect(() => {
    if (Enemies.length > 0 && Enemies.every((enemy) => enemy.unmounted)) {
      setCurrentWave(currentWave + 1);
    }
  }, [Enemies]);
}
