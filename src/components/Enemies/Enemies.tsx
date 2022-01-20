import { Enemy } from "./Enemy";
import { useCallback } from "react";
import { useInterval, useMount } from "react-use";
import { useEnemies } from "../../store";
import { Virus } from "./Virus";
import { shuffle } from "../../utils/shuffle";
import Bacteriophage_phi29_prohead_80_cleaned_draco from "../GLTFs/viruses/Bacteriophage_phi29_prohead_80_cleaned_draco";
import Herpes_600_cleaned_draco from "../GLTFs/viruses/Herpes_600_cleaned_draco";
import HIV_200_cleaned_draco from "../GLTFs/viruses/HIV_200_cleaned_draco";
import SphereShield from "./SphereShield";
import { Text } from "@react-three/drei";

const MAX_ENEMIES = 4;

export function Enemies() {
  const [Enemies, setEnemies] = useEnemies();

  const spawnEnemy = useCallback(() => {
    const id = Math.random() * 10 ** 16;

    const { RandomVirus, maxHp } = getRandomVirus(id);

    setEnemies((p) => {
      const newEnemies = [
        ...p,
        {
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

  useInterval(spawnEnemy, 3 * 1000);
  useMount(spawnEnemy);

  return (
    <>
      {Enemies.map(
        ({ id, Component, unmountEnemy, unmounted, invulnerable, maxHp }) =>
          unmounted ? null : (
            <Enemy key={id} {...{ unmountEnemy, invulnerable, maxHp }}>
              <Component />
            </Enemy>
          )
      )}
    </>
  );
}

const VIRUS_SCALE = 0.003;

function getRandomVirus(id) {
  const { maxHp, Component: RandomVirus } = shuffle([
    {
      maxHp: 1,
      Component: (p) => (
        <group position={[0, 2, 0]}>
          <Bacteriophage_phi29_prohead_80_cleaned_draco
            scale={VIRUS_SCALE}
            {...p}
          />
          {/* <SphereShield {...{ id }} scale={2} /> */}
          <Nametag
            name="Bacteriophage Phi29 Prohead"
            url="https://www.rcsb.org/structure/6QVK"
            translateY={0}
          />
        </group>
      ),
    },
    {
      maxHp: 3,
      Component: (p) => (
        <group position={[0, 3.5, 0]}>
          <Herpes_600_cleaned_draco scale={VIRUS_SCALE} {...p} />
          <SphereShield {...{ id }} scale={4} />
          <Nametag
            name="Herpes"
            url="https://www.rcsb.org/structure/6CGR"
            translateY={0}
          />
        </group>
      ),
    },
    {
      maxHp: 2,
      Component: (p) => (
        <group position={[0, 2, 0]}>
          <HIV_200_cleaned_draco scale={VIRUS_SCALE} {...p} />
          {/* <SphereShield {...{ id }} scale={3} /> */}
          <Nametag
            name="HIV"
            url="https://www.rcsb.org/structure/3J3Y/"
            translateY={0}
          />
        </group>
      ),
    },
  ])[0];
  return { RandomVirus, maxHp };
}

function Nametag({ name, url, translateY }) {
  return (
    <group position={[0, translateY, 0]}>
      <Text color="white" anchorX="center" anchorY="middle">
        {name}
      </Text>
    </group>
  );
}
