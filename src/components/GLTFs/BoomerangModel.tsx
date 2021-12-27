/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: marvelmaster (https://sketchfab.com/marvelmaster)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/models/df8ac2230ff148b5b9f8bc2f7883c87b
title: Zelda Ocarina of Time Boomerang
*/

import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import { animated, useSpring } from "@react-spring/three";
import { useHeldBoomerangs } from "../../store";

export default function BoomerangModel({ idx, keepFlying = false, ...props }) {
  const group = useRef();
  const { nodes, materials } = useGLTF(
    "/models/zelda_ocarina_of_time_boomerang/scene.gltf"
  ) as any;
  const { x, y, z } = { x: -0.89, y: 0.64, z: 0.3 };

  const { x2, y2, z2 } = { x2: -18.13, y2: 10, z2: 9 };

  // fade out the boomerang when we catch it
  const [heldBoomerangs] = useHeldBoomerangs();
  const { status } = keepFlying
    ? { status: "flying" }
    : heldBoomerangs[idx] || { status: null };

  const { opacity } = useSpring({
    opacity: status === "idle" ? 0 : 1,
  });

  return (
    <group ref={group} {...props} dispose={null} scale={0.055}>
      <pointLight intensity={1} distance={20} />
      <group
        position={[x2, y2, z2]}
        rotation={[-Math.PI / 2 + x, 0 + y, 0 + z]}
      >
        <group
          position={[7.27, 14.19, 2.84]}
          rotation={[0.85, -0.69, -0.69]}
          scale={[1, 1, 1]}
        >
          <group rotation={[Math.PI / 2, 0, 0]}>
            <group
              position={[13.42, 16.08, -13.23]}
              rotation={[-Math.PI / 2, 0, -0.78]}
            >
              <animated.mesh
                castShadow
                geometry={nodes.Orb_BoomerangOrbHoler_Mat_0.geometry}
                material={materials.BoomerangOrbHoler_Mat}
                material-transparent={true}
                material-opacity={opacity}
              />
              <animated.mesh
                castShadow
                geometry={nodes.Orb_BoomerangOrb_Mat_0.geometry}
                material={materials.BoomerangOrb_Mat}
                material-transparent={true}
                material-opacity={opacity}
              />
            </group>
            <group
              position={[16, 14.59, -13.8]}
              rotation={[0, 1.15, -Math.PI / 2]}
              scale={[1, 1, 1]}
            >
              <animated.mesh
                castShadow
                geometry={nodes.RangWood_BoomerangWood_Mat_0.geometry}
                material={materials.BoomerangWood_Mat}
                material-transparent={true}
                material-opacity={opacity}
              />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/zelda_ocarina_of_time_boomerang/scene.gltf");
