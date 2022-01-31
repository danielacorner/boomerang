import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { SetStateAction, useRef } from "react";
import { useMount } from "react-use";
import { Mesh, BufferGeometry, Material } from "three";
import { ITEM_TYPES } from "./utils/constants";

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

const targetRefAtom = atom<{ current: THREE.Mesh | null }>({ current: null });
export function useTargetRef(): [
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
  const [targetRef, setTargetRef] = useAtom(targetRefAtom);
  useMount(() => {
    if (!targetRef.current) {
      setTargetRef(ref);
    }
  });
  return [targetRef, setTargetRef];
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
  rangeUp: boolean;
}>({
  lookAt: [0, 0, 0],
  playerPosition: [0, 0, 0],
  playerVelocity: [0, 0, 0],
  farthestTargetPosition: [0, 0, 0],
  poweredUp: false,
  rangeUp: false,
});
export function usePlayerState() {
  return useAtom(playerStateAtom);
}

export const INITIAL_HITPOINTS = 3;
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
