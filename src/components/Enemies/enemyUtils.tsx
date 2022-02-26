import { distanceBetweenPoints } from "../../utils/utils";

const ENEMY_ATTACK_RANGE = 15;
export function getIsPlayerWithinRange(
  enemyPosition,
  playerPosition,
  mult = 1
) {
  const distance = distanceBetweenPoints(enemyPosition, playerPosition);
  return distance * mult < ENEMY_ATTACK_RANGE;
}
