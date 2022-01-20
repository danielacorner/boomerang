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

const MAX_ENEMIES = 6;

export function Enemies() {
  const [Enemies, setEnemies] = useEnemies();

  const spawnEnemy = useCallback(() => {
    const id = Math.random() * 10 ** 16;

    const { RandomVirus, maxHp, enemyHeight, enemyName, enemyUrl } =
      getRandomVirus(id);

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

  useInterval(spawnEnemy, 3 * 1000);
  useMount(spawnEnemy);

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

const VIRUS_SCALE = 0.003;

function getRandomVirus(id) {
  return shuffle([
    {
      enemyName: "Bacteriophage Phi29 Prohead",
      maxHp: 1.5,
      enemyHeight: 8,
      enemyUrl: "https://www.rcsb.org/structure/6QVK",
      RandomVirus: (p) => (
        <>
          <group position={[0, 2, 0]}>
            <Bacteriophage_phi29_prohead_80_cleaned_draco
              scale={VIRUS_SCALE}
              {...p}
            />
          </group>
          {/* <SphereShield {...{ id }} scale={2} /> */}
        </>
      ),
    },
    {
      enemyName: "Herpes",
      maxHp: 3,
      enemyHeight: 13,
      enemyUrl: "https://www.rcsb.org/structure/6CGR",
      RandomVirus: (p) => (
        <>
          <group position={[0, 3.5, 0]}>
            <Herpes_600_cleaned_draco scale={VIRUS_SCALE} {...p} />
            <SphereShield {...{ id }} scale={4} />
          </group>
        </>
      ),
    },
    {
      enemyName: "HIV",
      maxHp: 2,
      enemyHeight: 8,
      enemyUrl: "https://www.rcsb.org/structure/3J3Y/",

      RandomVirus: (p) => (
        <>
          <group position={[0, 2, 0]}>
            <HIV_200_cleaned_draco scale={VIRUS_SCALE} {...p} />
            {/* <SphereShield {...{ id }} scale={3} /> */}
          </group>
        </>
      ),
    },
  ])[0];
}
