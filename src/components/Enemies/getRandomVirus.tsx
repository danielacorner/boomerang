import { shuffle } from "../../utils/shuffle";
import Bacteriophage_phi29_prohead_80_cleaned_draco from "../GLTFs/viruses/Bacteriophage_phi29_prohead_80_cleaned_draco";
import Herpes_600_cleaned_draco from "../GLTFs/viruses/Herpes_600_cleaned_draco";
import HIV_200_cleaned_draco from "../GLTFs/viruses/HIV_200_cleaned_draco";
import SphereShield from "./SphereShield";

export function getRandomVirus(id) {
  return shuffle([
    {
      enemyName: "Bacteriophage Phi29 Prohead",
      maxHp: 9,
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
      enemyName: "HIV",
      maxHp: 14,
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
    {
      enemyName: "Herpes",
      maxHp: 21,
      enemyHeight: 12,
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
  ])[0];
}
const VIRUS_SCALE = 0.003;
