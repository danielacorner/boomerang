import { distanceBetweenPoints } from "../../utils/utils";

const ENEMY_ATTACK_RANGE = 15;
export function getIsPlayerWithinRange(enemyPosition, playerPosition) {
  const distance = distanceBetweenPoints(enemyPosition, playerPosition);
  return distance < ENEMY_ATTACK_RANGE;
}
