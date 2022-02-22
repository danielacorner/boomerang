/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: ndiecity (https://sketchfab.com/ndiecity)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/3d-models/wizard-cat-42cc473a1c17467c8f96e47e2a4439de
title: Wizard Cat
*/

import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useGameStateRef } from "../../store";
import { useFrame } from "@react-three/fiber";

export default function Model({ ...props }) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF(
    "/models/black_mage/scene.gltf"
  ) as any;
  const { actions, names, ...rest } = useAnimations(animations, group);

  const [gameStateRef] = useGameStateRef();
  // Change animation when the index changes
  useEffect(() => {
    // Reset and fade in animation after an index has been changed
    actions[names?.[0]]?.reset().fadeIn(0.5).play();
    // In the clean-up phase, fade it out
    return () => {
      actions[names?.[0]]?.fadeOut(0.5);
    };
  }, [actions, names]);

  // const toggle = useRef(false);
  // useFrame(() => {
  //   if (gameStateRef.current.isAnimating && !toggle.current) {
  //     toggle.current = true;
  //     actions[names?.[0]]?.fadeOut(0.5);
  //   } else if (!gameStateRef.current.isAnimating && toggle.current) {
  //     toggle.current = false;
  //     actions[names?.[0]]?.reset().fadeIn(0.5).play();
  //   }
  // });

  return (
    <group ref={group} {...props} dispose={null}>
      <group position={[0, -2, -2]} rotation={[-Math.PI / 2, 0, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group
            position={[1.41, 0.79, -0.86]}
            rotation={[Math.PI / 2, 0, -1.97]}
          >
            <mesh
              geometry={nodes.Object_4.geometry}
              material={nodes.Object_4.material}
            />
          </group>
          <group
            position={[-1.39, 1.76, 0.58]}
            rotation={[Math.PI / 2, 0, -1.97]}
          >
            <mesh
              geometry={nodes.Object_6.geometry}
              material={nodes.Object_6.material}
            />
          </group>
          <group
            position={[0.04, 1.71, -2.21]}
            rotation={[Math.PI / 2, 0, -1.97]}
          >
            <mesh
              geometry={nodes.Object_8.geometry}
              material={nodes.Object_8.material}
            />
          </group>
          <primitive object={nodes.GLTF_created_0_rootJoint} />
          <skinnedMesh
            castShadow
            receiveShadow
            geometry={nodes.Object_13.geometry}
            material={materials.Material}
            skeleton={nodes.Object_13.skeleton}
          />
          <skinnedMesh
            castShadow
            receiveShadow
            geometry={nodes.Object_14.geometry}
            material={materials.cateye}
            skeleton={nodes.Object_14.skeleton}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/black_mage/scene.gltf");
