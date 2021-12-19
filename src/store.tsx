import { atom, useAtom } from "jotai";

const boomerangStateAtom = atom<{
  clickTargetPosition: [number, number, number] | null;
  status: "idle" | "flying" | "returning";
}>({
  clickTargetPosition: [0, 0, 0],
  status: "idle",
});
export function useBoomerangState() {
  return useAtom(boomerangStateAtom);
}
const playerStateAtom = atom<{
  lookAt: [number, number, number];
}>({
  lookAt: [0, 0, 0],
});
export function usePlayerState() {
  return useAtom(playerStateAtom);
}

const isDevAtom = atom<boolean>(process.env.NODE_ENV === "development");
export const useIsDev = () => useAtom(isDevAtom);

const droppedMoneyPositionsAtom = atom<
  {
    unmounted: boolean;
    unmount: Function;
    position: [number, number, number];
  }[]
>([]);
export const useDroppedMoneyPositions = () =>
  useAtom(droppedMoneyPositionsAtom);
const powerupPositionsAtom = atom<
  {
    unmounted: boolean;
    unmount: Function;
    position: [number, number, number];
  }[]
>([]);
export const usePowerupPositions = () => useAtom(powerupPositionsAtom);
