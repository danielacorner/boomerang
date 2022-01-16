import { useRef } from "react";
import VirusEnemy from "../GLTFs/VirusEnemy";
import Bacteriophage_phi29_prohead_80_cleaned_draco from "../GLTFs/viruses/Bacteriophage_phi29_prohead_80_cleaned_draco";
import Herpes_600_cleaned_draco from "../GLTFs/viruses/Herpes_600_cleaned_draco";
import HIV_200_cleaned_draco from "../GLTFs/viruses/HIV_200_cleaned_draco";
import { shuffle } from "../../utils/shuffle";

const VIRUS_SCALE = 0.003;

export const Virus = ({ id }) => {
  const RandomVirus = useRef(
    shuffle([
      (p) => (
        <Bacteriophage_phi29_prohead_80_cleaned_draco
          scale={VIRUS_SCALE}
          position={[0, 2, 0]}
          {...p}
        />
      ),
      (p) => (
        <Herpes_600_cleaned_draco
          scale={VIRUS_SCALE}
          position={[0, 3.5, 0]}
          {...p}
        />
      ),
      (p) => (
        <HIV_200_cleaned_draco
          scale={VIRUS_SCALE}
          position={[0, 2, 0]}
          {...p}
        />
      ),
    ])[0]
  ).current;
  return (
    <group
      castShadow={true}
      receiveShadow={true}
      scale={2}
      position={[0, -1.6, 0]}
      rotation={[0, 0, 0]}
    >
      <VirusEnemy {...{ id }} />
      <RandomVirus />
    </group>
  );
};
