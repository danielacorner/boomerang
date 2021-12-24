import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

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
    status: "idle" | "flying" | "returning";
  }[]
>([
  {
    clickTargetPosition: null,
    status: "idle",
  },
]);
export function useHeldBoomerangs() {
  return useAtom(boomerangStateAtom);
}
const playerStateAtom = atom<{
  lookAt: [number, number, number];
  playerPosition: [number, number, number] | null;
  farthestTargetPosition: [number, number, number] | null;
  poweredUp: boolean;
  rangeUp: boolean;
}>({
  lookAt: [0, 0, 0],
  playerPosition: null,
  farthestTargetPosition: null,
  poweredUp: false,
  rangeUp: false,
});
export function usePlayerState() {
  return useAtom(playerStateAtom);
}

const gameStateAtom = atom<{
  hitpoints: number;
  invulnerable: boolean;
}>({
  hitpoints: 5,
  invulnerable: false,
});
export const useGameState = () => useAtom(gameStateAtom);

const moneyAtom = atomWithStorage<number>("money", 0);
export const useMoney = () => useAtom(moneyAtom);

const isDevAtom = atom<boolean>(process.env.NODE_ENV === "development");
export const useIsDev = () => useAtom(isDevAtom);

export enum ITEM_TYPES {
  POWERUP = "powerup",
  RANGEUP = "rangeup",
  MONEY = "money",
  BOOMERANG = "boomerang",
}

const droppedItemsAtom = atom<
  {
    position: [number, number, number];
    type: ITEM_TYPES;
  }[]
>([]);
export const useDroppedItems = () => useAtom(droppedItemsAtom);
