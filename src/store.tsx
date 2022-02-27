import { PublicApi } from "@react-three/cannon";
import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { SetStateAction, useEffect, useRef } from "react";
import { useMount } from "react-use";
import { Mesh, BufferGeometry, Material, Object3D } from "three";
import { ITEM_TYPES } from "./utils/constants";
export const INITIAL_HITPOINTS = 3;

// TODO: try zustand or valtio

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

export type GameStateType = {
  isAnimating: boolean;
  poweredUp: boolean;
  rangeUp: boolean;
  rangeUpStartTime: number | null;
  cylinderApi: null | PublicApi;
  cylinderRef: null | React.RefObject<THREE.Object3D<THREE.Event>>;
  hitpoints: number;
  maxHitpoints: number;
  invulnerable: boolean;
  heldBoomerangs: HeldBoomerang[];
  money: number;
  lookAt: [number, number, number];
  playerPosition: [number, number, number];
  farthestTargetPosition: [number, number, number];
  powerupTimer: number | null;
  rangeupTimer: number | null;
  dashTime: number;
};
export const INITIAL_GAME_STATE: GameStateType = {
  isAnimating: false,
  rangeUp: false,
  rangeUpStartTime: null,
  poweredUp: false,
  cylinderApi: null,
  cylinderRef: null,
  hitpoints: INITIAL_HITPOINTS,
  maxHitpoints: INITIAL_HITPOINTS,
  heldBoomerangs: [],
  invulnerable: false,
  money: 0,
  lookAt: [0, 0, 0],
  playerPosition: [0, 0, 0],
  farthestTargetPosition: [0, 0, 0],
  powerupTimer: null,
  rangeupTimer: null,
  dashTime: 0,
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

type HeldBoomerang = {
  clickTargetPosition: [number, number, number] | null;
  status: "held" | "flying" | "returning" | "dropped";
};
const boomerangStateAtom = atom<HeldBoomerang[]>([
  // {
  //   clickTargetPosition: null,
  //   status: "held",
  // },
]);
export function useHeldBoomerangs() {
  return useAtom(boomerangStateAtom);
}

type BoomerangRefState = {
  position: [number, number, number];
  status: "flying" | "returning" | "dropped";
};
const boomerangRefsAtom = atom<{ current: BoomerangRefState[] }>({
  current: [],
});
export function useBoomerangRefs(): [
  {
    current: BoomerangRefState[];
  },
  (
    update: SetStateAction<{
      current: BoomerangRefState[];
    }>
  ) => void
] {
  const ref = useRef<BoomerangRefState[]>([]);
  const [boomerangRefs, setBoomerangRefs] = useAtom(boomerangRefsAtom);
  useMount(() => {
    if (!boomerangRefs.current) {
      setBoomerangRefs(ref);
    }
  });

  // sync with heldBoomerangs
  const [heldBoomerangs] = useHeldBoomerangs();
  useEffect(() => {
    if (boomerangRefs.current.length !== heldBoomerangs.length) {
      boomerangRefs.current = [
        ...boomerangRefs.current,
        ...Array(heldBoomerangs.length - boomerangRefs.current.length).fill({
          status: "held",
          position: [0, 0, 0],
        }),
      ];
    }
  });

  return [boomerangRefs, setBoomerangRefs];
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

export type DroppedItemType = {
  position: [number, number, number];
  type: ITEM_TYPES;
  id: string;
  unmounted: boolean;
};
const droppedItemsAtom = atom<DroppedItemType[]>([]);
export const useDroppedItems = () => useAtom(droppedItemsAtom);

export const DASH_DURATION = 150;

export const isMusicOnAtom = atomWithStorage<boolean>("atoms:isMusicOn", false);
export const volumeAtom = atom<number>(5);
