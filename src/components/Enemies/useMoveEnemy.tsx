import { useFrame } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { useCylinder } from "@react-three/cannon";
import {
  useHeldBoomerangs,
  usePlayerState,
  useDroppedItems,
  usePlayerRef,
} from "../../store";
import {
  BOOMERANG_NAME,
  ENEMY_CYLINDER_HEIGHT,
  GROUP1,
  ITEM_TYPES,
} from "../../utils/constants";
import * as THREE from "three";
import { useInterval } from "react-use";
import { Vector3 } from "three";
const POWERUP_PROBABILITY = 0.1;
const RANGEUP_PROBABILITY = 0.08;
const DROPPED_BOOMERANG_PROBABILITY = 0.03;
const MAX_BOOMERANGS = 6;

const ENEMY_JITTER_SPEED = 2;
const BOOMERANG_BASE_DAMAGE = 0.75;
const UNMOUNT_DELAY = 5 * 1000;
type MovementType = "randomWalk" | "preAttack" | "attack";
const MOVEMENT_SEQUENCE: MovementType[] = ["randomWalk", "preAttack", "attack"];

const RANDOM_WALK_DURATION = 3500;
const PRE_ATTACK_DURATION = 1000;
const ATTACK_DURATION = 500;

export function useMoveEnemy({
  position,
  theyreDead,
  setTheyreDead,
  health,
  setHealth,
  unmountEnemy,
  invulnerable,
}) {
  const [heldBoomerangs] = useHeldBoomerangs();
  const [{ status }] = heldBoomerangs;
  const [{ poweredUp }] = usePlayerState();
  const [theyDroppedItems, setTheyDroppedItems] = useState(false);
  const [, setDroppedItems] = useDroppedItems();
  const [playerRef] = usePlayerRef();
  const [theyDied, setTheyDied] = useState(false);

  const [enemyRef, api] = useCylinder(
    () => ({
      collisionFilterGroup: GROUP1,
      args: [3, 1, ENEMY_CYLINDER_HEIGHT, 6],
      mass: 1,
      position: position.current,
      onCollide: (e) => {
        if (
          // ignore if first boomerang is held
          status === "held" ||
          theyDroppedItems ||
          invulnerable
        ) {
          return;
        }
        // when the boomerang+enemy collide, subtract some hp
        const isCollisionWithBoomerang = e.body?.name.includes(BOOMERANG_NAME);
        // const isCollisionWithGround = e.body?.name === GROUND_NAME;
        // subtract some hp when they hit the boomerang
        if (isCollisionWithBoomerang) {
          const nextHealth = Math.max(
            0,
            health -
              BOOMERANG_BASE_DAMAGE *
                (1 + Math.random() * 0.5) *
                (poweredUp ? 2 : 1)
          );
          setHealth(nextHealth);
          const didTheyDied = nextHealth === 0;
          if (didTheyDied) {
            setTheyDied(true);
          }
          const shouldDropItems = didTheyDied;

          if (shouldDropItems) {
            setTheyDroppedItems(true);
            const mPosition: [number, number, number] = [
              position.current[0] + Math.random() - 0.5,
              position.current[1] + Math.random() - 0.5,
              position.current[2] + Math.random() - 0.5,
            ];
            const newMoney = {
              position: mPosition,
              type: ITEM_TYPES.MONEY,
            };
            setDroppedItems((p) => [...p, newMoney]);

            const powerup = Math.random() > 1 - POWERUP_PROBABILITY;
            if (powerup) {
              const pPosition: [number, number, number] = [
                position.current[0] + Math.random() - 0.5,
                position.current[1] + Math.random() - 0.5,
                position.current[2] + Math.random() - 0.5,
              ];
              const newPowerup = {
                position: pPosition,
                type: ITEM_TYPES.POWERUP,
              };
              setDroppedItems((p) => [...p, newPowerup]);
            }

            const rangeUp = Math.random() > 1 - RANGEUP_PROBABILITY;
            if (rangeUp) {
              const rPosition: [number, number, number] = [
                position.current[0] + Math.random() - 0.5,
                position.current[1] + Math.random() - 0.5,
                position.current[2] + Math.random() - 0.5,
              ];
              const newPowerup = {
                position: rPosition,
                type: ITEM_TYPES.RANGEUP,
              };
              setDroppedItems((p) => [...p, newPowerup]);
            }

            const droppedBoomerang =
              heldBoomerangs.length < MAX_BOOMERANGS &&
              Math.random() > 1 - DROPPED_BOOMERANG_PROBABILITY;
            console.log(
              "🌟🚨 ~ file: Enemy.tsx ~ line 179 ~ heldBoomerangs",
              heldBoomerangs
            );
            if (droppedBoomerang) {
              const rPosition: [number, number, number] = [
                position.current[0] + Math.random() - 0.5,
                position.current[1] + Math.random() - 0.5,
                position.current[2] + Math.random() - 0.5,
              ];
              const newBoomerang = {
                position: rPosition,
                type: ITEM_TYPES.BOOMERANG,
              };
              setDroppedItems((p) => [...p, newBoomerang]);
            }
          }
        }
      },
      material: {
        restitution: theyreDead ? 1 : 0,
        friction: theyreDead ? 0 : 100,
      },
    }),
    null,
    [status, heldBoomerangs, theyDroppedItems, poweredUp, health]
  );

  const [movementStatus, setMovementStatus] = useState<MovementType>(
    MOVEMENT_SEQUENCE[0]
  );

  // set the enemy's movement status at specified time intervals
  useInterval(
    () => {
      if (theyreDead) {
        return;
      }
      const nextMovementStatus =
        MOVEMENT_SEQUENCE[
          (MOVEMENT_SEQUENCE.indexOf(movementStatus) + 1) %
            MOVEMENT_SEQUENCE.length
        ];
      setMovementStatus(nextMovementStatus);
    },
    movementStatus === "randomWalk"
      ? RANDOM_WALK_DURATION
      : movementStatus === "preAttack"
      ? PRE_ATTACK_DURATION
      : movementStatus === "attack"
      ? ATTACK_DURATION
      : null
  );
  const [attacked, setAttacked] = useState(false);
  // movement: move towards player
  useFrame(() => {
    if (
      !position.current ||
      !enemyRef.current ||
      !playerRef.current ||
      theyreDead
    ) {
      return;
    }

    const [x, y, z] = [
      position.current[0],
      ENEMY_CYLINDER_HEIGHT / 2 + 1,
      position.current[2],
    ];
    if (movementStatus === "randomWalk") {
      if (attacked) {
        setAttacked(false);
      }
      // random walk
      const randomX = Math.random() * 2;
      const randomZ = Math.random() * 2;

      const directionX = Math.random() > 0.5 ? 1 : -1;
      const directionZ = Math.random() > 0.5 ? 1 : -1;

      const [fx, fy, fz] = [
        Math.random() > 0.5 ? ENEMY_JITTER_SPEED * randomX * directionX : 0,
        0.1,
        Math.random() > 0.5 ? ENEMY_JITTER_SPEED * randomZ * directionZ : 0,
      ];

      const x2Lerp = THREE.MathUtils.lerp(x, fx, 0.011);
      const y2Lerp = THREE.MathUtils.lerp(y, fy, 0.011);
      const z2Lerp = THREE.MathUtils.lerp(z, fz, 0.011);

      // api.applyForce([fx, fy, fz], [x, y, z]);
      api.position.set(x2Lerp, y2Lerp, z2Lerp);
      api.rotation.set(0, 0, 0);
      api.velocity.set(0, 0, 0);
    } else if (movementStatus === "preAttack") {
      enemyRef.current.scale.set(1.3, 1.3, 1.3);
      api.rotation.set(0, 0, 0);
      api.position.set(x, y, z);
      api.velocity.set(0, 0, 0);
    } else if (movementStatus === "attack") {
      if (!attacked) {
        enemyRef.current.scale.set(1, 1, 1);
        const newVelocity = playerRef.current.position
          .clone()
          .sub(
            new Vector3(
              position.current[0],
              position.current[1],
              position.current[2]
            )
          );
        console.log(
          "🌟🚨 ~ file: useMoveEnemy.tsx ~ line 230 ~ useFrame ~ newVelocity",
          newVelocity
        );
        api.velocity.set(
          newVelocity.x * 3,
          newVelocity.y * 3,
          newVelocity.z * 3
        );
        setAttacked(true);
      }
      api.rotation.set(0, 0, 0);
      // api.position.set(x, y, z);
    }
  });

  // when they die, apply a force to the enemy to make it fall
  useEffect(() => {
    if (theyDied && !theyreDead) {
      const worldPoint: [number, number, number] = [
        position.current[0],
        position.current[1] - ENEMY_CYLINDER_HEIGHT / 2,
        position.current[2],
      ];
      const kickIntoSpace: [number, number, number] = [0, -10, 0];
      api.applyImpulse(kickIntoSpace, worldPoint);
      setTheyreDead(true);
      setTimeout(() => {
        unmountEnemy();
      }, UNMOUNT_DELAY);
    }
  }, [theyDied]);

  return { enemyRef, api, movementStatus };
}
