import { useFrame } from "@react-three/fiber";
import { useBox } from "@react-three/cannon";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { DOWN, LEFT, RIGHT, UP, usePressedKeys } from "./usePressedKeys";

const [ROT_TOP, ROT_RIGHT, ROT_BOTTOM, ROT_LEFT] = [
	Math.PI * 1,
	Math.PI * 0.5,
	Math.PI * 0,
	Math.PI * -0.5,
];

export function usePlayerControls() {
	const MOVE_SPEED = 0.3;
	const [pressedKeys, lastPressedKey] = usePressedKeys();

	const ref = useRef<THREE.Mesh>(null!);
	const [boxRef, api] = useBox(() => ({ mass: 1, position: [0, 2, 0] }), ref);

	const position = useRef([0, 0, 0]);
	useEffect(() => {
		const unsubscribe = api.position.subscribe((v) => (position.current = v));
		return unsubscribe;
	}, []);
	useFrame(() => {
		if (!boxRef.current) {
			return;
		}
		const [x, y, z] = [
			position.current[0],
			position.current[1],
			position.current[2],
		];
		const [x2, y2, z2] = [
			x +
				(pressedKeys.includes(RIGHT)
					? 1
					: pressedKeys.includes(LEFT)
					? -1
					: 0) *
					MOVE_SPEED,
			y,
			z +
				(pressedKeys.includes(DOWN) ? 1 : pressedKeys.includes(UP) ? -1 : 0) *
					MOVE_SPEED,
		];
		api.position.set(x2, y2, z2);

		api.rotation.set(
			0,
			lastPressedKey === UP
				? ROT_TOP
				: lastPressedKey === LEFT
				? ROT_LEFT
				: lastPressedKey === DOWN
				? ROT_BOTTOM
				: lastPressedKey === RIGHT
				? ROT_RIGHT
				: 0,
			0
		);
	});
	console.log(
		"🌟🚨 ~ file: App.tsx ~ line 62 ~ usePlayerControls ~ pressedKeys",
		pressedKeys
	);

	return [ref, boxRef];
}
