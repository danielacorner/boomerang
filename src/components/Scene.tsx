import { Player } from "./Player/Player";
import { Enemies } from "./Enemies/Enemies";
import { Walls } from "./Player/Walls";
import { Lighting } from "./Lighting";
import { OrbitControlsWithAngle } from "./OrbitControlsWithAngle";
import { DroppedItems } from "./DroppedItems/DroppedItems";
import { Ground } from "./Ground";

export function Scene() {
  return (
    <mesh>
      <Lighting />
      <Player />
      <Enemies />
      <Walls />
      <OrbitControlsWithAngle />
      <DroppedItems />
      <Ground />
    </mesh>
  );
}
export type Direction = "ArrowUp" | "ArrowLeft" | "ArrowRight" | "ArrowDown";
