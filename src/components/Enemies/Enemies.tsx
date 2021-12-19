import { Enemy } from "./Enemy";
import JeffBezos from "../GLTFs/JeffBezos";
import MarkZuckerberg from "../GLTFs/MarkZuckerberg";
import ElonMusk from "../GLTFs/ElonMuskRunning";
import { useCallback, useState } from "react";
import { useInterval, useMount } from "react-use";

export function Enemies() {
  const [Enemies, setEnemies] = useState<any>([]);

  const spawnEnemy = useCallback(() => {
    const NextEnemy = () =>
      ENEMIES_ARR[Math.floor(Math.random() * ENEMIES_ARR.length)];
    setEnemies((p) => {
      const id = Math.random() * 10 ** 16;
      return [
        ...p,
        {
          Component: NextEnemy,
          unmounted: false,
          id,
          unmountEnemy: () =>
            setEnemies((prev) =>
              prev.map((e) => (e.id === id ? { ...e, unmounted: true } : e))
            ),
        },
      ];
    });
  }, []);

  useInterval(spawnEnemy, 3 * 1000);
  useMount(spawnEnemy);

  return (
    <>
      {Enemies.map(({ Component, unmountEnemy, unmounted }) =>
        unmounted ? null : (
          <Enemy {...{ unmountEnemy }}>
            <Component />
          </Enemy>
        )
      )}
    </>
  );
}

const Zuck = () => (
  <group scale={1} position={[0, -1.3, 0]} rotation={[0, -1, 0]}>
    <MarkZuckerberg />
  </group>
);

const Bezos = () => (
  <group scale={1.8} position={[0, 0, 0]} rotation={[0, 0, 0]}>
    <JeffBezos />
  </group>
);
const Musk = () => (
  <group scale={1} position={[0, -1.6, 0]} rotation={[0, 0, 0]}>
    <ElonMusk />
  </group>
);

const ENEMIES_ARR = [<Bezos />, <Zuck />, <Musk />];
