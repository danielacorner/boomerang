import { COLORS } from "../../utils/constants";

// probabilities of going to the next color
export const TILE_PROBABILITY_MACHINE = {
  // this tile has x probability of turning into tile y
  [COLORS.DIRT]: [
    // [x, y]
    // e.g. dirt has 0.7 chance of turning into dirt
    [0.7, COLORS.DIRT],
    [0.1, COLORS.GRASS],
    [0.05, COLORS.WATER],
    [0.05, COLORS.SAND],
  ],
  [COLORS.GRASS]: [
    [0.7, COLORS.GRASS],
    [0.2, COLORS.DIRT],
    [0.1, COLORS.PLANT],
  ],
  [COLORS.WATER]: [
    [0.8, COLORS.WATER],
    [0.2, COLORS.GRASS],
  ],
  [COLORS.PLANT]: [
    [0.6, COLORS.PLANT],
    [0.4, COLORS.GRASS],
  ],
  [COLORS.SAND]: [
    [0.7, COLORS.SAND],
    [0.3, COLORS.DIRT],
  ],
  [COLORS.TEMPLE]: [
    [0.5, COLORS.GRASS],
    [0.5, COLORS.DIRT],
  ],
};
