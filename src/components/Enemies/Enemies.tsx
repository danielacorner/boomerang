import { Enemy } from "./Enemy";
import JeffBezos from "../GLTFs/JeffBezos";
import MarkZuckerberg from "../GLTFs/MarkZuckerberg";
import ElonMusk from "../GLTFs/ElonMuskRunning";
import { useCallback, useEffect, useState } from "react";
import { useInterval, useMount } from "react-use";
import { useGLTF, useAnimations } from "@react-three/drei";
import { group } from "console";

export function Enemies() {
  const [Enemies, setEnemies] = useState<any>([]);

  const {
    nodes: zuckNodes,
    materials: zuckMaterials,
    animations: zuckAnimations,
  } = useGLTF("/models/mark_zuckerberg_running/scene.gltf") as any;

  const spawnEnemy = useCallback(() => {
    const Component = shuffle([
      () => <Bezos />,
      () => <Zuck />,
      () => <Musk />,
    ])[0];
    setEnemies((p) => {
      const id = Math.random() * 10 ** 16;
      return [
        ...p,
        {
          Component,
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
      {Enemies.map(({ id, Component, unmountEnemy, unmounted }) =>
        unmounted ? null : (
          <Enemy key={id} {...{ unmountEnemy }}>
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
