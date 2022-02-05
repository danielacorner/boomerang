import { Player } from "./Player/Player";
import { Enemies } from "./Enemies/Enemies";
import { Walls } from "./Player/Walls";
import { Lighting } from "./Lighting";
import { DroppedItems } from "./DroppedItems/DroppedItems";
import { Ground } from "./Ground";
import { AdaptiveDpr } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export function Scene() {
	useFrame(({ performance }) => {
		performance.regress();
	});
	return (
		<mesh>
			<Lighting />
			<Player />
			<Enemies />
			{/* <Walls /> */}
			<DroppedItems />
			<Ground />
			<AdaptiveDpr pixelated />w
		</mesh>
	);
}
export type Direction = "ArrowUp" | "ArrowLeft" | "ArrowRight" | "ArrowDown";
