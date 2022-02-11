import { Enemy } from "./Enemy";
import { atom, useAtom } from "jotai";
import { useSpawnWavesOfEnemies } from "./useSpawnWavesOfEnemies";

export const MAX_ENEMIES = 6;

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
