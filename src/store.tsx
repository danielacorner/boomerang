import { atom, useAtom } from "jotai";

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
}>({
  lookAt: [0, 0, 0],
  playerPosition: null,
  farthestTargetPosition: null,
  poweredUp: false,
});
export function usePlayerState() {
  return useAtom(playerStateAtom);
}

const gameStateAtom = atom<{ money: number; hitpoints: number }>({
  money: 0,
  hitpoints: 100,
});
export const useGameState = () => useAtom(gameStateAtom);

const isDevAtom = atom<boolean>(process.env.NODE_ENV === "development");
export const useIsDev = () => useAtom(isDevAtom);

const droppedMoneyPositionsAtom = atom<
  {
    position: [number, number, number];
  }[]
>([]);
export const useDroppedMoneyPositions = () =>
  useAtom(droppedMoneyPositionsAtom);
const powerupPositionsAtom = atom<
  {
    position: [number, number, number];
  }[]
>([]);
export const usePowerupPositions = () => useAtom(powerupPositionsAtom);
