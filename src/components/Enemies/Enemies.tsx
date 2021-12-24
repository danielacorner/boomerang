import { Enemy } from "./Enemy";
import JeffBezos from "../GLTFs/JeffBezos";
import MarkZuckerberg from "../GLTFs/MarkZuckerberg";
import ElonMusk from "../GLTFs/ElonMuskRunning";
import { useCallback } from "react";
import { useInterval, useMount } from "react-use";
import VirusEnemy from "../GLTFs/VirusEnemy";
import { useEnemies } from "../../store";

const MAX_ENEMIES = 16;

export function Enemies() {
  const [Enemies, setEnemies] = useEnemies();

  const spawnEnemy = useCallback(() => {
    const id = Math.random() * 10 ** 16;
    const Component = shuffle([
      // () => <Bezos />,
      // () => <Zuck />,
      // () => <Musk />,
      () => <Virus {...{ id }} />,
    ])[0];
    setEnemies((p) => {
      const newEnemies = [
        ...p,
        {
          Component,
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
const Virus = ({ id }) => (
  <group scale={1} position={[0, -1.6, 0]} rotation={[0, 0, 0]}>
    <VirusEnemy {...{ id }} />
  </group>
);

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
