import { DroppedItemType } from "../../store";
import {
  BACTERIOPHAGE_PHI29_PROHEAD,
  BACTERIOPHAGE_P68_120,
  HERPES,
  HIV,
  ADENOVIRUS_160_OUTER,
  HPV_100,
  JEFF_BEZOS,
} from "./VIRUSES";
import { ITEM_TYPES } from "../../utils/constants";

export const LEVELS: {
  enemies: ((id?: IDType) => {
    enemyName: string;
    maxHp: number;
    enemyHeight: number;
    enemyUrl: string;
    RandomVirus: (p: any) => JSX.Element;
  })[];
  droppedItems?: Omit<DroppedItemType, "unmounted" | "id">[];
  terrain: {
    /** width and height in tiles */
    width: number;
    height: number;
  };
}[] = [
  {
    enemies: [],
    droppedItems: [{ position: [0, 8, 8], type: ITEM_TYPES.BOOMERANG }],
    terrain: {
      width: 16,
      height: 32,
    },
  },
  {
    enemies: [
      () => BACTERIOPHAGE_PHI29_PROHEAD(),
      () => BACTERIOPHAGE_PHI29_PROHEAD(),
      () => BACTERIOPHAGE_PHI29_PROHEAD(),
      () => BACTERIOPHAGE_PHI29_PROHEAD(),
    ],
    droppedItems: [
      { position: [8, 1, 8], type: ITEM_TYPES.POWERUP },
      { position: [-8, 1, -8], type: ITEM_TYPES.RANGEUP },
    ],
    terrain: {
      width: 16,
      height: 32,
    },
  },
  {
    enemies: [
      () => BACTERIOPHAGE_PHI29_PROHEAD(),
      () => BACTERIOPHAGE_PHI29_PROHEAD(),
      () => HIV(),
      () => HIV(),
    ],
    droppedItems: [
      { position: [-8, 1, 8], type: ITEM_TYPES.POWERUP },
      { position: [8, 1, -8], type: ITEM_TYPES.RANGEUP },
    ],
    terrain: {
      width: 16,
      height: 32,
    },
  },
  {
    enemies: [
      () => BACTERIOPHAGE_PHI29_PROHEAD(),
      () => HIV(),
      () => HPV_100(),
      (id: IDType) => HERPES({ shield: true, id }),
    ],
    droppedItems: [
      { position: [8, 1, 8], type: ITEM_TYPES.POWERUP },
      { position: [8, 1, -8], type: ITEM_TYPES.RANGEUP },
      { position: [8, 8, 4], type: ITEM_TYPES.BOOMERANG },
    ],
    terrain: {
      width: 16,
      height: 32,
    },
  },
  {
    enemies: [
      (id: IDType) => BACTERIOPHAGE_P68_120({ shield: false, id }),
      (id: IDType) => BACTERIOPHAGE_P68_120({ shield: true, id }),
      (id: IDType) => HERPES({ shield: true, id }),
      (id: IDType) => HERPES({ shield: true, id }),
      () => HPV_100(),
      () => HPV_100(),
    ],
    droppedItems: [
      { position: [8, 1, -8], type: ITEM_TYPES.POWERUP },
      { position: [8, 1, -8], type: ITEM_TYPES.RANGEUP },
    ],
    terrain: {
      width: 16,
      height: 32,
    },
  },
  {
    enemies: [
      (id: IDType) => BACTERIOPHAGE_P68_120({ shield: false, id }),
      (id: IDType) => BACTERIOPHAGE_P68_120({ shield: true, id }),
      (id: IDType) => ADENOVIRUS_160_OUTER({ shield: true, id }),
      (id: IDType) => ADENOVIRUS_160_OUTER({ shield: true, id }),
      () => JEFF_BEZOS(),
    ],
    droppedItems: [
      { position: [8, 1, 8], type: ITEM_TYPES.POWERUP },
      { position: [8, 1, -8], type: ITEM_TYPES.RANGEUP },
    ],
    terrain: {
      width: 16,
      height: 32,
    },
  },
  {
    enemies: [
      (id: IDType) => BACTERIOPHAGE_P68_120({ shield: false, id }),
      (id: IDType) => BACTERIOPHAGE_P68_120({ shield: true, id }),
      (id: IDType) => BACTERIOPHAGE_P68_120({ shield: true, id }),
      (id: IDType) => BACTERIOPHAGE_P68_120({ shield: true, id }),
      (id: IDType) => ADENOVIRUS_160_OUTER({ shield: true, id }),
      (id: IDType) => ADENOVIRUS_160_OUTER({ shield: true, id }),
      () => HPV_100(),
      () => HPV_100(),
      () => HPV_100(),
      () => HPV_100(),
    ],
    droppedItems: [
      { position: [8, 1, -8], type: ITEM_TYPES.POWERUP },
      { position: [8, 1, 8], type: ITEM_TYPES.RANGEUP },
    ],
    terrain: {
      width: 16,
      height: 32,
    },
  },
  {
    enemies: [
      (id: IDType) => ADENOVIRUS_160_OUTER({ shield: true, id }),
      (id: IDType) => ADENOVIRUS_160_OUTER({ shield: true, id }),
      (id: IDType) => ADENOVIRUS_160_OUTER({ shield: true, id }),
      (id: IDType) => ADENOVIRUS_160_OUTER({ shield: true, id }),
      () => HPV_100(),
      () => HPV_100(),
      () => HPV_100(),
      () => HPV_100(),
    ],
    terrain: {
      width: 16,
      height: 32,
    },
  },
];
type IDType = number | null | undefined;
