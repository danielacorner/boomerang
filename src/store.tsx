import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const boomerangStateAtom = atom<{
  clickTargetPosition: [number, number, number] | null;
  status: "idle" | "flying" | "returning";
}>({
  clickTargetPosition: null,
  status: "idle",
});
export function useBoomerangState() {
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
  boomerangs: number;
  hitpoints: number;
  invulnerable: boolean;
}>({
  boomerangs: 1,
  hitpoints: 100,
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
}

const droppedItemsAtom = atom<
  {
    position: [number, number, number];
    type: ITEM_TYPES;
  }[]
>([]);
export const useDroppedItems = () => useAtom(droppedItemsAtom);
