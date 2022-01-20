/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export default function Model(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF(
    "/models/viruses/varicella_zoster_300_cleaned_draco.glb"
  ) as any;
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        geometry={
          nodes["Varicella-zostercif_assembly_1_A_Gaussian_surface"].geometry
        }
        material={materials["default"]}
      />
    </group>
  );
}

// useGLTF.preload('/models/viruses/varicella_zoster_300_cleaned_draco.glb')