import { Player } from "./Player/Player";
import { Enemies } from "./Enemies/Enemies";
import { Walls } from "./Player/Walls";
import { Lighting } from "./Lighting";
import { OrbitControlsWithAngle } from "./OrbitControlsWithAngle";
import { DroppedItems } from "./DroppedItems/DroppedItems";
import { Ground } from "./Ground";
import { AdaptiveDpr } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export function Scene() {
  useFrame(({ performance }) => {
    console.log(
      "🌟🚨 ~ file: Scene.tsx ~ line 15 ~ useFrame ~ performance",
      performance.current
    );
    performance.regress();
  });
  return (
    <mesh>
      <Lighting />
      <Player />
      <Enemies />
      <Walls />
      <OrbitControlsWithAngle />
      <DroppedItems />
      <Ground />
      <AdaptiveDpr pixelated />
    </mesh>
  );
}
export type Direction = "ArrowUp" | "ArrowLeft" | "ArrowRight" | "ArrowDown";
