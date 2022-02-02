import { useCylinder } from "@react-three/cannon";
import { useState } from "react";
import { useMount } from "react-use";
import {
	BOOMERANG_NAME,
	GROUP1,
	PLAYER_NAME,
	RANGEUP_NAME,
} from "../../utils/constants";
import Rangeup from "../GLTFs/Rangeup";

const RANGEUP_HEIGHT = 2;
const RANGEUP_DROP_DURATION = 16 * 1000;
const RANGEUP_INVULNERABLE_DURATION = 2 * 1000;

export function DroppedRangeup({ position }) {
	const [mounted, setMounted] = useState(true);
	useMount(() => {
		setTimeout(() => {
			setMounted(false);
		}, RANGEUP_DROP_DURATION);
	});
	return mounted ? (
		<DroppedRangeupContent {...{ position, setMounted }} />
	) : null;
}
export function DroppedRangeupContent({ position, setMounted }) {
	const [interactive, setInteractive] = useState(false);
	useMount(() => {
		setTimeout(() => {
			setInteractive(true);
		}, RANGEUP_INVULNERABLE_DURATION);
	});

	const [ref, api] = useCylinder(
		() => ({
			collisionFilterGroup: GROUP1,
			args: [3, 1, RANGEUP_HEIGHT, 6],
			mass: 200,
			type: interactive ? "Dynamic" : "Static",
			position,
			onCollide: (e) => {
				const isCollisionWithPlayer = e.body?.name === PLAYER_NAME;
				if (isCollisionWithPlayer) {
					setMounted(false);
				}

				if (e.body?.name.includes(BOOMERANG_NAME) && interactive) {
					setMounted(false);
				}
			},
		}),
		null,
		[interactive]
	);
	return (
		<mesh ref={ref} name={RANGEUP_NAME}>
			<Rangeup />
		</mesh>
	);
}
