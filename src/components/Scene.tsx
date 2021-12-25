import { Player } from "./Player/Player";
import { Ground } from "./Ground";
import { Enemies } from "./Enemies/Enemies";
import { Collisions } from "./Player/Collisions";
import { Lighting } from "./Lighting";
import { OrbitControlsWithAngle } from "./OrbitControlsWithAngle";
import { DroppedItems } from "./DroppedItems/DroppedItems";

export function Scene() {
  return (
    <mesh>
      <Ground />
      <Lighting />
      <Player />
      <Enemies />
      <Collisions />
      <OrbitControlsWithAngle />
      <DroppedItems />
    </mesh>
  );
}
export type Direction = "ArrowUp" | "ArrowLeft" | "ArrowRight" | "ArrowDown";
