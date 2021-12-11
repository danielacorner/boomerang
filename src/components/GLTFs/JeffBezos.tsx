/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: bettycolors (https://sketchfab.com/bettycolors)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/3d-models/jeff-bezos-blue-origin-5a072b4d63dd48a8b4bd41a2b845dc91
title: Jeff Bezos - Blue Origin
*/

import React, { useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export default function JeffBezos({ ...props }) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF(
    "/models/jeff_bezos/scene.gltf"
  ) as any;
  const { actions } = useAnimations(animations, group);
  console.log("🌟🚨 ~ Model ~ actions", actions);
  return (
    <group ref={group} {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={0.02}>
        <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <group name="metarig" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <primitive object={nodes._rootJoint} />
            <skinnedMesh
              geometry={nodes.Object_22.geometry}
              material={nodes.Object_22.material}
              skeleton={nodes.Object_22.skeleton}
            />
            <skinnedMesh
              geometry={nodes.Object_23.geometry}
              material={nodes.Object_23.material}
              skeleton={nodes.Object_23.skeleton}
            />
            <skinnedMesh
              geometry={nodes.Object_24.geometry}
              material={nodes.Object_24.material}
              skeleton={nodes.Object_24.skeleton}
            />
            <skinnedMesh
              geometry={nodes.Object_26.geometry}
              material={nodes.Object_26.material}
              skeleton={nodes.Object_26.skeleton}
            />
            <skinnedMesh
              geometry={nodes.Object_27.geometry}
              material={nodes.Object_27.material}
              skeleton={nodes.Object_27.skeleton}
            />
            <skinnedMesh
              geometry={nodes.Object_28.geometry}
              material={nodes.Object_28.material}
              skeleton={nodes.Object_28.skeleton}
            />
            <skinnedMesh
              geometry={nodes.Object_30.geometry}
              material={materials.material_5}
              skeleton={nodes.Object_30.skeleton}
            />
            <skinnedMesh
              geometry={nodes.Object_32.geometry}
              material={nodes.Object_32.material}
              skeleton={nodes.Object_32.skeleton}
            />
            <skinnedMesh
              geometry={nodes.Object_33.geometry}
              material={nodes.Object_33.material}
              skeleton={nodes.Object_33.skeleton}
            />
            <skinnedMesh
              geometry={nodes.Object_34.geometry}
              material={materials.Material__10sdf}
              skeleton={nodes.Object_34.skeleton}
            />
          </group>
          <group
            position={[-11.21, 7.49, 1706.29]}
            rotation={[0, 1.57, -0.06]}
            scale={[100, 100, 100]}
          />
          <group
            position={[0, 567.26, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes["���������_������001_0"].geometry}
              material={materials[".001"]}
            />
          </group>
          <group
            position={[0, 567.26, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes["������_Badge_0"].geometry}
              material={nodes["������_Badge_0"].material}
            />
          </group>
          <group
            position={[0, 567.26, -1.11]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <mesh
              geometry={nodes["������_Badge_0_1"].geometry}
              material={nodes["������_Badge_0_1"].material}
            />
          </group>
          <group
            position={[-135.54, -1385.21, 47.09]}
            rotation={[-Math.PI / 2, 0, -0.56]}
            scale={[0.47, 0.43, 0.41]}
          >
            <mesh
              geometry={nodes.Line004_Material__7sdf_0.geometry}
              material={materials.Material__7sdf}
            />
          </group>
          <group
            position={[15.01, 199.1, 1347.06]}
            rotation={[0.95, 0.08, -0.17]}
            scale={100}
          >
            <group rotation={[Math.PI / 2, 0, 0]} />
          </group>
          <group position={[-229.74, 633.44, -212.98]} scale={100}>
            <group rotation={[Math.PI / 2, 0, 0]} />
          </group>
          <group position={[312.65, 681.93, -192.05]} scale={100}>
            <group rotation={[Math.PI / 2, 0, 0]} />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/jeff_bezos/scene.gltf");
