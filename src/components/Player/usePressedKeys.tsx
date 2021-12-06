import { useEffect, useState } from "react";
import { useKey } from "react-use";
import { Direction } from "../../App";
export const [UP, LEFT, RIGHT, DOWN]: Direction[] = [
	"ArrowUp",
	"ArrowLeft",
	"ArrowRight",
	"ArrowDown",
];
const INITIAL_DIRECTION = DOWN;
export function usePressedKeys() {
	const [pressedKeys, setPressedKeys] = useState<Direction[]>([]);
	const [lastPressedKey, setLastPressedKey] = useState(INITIAL_DIRECTION);

	useKey("w", () => {
		setPressedKeys((p) => [...p, UP]);
		setLastPressedKey(UP);
	});
	useKey("a", () => {
		setPressedKeys((p) => [...p, LEFT]);
		setLastPressedKey(LEFT);
	});
	useKey("s", () => {
		setPressedKeys((p) => [...p, DOWN]);
		setLastPressedKey(DOWN);
	});
	useKey("d", () => {
		setPressedKeys((p) => [...p, RIGHT]);
		setLastPressedKey(RIGHT);
	});

	useKey(UP, () => {
		setPressedKeys((p) => [...p, UP]);
		setLastPressedKey(UP);
	});
	useKey(LEFT, () => {
		setPressedKeys((p) => [...p, LEFT]);
		setLastPressedKey(LEFT);
	});
	useKey(DOWN, () => {
		setPressedKeys((p) => [...p, DOWN]);
		setLastPressedKey(DOWN);
	});
	useKey(RIGHT, () => {
		setPressedKeys((p) => [...p, RIGHT]);
		setLastPressedKey(RIGHT);
	});

	useKey("w", () => setPressedKeys((p) => p.filter((key) => key !== UP)), {
		event: "keyup",
	});
	useKey("a", () => setPressedKeys((p) => p.filter((key) => key !== LEFT)), {
		event: "keyup",
	});
	useKey("s", () => setPressedKeys((p) => p.filter((key) => key !== DOWN)), {
		event: "keyup",
	});
	useKey("d", () => setPressedKeys((p) => p.filter((key) => key !== RIGHT)), {
		event: "keyup",
	});

	useKey(UP, () => setPressedKeys((p) => p.filter((key) => key !== UP)), {
		event: "keyup",
	});
	useKey(LEFT, () => setPressedKeys((p) => p.filter((key) => key !== LEFT)), {
		event: "keyup",
	});
	useKey(DOWN, () => setPressedKeys((p) => p.filter((key) => key !== DOWN)), {
		event: "keyup",
	});
	useKey(RIGHT, () => setPressedKeys((p) => p.filter((key) => key !== RIGHT)), {
		event: "keyup",
	});

	return [pressedKeys, lastPressedKey];
}
