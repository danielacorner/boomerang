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
import { COLORS, ITEM_TYPES } from "../../utils/constants";

// /** tiles where the player starts */
const START_PAD = [
	// middle 4
	{ row: 15, col: 7, overrideColor: COLORS.TEMPLE },
	{ row: 15, col: 8, overrideColor: COLORS.TEMPLE },
	{ row: 16, col: 7, overrideColor: COLORS.TEMPLE },
	{ row: 16, col: 8, overrideColor: COLORS.TEMPLE },
	// top 3
	{ row: 17, col: 8, overrideColor: COLORS.TEMPLE },
	{ row: 17, col: 7, overrideColor: COLORS.TEMPLE },
	{ row: 18, col: 8, overrideColor: COLORS.TEMPLE },
	// bottom 3
	{ row: 14, col: 8, overrideColor: COLORS.TEMPLE },
	{ row: 14, col: 7, overrideColor: COLORS.TEMPLE },
	{ row: 13, col: 7, overrideColor: COLORS.TEMPLE },
	// right 3
	{ row: 15, col: 6, overrideColor: COLORS.TEMPLE },
	{ row: 16, col: 6, overrideColor: COLORS.TEMPLE },
	{ row: 16, col: 5, overrideColor: COLORS.TEMPLE },
	// left 3
	{ row: 15, col: 9, overrideColor: COLORS.TEMPLE },
	{ row: 16, col: 9, overrideColor: COLORS.TEMPLE },
	{ row: 15, col: 10, overrideColor: COLORS.TEMPLE },
];

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
		/** customize tiles in each level... */
		overrideTiles?: {
			row: number;
			col: number;
			overrideColor: string;
		}[];
	};
}[] = [
	{
		enemies: [],
		droppedItems: [{ position: [0, 8, 8], type: ITEM_TYPES.BOOMERANG }],
		terrain: {
			width: 16,
			height: 32,
			overrideTiles: [
				// top 4
				{ row: 15, col: 7, overrideColor: COLORS.TEMPLE },
				{ row: 15, col: 8, overrideColor: COLORS.TEMPLE },
				{ row: 16, col: 7, overrideColor: COLORS.TEMPLE },
				{ row: 16, col: 8, overrideColor: COLORS.TEMPLE },
				// middle 4
				{ row: 17, col: 7, overrideColor: COLORS.TEMPLE },
				{ row: 17, col: 8, overrideColor: COLORS.TEMPLE },
				{ row: 18, col: 7, overrideColor: COLORS.TEMPLE },
				{ row: 18, col: 8, overrideColor: COLORS.TEMPLE },
			],
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
			overrideTiles: [...START_PAD],
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
			overrideTiles: [...START_PAD],
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
			overrideTiles: [...START_PAD],
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
			overrideTiles: [...START_PAD],
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
			overrideTiles: [...START_PAD],
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
			overrideTiles: [...START_PAD],
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
			overrideTiles: [...START_PAD],
		},
	},
];
type IDType = number | null | undefined;
