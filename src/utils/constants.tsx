export const WALL_NAME = "wall";
export const POWERUP_NAME = "powerup";
export const GROUND_NAME = "groundPlane";
export const BOOMERANG_NAME = "boomerang";
export const PLAYER_NAME = "player";
export const BOOMERANG_ITEM_NAME = "boomerang_item";
export const ENEMY_NAME = "enemy";
export const RANGEUP_NAME = "rangeup";
// https://github.com/schteppe/cannon.js/blob/master/demos/collisionFilter.html#L33
// Collision filter groups - must be powers of 2!

/** enemies, walls, ground, dropped items */
export const GROUP1 = 1;

export const GROUP2 = 2;
export const GROUP3 = 4;

export const MAX_THROW_DISTANCE = 13;
export const HELD_ITEMS = {
  MONEYBAG: "moneybag",
};

export enum ITEM_TYPES {
  POWERUP = "powerup",
  RANGEUP = "rangeup",
  MONEY = "money",
  BOOMERANG = "boomerang",
  HEART = "heart",
}
export const ENEMY_CYLINDER_HEIGHT = 4;

export const CAMERA_DISTANCE = 26;
export const CAMERA_POSITIONS = {
  CLOSEUP_ANIMATION: [0, CAMERA_DISTANCE * 0.4, -CAMERA_DISTANCE * 0.4],
  CLOSEUP: [0, CAMERA_DISTANCE, -CAMERA_DISTANCE / 2],
  /** display GAMEPLAY distance most of the time */
  GAMEPLAY: [0, CAMERA_DISTANCE * 1.2, -CAMERA_DISTANCE * 0.6],
  RANGEUP: [0, CAMERA_DISTANCE * 1.5, -CAMERA_DISTANCE],
} as { [key: string]: [number, number, number] };

export const getAnimationDuration = () => {
  const isFirstVisit = window.localStorage.getItem("firstVisit") === null;
  return (
    (isFirstVisit ? 5 : process.env.NODE_ENV === "development" ? 1.5 : 2.5) *
    1000
  );
};
export const ANIMATE_HEIGHT = 7.5;

export const COLORS = {
  GRASS: "#c0eca6",
  DIRT: "#e0d3ba",
  SAND: "#bdac4e",
  WATER: "#024c77",
  PLANT: "#3da74b",
  TEMPLE: "#bd9cbd",
};
export const PLAYER_CYLINDER_HEIGHT = 3;
