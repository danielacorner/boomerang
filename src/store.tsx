import { atom, useAtom } from "jotai";

const targetPositionAtom = atom([0, 0, 0]);
export function useTargetPosition() {
  return useAtom(targetPositionAtom);
}
