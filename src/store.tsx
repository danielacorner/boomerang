import { atom, useAtom } from "jotai";
import { SetStateAction, useRef } from "react";
import { useMount } from "react-use";
import { Mesh, BufferGeometry, Material } from "three";
import { ITEM_TYPES } from "./utils/constants";
export const INITIAL_HITPOINTS = 3;

type EnemyType = {
	Component: any;
	unmounted: boolean;
	id: number;
	invulnerable: boolean;
	// eslint-disable-next-line @typescript-eslint/ban-types
	unmountEnemy: Function;
	maxHp: number;
	enemyHeight: number;
	enemyUrl: string;
	enemyName: string;
};

const enemiesAtom = atom<EnemyType[]>([]);
export function useEnemies() {
	return useAtom(enemiesAtom);
}
const playerRefAtom = atom<{ current: THREE.Mesh | null }>({ current: null });
export function usePlayerRef(): [
	{
		current: Mesh<BufferGeometry, Material | Material[]> | null;
	},
	(
		update: SetStateAction<{
			current: Mesh<BufferGeometry, Material | Material[]> | null;
		}>
	) => void
] {
	const ref = useRef<THREE.Mesh | null>(null);
	const [playerRef, setPlayerRef] = useAtom(playerRefAtom);
	useMount(() => {
		if (!playerRef.current) {
			setPlayerRef(ref);
		}
	});
	return [playerRef, setPlayerRef];
}
const playerPositionRefAtom = atom<{
	current: [number, number, number];
}>({
	current: [0, 0, 0],
});
export function usePlayerPositionRef(): [
	{
		current: [number, number, number];
	},
	(
		update: SetStateAction<{
			current: [number, number, number];
		}>
	) => void
] {
	const [playerPositionRef, setPlayerPositionRef] = useAtom(
		playerPositionRefAtom
	);

	return [playerPositionRef, setPlayerPositionRef];
}

type GameStateType = {
	hitpoints: number;
	maxHitpoints: number;
	invulnerable: boolean;
	money: number;
	lookAt: [number, number, number];
	farthestTargetPosition: [number, number, number];
};
export const INITIAL_GAME_STATE: GameStateType = {
	hitpoints: INITIAL_HITPOINTS,
	maxHitpoints: INITIAL_HITPOINTS,
	invulnerable: false,
	money: 0,
	lookAt: [0, 0, 0],
	farthestTargetPosition: [0, 0, 0],
};
const gameStateRefAtom = atom<{ current: GameStateType }>({
	current: INITIAL_GAME_STATE,
});
export function useGameStateRef(): [
	{
		current: GameStateType;
	},
	(
		update: SetStateAction<{
			current: GameStateType;
		}>
	) => void
] {
	const ref = useRef<GameStateType>(INITIAL_GAME_STATE);
	const [gameStateRef, setGameStateRef] = useAtom(gameStateRefAtom);
	useMount(() => {
		if (!gameStateRef.current) {
			setGameStateRef(ref);
		}
	});
	return [gameStateRef, setGameStateRef];
}

const boomerangStateAtom = atom<
	{
		clickTargetPosition: [number, number, number] | null;
		status: "held" | "flying" | "returning" | "dropped";
	}[]
>([
	{
		clickTargetPosition: null,
		status: "held",
	},
]);
export function useHeldBoomerangs() {
	return useAtom(boomerangStateAtom);
}
const playerStateAtom = atom<{
	lookAt: [number, number, number];
	playerPosition: [number, number, number];
	playerVelocity: [number, number, number];
	farthestTargetPosition: [number, number, number];
	poweredUp: boolean;
	poweredUpStartTime: number | null;
	rangeUp: boolean;
	rangeUpStartTime: number | null;
}>({
	lookAt: [0, 0, 0],
	playerPosition: [0, 0, 0],
	playerVelocity: [0, 0, 0],
	farthestTargetPosition: [0, 0, 0],
	poweredUp: false,
	poweredUpStartTime: null,
	rangeUp: false,
	rangeUpStartTime: null,
});
export function usePlayerState() {
	return useAtom(playerStateAtom);
}

const gameStateAtom = atom<{
	maxHitpoints: number;
	hitpoints: number;
	invulnerable: boolean;
}>({
	maxHitpoints: INITIAL_HITPOINTS,
	hitpoints: INITIAL_HITPOINTS,
	invulnerable: false,
});
export const useGameState = () => useAtom(gameStateAtom);

const moneyAtom = atom<number>(0);
export const useMoney = () => useAtom(moneyAtom);

const isDevAtom = atom<boolean>(process.env.NODE_ENV === "development");
export const useIsDev = () => useAtom(isDevAtom);

const droppedItemsAtom = atom<
	{
		position: [number, number, number];
		type: ITEM_TYPES;
	}[]
>([]);
export const useDroppedItems = () => useAtom(droppedItemsAtom);
