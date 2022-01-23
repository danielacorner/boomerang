import { shuffle } from "../../utils/shuffle";
import Bacteriophage_phi29_prohead_80_cleaned_draco from "../GLTFs/viruses/Bacteriophage_phi29_prohead_80_cleaned_draco";
import Adenovirus_160_outer_cleaned_draco from "../GLTFs/viruses/Adenovirus_160_outer_cleaned_draco";
import Bacteriophage_P68_120 from "../GLTFs/viruses/Bacteriophage_P68_120_cleaned_draco";
import Herpes_600_cleaned_draco from "../GLTFs/viruses/Herpes_600_cleaned_draco";
import Hpv_100_cleaned_draco from "../GLTFs/viruses/Hpv_100_cleaned_draco";
import HIV_200_cleaned_draco from "../GLTFs/viruses/HIV_200_cleaned_draco";
import SphereShield from "./SphereShield";

export const ADENOVIRUS_160_OUTER = ({ shield = false, id = null } = {}) => ({
  enemyName: "Human Papillomavirus (HPV)",
  maxHp: 9,
  enemyHeight: 8,
  enemyUrl: "https://www.rcsb.org/structure/3J6R",
  RandomVirus: (p) => (
    <>
      <group position={[0, 2, 0]}>
        <Hpv_100_cleaned_draco scale={VIRUS_SCALE} {...p} />
        {shield && id && <SphereShield {...{ id }} scale={1} />}
      </group>
    </>
  ),
});
export const HPV_100 = ({ shield = false, id = null } = {}) => ({
  enemyName: "Adenovirus",
  maxHp: 9,
  enemyHeight: 8,
  enemyUrl: "https://www.rcsb.org/structure/6CGV",
  RandomVirus: (p) => (
    <>
      <group position={[0, 2, 0]}>
        <Adenovirus_160_outer_cleaned_draco scale={VIRUS_SCALE} {...p} />
        {shield && id && <SphereShield {...{ id }} scale={1} />}
      </group>
    </>
  ),
});
export const BACTERIOPHAGE_PHI29_PROHEAD = ({
  shield = false,
  id = null,
} = {}) => ({
  enemyName: "Bacteriophage phi29",
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
        {shield && id && <SphereShield {...{ id }} scale={1} />}
      </group>
    </>
  ),
});
export const BACTERIOPHAGE_P68_120 = ({ shield = false, id = null } = {}) => ({
  enemyName: "Bacteriophage P68",
  maxHp: 9,
  enemyHeight: 8,
  enemyUrl: "https://www.rcsb.org/structure/6Q3G",
  RandomVirus: (p) => (
    <>
      <group position={[0, 2, 0]}>
        <Bacteriophage_P68_120 scale={VIRUS_SCALE} {...p} />
        {shield && id && <SphereShield {...{ id }} scale={2} />}
      </group>
    </>
  ),
});
export const HIV = ({ shield = false, id = null } = {}) => ({
  enemyName: "HIV",
  maxHp: 14,
  enemyHeight: 8,
  enemyUrl: "https://www.rcsb.org/structure/3J3Y/",
  RandomVirus: (p) => (
    <>
      <group position={[0, 2, 0]}>
        <HIV_200_cleaned_draco scale={VIRUS_SCALE} {...p} />
        {shield && id && <SphereShield {...{ id }} scale={2.3} />}
      </group>
    </>
  ),
});
export const HERPES = ({ shield = false, id = null }) => ({
  enemyName: "Herpes",
  maxHp: 21,
  enemyHeight: 12,
  enemyUrl: "https://www.rcsb.org/structure/6CGR",
  RandomVirus: (p) => (
    <>
      <group position={[0, 3.5, 0]}>
        <Herpes_600_cleaned_draco scale={VIRUS_SCALE} {...p} />
        {shield && id && <SphereShield {...{ id }} scale={4} />}
      </group>
    </>
  ),
});

export function getRandomVirus(id) {
  return shuffle([BACTERIOPHAGE_PHI29_PROHEAD, HIV, HERPES(id)])[0];
}
const VIRUS_SCALE = 0.003;
