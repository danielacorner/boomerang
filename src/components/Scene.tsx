import { Player } from "./Player/Player";
import { Ground } from "./Ground";
import { Enemies } from "./Enemies/Enemies";
import { Walls } from "./Player/Walls";
import { Lighting } from "./Lighting";
import { OrbitControlsWithAngle } from "./OrbitControlsWithAngle";
import { DroppedItems } from "./DroppedItems/DroppedItems";

export function Scene() {
  return (
    <mesh>
      <Lighting />
      <Player />
      <Enemies />
      {/* <Walls /> */}
      <Levels />
      <OrbitControlsWithAngle />
      <DroppedItems />
    </mesh>
  );
}
export type Direction = "ArrowUp" | "ArrowLeft" | "ArrowRight" | "ArrowDown";
