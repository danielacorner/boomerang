import { Player } from "./Player/Player";
import { Ground } from "./Ground";
import { Enemies } from "./Enemies/Enemies";
import { Collisions } from "./Player/Collisions";
import { Lighting } from "./Lighting";
import { PresentationControls, Sky } from "@react-three/drei";

export function Scene() {
  const { x, y, z } = { x: -0.02, y: 0.01, z: 0 };
  const { rayleigh } = { rayleigh: 0.7 };
  return (
    <mesh>
      <PresentationControls
        global
        config={{ mass: 2, tension: 500 }}
        snap={true}
        rotation={[0, 0, 0]}
      >
        <Ground />
        <Lighting />
        <Player />
        <Enemies />
        <Sky sunPosition={[x, y, z]} rayleigh={rayleigh} />
      </PresentationControls>
      <Collisions />
      {/* <OrbitControlsWithAngle /> */}
    </mesh>
  );
}
export type Direction = "ArrowUp" | "ArrowLeft" | "ArrowRight" | "ArrowDown";
