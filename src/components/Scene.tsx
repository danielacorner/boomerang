import { Player } from "./Player/Player";
import { Ground } from "./Ground";
import { Enemies } from "./Enemies/Enemies";
import { Collisions } from "./Player/Collisions";
import { Lighting } from "./Lighting";
import { Sky } from "@react-three/drei";
import { OrbitControlsWithAngle } from "./OrbitControlsWithAngle";
import { DroppedItems } from "./DroppedItems/DroppedItems";

export function Scene() {
  const { x, y, z } = { x: -0.02, y: 0.01, z: 0 };
  const { rayleigh } = { rayleigh: 0.7 };
  return (
    <mesh>
      <Ground />
      <Lighting />
      <Player />
      <Enemies />
      <Sky sunPosition={[x, y, z]} rayleigh={rayleigh} />
      <Collisions />
      <OrbitControlsWithAngle />
      <DroppedItems />
    </mesh>
  );
}
export type Direction = "ArrowUp" | "ArrowLeft" | "ArrowRight" | "ArrowDown";
