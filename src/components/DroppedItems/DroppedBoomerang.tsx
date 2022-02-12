import { useCylinder } from "@react-three/cannon";
import { useRef, useState } from "react";
import { useMount } from "react-use";
import {
	PLAYER_NAME,
	BOOMERANG_ITEM_NAME,
	GROUP1,
	ANIMATION_DURATION,
} from "../../utils/constants";
import BoomerangModel from "../GLTFs/BoomerangModel";
import {
	useDroppedItems,
	useGameStateRef,
	useHeldBoomerangs,
} from "../../store";
import { DroppedBoomerangPin } from "./DroppedBoomerangPin";

const BOOMERANG_ITEM_HEIGHT = 2;

export function DroppedBoomerang({ position, setMounted, id }) {
	const [, setDroppedItems] = useDroppedItems();
	const [, setHeldBoomerangs] = useHeldBoomerangs();
	const [gameStateRef] = useGameStateRef();
	const onceRef = useRef(false);
	const unmountBoom = () => {
		setDroppedItems((p) =>
			p.map((i) => (i.id === id ? { ...i, unmounted: true } : i))
		);
		setMounted(false);
	};
	const [ref, api] = useCylinder(() => ({
		args: [2, 2, BOOMERANG_ITEM_HEIGHT, 6],
		mass: 200,
		position,
		collisionFilterGroup: GROUP1,
		onCollide: (e) => {
			const isCollisionWithPlayer = e.body && e.body.name === PLAYER_NAME;

			if (isCollisionWithPlayer && !onceRef.current) {
				onceRef.current = true;
				console.log("💥 oof a BOOMERANG", e);
				// console.log("COLLISION! with boomerang", e);
				const newBoomerang = {
					status: "held" as any,
					clickTargetPosition: null,
				};
				setHeldBoomerangs((p) => [...p, newBoomerang]);

				const isZeldaAnimation =
					gameStateRef.current.heldBoomerangs.length === 0 &&
					!gameStateRef.current.isAnimating;
				if (isZeldaAnimation) {
					gameStateRef.current.isAnimating = true;
					setTimeout(() => {
						gameStateRef.current.isAnimating = false;
						unmountBoom();
					}, ANIMATION_DURATION);
				} else {
					unmountBoom();
				}

				gameStateRef.current.heldBoomerangs = [
					...gameStateRef.current.heldBoomerangs,
					newBoomerang,
				];
			}
		},
	}));

	return (
		<mesh ref={ref} name={BOOMERANG_ITEM_NAME}>
			<DroppedBoomerangPin />
			<pointLight intensity={4} distance={8} position={[0, 2, 0]} />
			<BoomerangModel idx={null} isDroppedBoomerang={true} />
		</mesh>
	);
}
