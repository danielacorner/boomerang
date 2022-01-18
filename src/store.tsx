import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { ITEM_TYPES } from "./utils/constants";

type EnemyType = {
  Component: any;
  unmounted: boolean;
  id: number;
  invulnerable: boolean;
  unmountEnemy: Function;
};

const enemiesAtom = atom<EnemyType[]>([]);
export function useEnemies() {
  return useAtom(enemiesAtom);
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
  poweredUp: boolean;
  rangeUp: boolean;
}>({
  lookAt: [0, 0, 0],
  playerPosition: [0, 0, 0],
  playerVelocity: [0, 0, 0],
  poweredUp: false,
  rangeUp: false,
});
export function usePlayerState() {
  return useAtom(playerStateAtom);
}

export const INITIAL_HITPOINTS = 5;
const gameStateAtom = atom<{
  hitpoints: number;
  invulnerable: boolean;
}>({
  hitpoints: INITIAL_HITPOINTS,
  invulnerable: false,
});
export const useGameState = () => useAtom(gameStateAtom);

const moneyAtom = atomWithStorage<number>("money", 0);
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
