import { Enemy } from "./Enemy";
import { useCallback } from "react";
import { useInterval, useMount } from "react-use";
import { useEnemies } from "../../store";
import { Virus } from "./Virus";

const MAX_ENEMIES = 4;

export function Enemies() {
  const [Enemies, setEnemies] = useEnemies();

  const spawnEnemy = useCallback(() => {
    const id = Math.random() * 10 ** 16;

    setEnemies((p) => {
      const newEnemies = [
        ...p,
        {
          Component: () => <Virus {...{ id }} />,
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

  useInterval(spawnEnemy, 3 * 1000);
  useMount(spawnEnemy);

  return (
    <>
      {Enemies.map(({ id, Component, unmountEnemy, unmounted, invulnerable }) =>
        unmounted ? null : (
          <Enemy key={id} {...{ unmountEnemy, invulnerable }}>
            <Component />
          </Enemy>
        )
      )}
    </>
  );
}
