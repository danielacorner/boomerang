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
