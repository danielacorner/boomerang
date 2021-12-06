import { atom, useAtom } from "jotai";

const boomerangStateAtom = atom<{
  targetPosition: number[] | null;
  isThrown: boolean;
}>({
  targetPosition: [0, 0, 0],
  isThrown: false,
});
export function useBoomerangState() {
  return useAtom(boomerangStateAtom);
}
