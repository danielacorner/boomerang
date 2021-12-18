/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: Vadim Fedenko (https://sketchfab.com/vadimfedenko)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/3d-models/mark-zuckerberg-running-446d67d2ac314a70a8d455bfc7f804e6
title: Mark Zuckerberg Running
*/

import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export default function MarkZuckerberg({ ...props }) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF(
    "/models/mark_zuckerberg_running/scene.gltf"
  ) as any;
  const { actions, names, ...rest } = useAnimations(animations, group);

  // Change animation when the index changes
  useEffect(() => {
    // Reset and fade in animation after an index has been changed
    actions[names?.[0]]?.reset().fadeIn(0.5).play();
    // In the clean-up phase, fade it out
    return () => {
      actions[names?.[0]]?.fadeOut(0.5);
    };
  }, [actions, names]);
  return (
    <group ref={group} {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group scale={0.02}>
          <group rotation={[Math.PI / 2, 0, 0]}>
            <primitive object={nodes._rootJoint} />
            <skinnedMesh
              geometry={nodes.Hair_embed_hair_male_0.geometry}
              material={materials.embed_hair_male}
              skeleton={nodes.Hair_embed_hair_male_0.skeleton}
            />
            <skinnedMesh
              geometry={nodes["T_shirt_T-shirt_0"].geometry}
              material={materials["T-shirt"]}
              skeleton={nodes["T_shirt_T-shirt_0"].skeleton}
            />
            <skinnedMesh
              geometry={nodes.Sneakers__Sneakers_0.geometry}
              material={materials.Sneakers}
              skeleton={nodes.Sneakers__Sneakers_0.skeleton}
            />
            <skinnedMesh
              geometry={nodes.Jeans_Jeans_0.geometry}
              material={materials.Jeans}
              skeleton={nodes.Jeans_Jeans_0.skeleton}
            />
            <skinnedMesh
              geometry={nodes.CC_Base_Body_Std_Skin_Arm_0.geometry}
              material={materials.Std_Skin_Arm}
              skeleton={nodes.CC_Base_Body_Std_Skin_Arm_0.skeleton}
            />
            <skinnedMesh
              geometry={nodes.CC_Base_Body_Std_Skin_Head_0.geometry}
              material={materials.Std_Skin_Head}
              skeleton={nodes.CC_Base_Body_Std_Skin_Head_0.skeleton}
            />
            <skinnedMesh
              geometry={nodes.CC_Base_Body_Std_Nails_0.geometry}
              material={materials.Std_Nails}
              skeleton={nodes.CC_Base_Body_Std_Nails_0.skeleton}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/mark_zuckerberg_running/scene.gltf");