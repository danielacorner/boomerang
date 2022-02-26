import { useEffect, useRef, useState } from "react";
import {
  useBoomerangRefs,
  useGameStateRef,
  useHeldBoomerangs,
  usePlayerPositionRef,
  usePlayerRef,
  usePlayerState,
} from "../../../store";
import { useFrame, useThree } from "@react-three/fiber";
import { useCylinder } from "@react-three/cannon";
import { isEqual } from "@react-spring/shared";
import {
  GROUP1,
  ITEM_TYPES,
  PLAYER_NAME,
  WALL_NAME,
} from "../../../utils/constants";
import * as THREE from "three";
import { usePressedKeys } from "../usePressedKeys";

const BOOMERANG_RADIUS = 2;
const BOOMERANG_PULL_FORCE = 0.1;
const BOOMERANG_FLY_MAX_DURATION = 12 * 1000;
const THROW_SPEED = 3;
const INITIAL_POSITION: [number, number, number] = [0, 1, 0];
const PLAYER_RADIUS = 1.5;
const PLAYER_THROW_VELOCITY_MULTIPLIER = 3;
const BOOMERANG_AIR_FRICTION = 0.03;
const MAX_BOOM_VY = 0.2;
const MAX_THROW_SPEED = 30;

/** shoots a boomerang when you click */
export function useMoveBoomerang({ idx }: { idx }) {
  const [playerRef] = usePlayerRef();
  const [playerPositionRef] = usePlayerPositionRef();
  const [{ poweredUp, rangeUp }, setPlayerState] = usePlayerState();

  // boomerang state & click position
  const [heldBoomerangs, setHeldBoomerangs] = useHeldBoomerangs();
  const { status, clickTargetPosition } = heldBoomerangs[idx] || {
    status: null,
    clickTargetPosition: null,
  };

  const isHeld = status === "held";
  const isBoomerangMoving = !["dropped", "held"].includes(status);

  const [width, height] = [
    BOOMERANG_RADIUS * (poweredUp ? 2.5 : 1) * (isHeld ? 0 : 1),
    2,
  ];
  const [gameStateRef] = useGameStateRef();
  const [carriedItems, setCarriedItems] = useState<ITEM_TYPES[]>([]);
  const { clock } = useThree();
  const onceRef = useRef(false);
  const [boomerangCylinderRef, api] = useCylinder(
    () => ({
      mass: poweredUp ? 4 : 1,
      args: [width, width, height, 6],
      ...(isBoomerangMoving
        ? {
            collisionFilterMask: GROUP1, // while moving, it can only collide with group 1 (enemies, walls, ground, dropped items)
          }
        : {}),
      position: position.current || playerPositionRef || INITIAL_POSITION,
      // position: playerPosition || INITIAL_POSITION,
      // TODO ? when it hits a wall, set to Dynamic
      type: isBoomerangMoving ? "Kinematic" : "Dynamic",
      // A static body does not move during simulation and behaves as if it has infinite mass. Static bodies can be moved manually by setting the position of the body. The velocity of a static body is always zero. Static bodies do not collide with other static or kinematic bodies.
      material: {
        restitution: 1,
        friction: 0,
      },
      onCollide: (e) => {
        // if it collides with the walls,
        // reflect it back
        if (e.body?.name === WALL_NAME) {
          api.velocity.set(
            -velocity.current[0],
            -velocity.current[1],
            -velocity.current[2]
          );
        }

        // pick up the boomerang when it collides with the player
        const isCollisionWithPlayer = e.body?.name === PLAYER_NAME;
        if (isCollisionWithPlayer) {
          setHeldBoomerangs((currentBoomerangs) => {
            const newBooms = currentBoomerangs.map((boom, bIdx) => {
              if (bIdx === idx) {
                return {
                  ...boom,
                  status: "held" as any,
                  clickTargetPosition: null,
                };
              }
              return boom;
            });
            if (isEqual(newBooms, currentBoomerangs)) {
              return currentBoomerangs;
            } else {
              gameStateRef.current.heldBoomerangs = newBooms;

              return newBooms;
            }
          });

          // also pick up any items on the boomerang
          if (carriedItems.length && !onceRef.current) {
            onceRef.current = true;
            // apply each item's effect
            carriedItems.forEach((item) => {
              if (item === ITEM_TYPES.MONEY) {
                gameStateRef.current = {
                  ...gameStateRef.current,
                  money: gameStateRef.current.money + 1,
                };
              } else if (item === ITEM_TYPES.RANGEUP) {
                console.log("💥 oof a RANGEUP", e);
                setPlayerState((p) => ({
                  ...p,
                  rangeUp: true,
                  rangeUpStartTime: clock.getElapsedTime(),
                }));
              } else if (item === ITEM_TYPES.POWERUP) {
                setPlayerState((p) => ({
                  ...p,
                  poweredUp: true,
                  poweredUpStartTime: clock.getElapsedTime(),
                }));
              } else if (item === ITEM_TYPES.HEART) {
                gameStateRef.current = {
                  ...gameStateRef.current,
                  hitpoints: gameStateRef.current.hitpoints + 1,
                  maxHitpoints: gameStateRef.current.maxHitpoints + 1,
                };
              }
            });
            setCarriedItems([]);
            setTimeout(() => {
              onceRef.current = false;
            });
          }
        }

        const isCollisionWithDroppedItem = [
          ITEM_TYPES.MONEY,
          ITEM_TYPES.POWERUP,
          ITEM_TYPES.RANGEUP,
        ].includes(e.body?.name as any);
        if (isCollisionWithDroppedItem) {
          setCarriedItems((p) => [...p, e.body?.name as ITEM_TYPES]);
        }
      },
    }),
    null,
    [poweredUp, width, height, isBoomerangMoving]
  );

  const [boomerangRefs] = useBoomerangRefs();
  const thisBoomerangRef = boomerangRefs.current[idx];

  // subscribe to the position
  const position = useRef(INITIAL_POSITION);
  useEffect(() => {
    const unsubscribe = api.position.subscribe((v) => {
      position.current = v;
      if (thisBoomerangRef) {
        boomerangRefs.current = [
          ...boomerangRefs.current.slice(0, idx),
          { ...thisBoomerangRef, position: v },
          ...boomerangRefs.current.slice(idx + 1),
        ];
      }
    });
    return unsubscribe;
  }, []);

  // subscribe to the velocity
  const velocity = useRef(INITIAL_POSITION);
  useEffect(() => {
    const unsubscribe = api.velocity.subscribe((v) => (velocity.current = v));
    return unsubscribe;
  }, []);

  // after a while, a returning boomerang will drop to the ground
  const DROP_TIMEOUT = 3.5 * 1000;
  const timer = useRef(null as any);
  useEffect(() => {
    const keepFlying =
      rangeUp || ["held", "dropped", "flying"].includes(status);

    if (timer.current && keepFlying) {
      clearTimeout(timer.current);
    } else if (status === "returning" && !keepFlying) {
      timer.current = setTimeout(() => {
        const mapDroppedBoomerangs = (boom, bIdx) =>
          bIdx === idx ? { ...boom, status: "dropped" } : boom;

        setHeldBoomerangs((p) => p.map(mapDroppedBoomerangs));
        gameStateRef.current.heldBoomerangs =
          gameStateRef.current.heldBoomerangs.map(mapDroppedBoomerangs);
      }, DROP_TIMEOUT);
    }
  }, [rangeUp, status]);

  // decrease the overall velocity when the boomerang is flying
  const thrownTime = useRef<any>(null);

  // throw on click
  const { up, left, down, right } = usePressedKeys();
  useEffect(() => {
    if (!playerRef?.current) {
      return;
    }

    if (clickTargetPosition && status === "flying") {
      // first, set position to player position
      if (!rangeUp) {
        api.position.set(...playerPositionRef.current);
      }

      thrownTime.current = Date.now();

      const playerVelocity = [
        left ? -1 : right ? 1 : 0,
        0,
        up ? 1 : down ? -1 : 0,
      ];

      const fromRef = rangeUp ? position : playerPositionRef;
      const throwVelocity: [number, number, number] = [
        clickTargetPosition[0] -
          fromRef.current[0] +
          playerVelocity[0] * PLAYER_THROW_VELOCITY_MULTIPLIER,
        clickTargetPosition[1] -
          fromRef.current[1] +
          playerVelocity[1] * PLAYER_THROW_VELOCITY_MULTIPLIER,
        clickTargetPosition[2] -
          fromRef.current[2] +
          playerVelocity[2] * PLAYER_THROW_VELOCITY_MULTIPLIER,
      ]
        .map((v) => v * THROW_SPEED)
        .map((v) => {
          // cap the velocity
          if (Math.abs(v) > MAX_THROW_SPEED) {
            return v > 0 ? MAX_THROW_SPEED : -MAX_THROW_SPEED;
          }
          return v;
        }) as [number, number, number];

      api.velocity.set(...throwVelocity);

      setTimeout(() => {
        const mapReturningBoomerangs = (boom, bIdx) =>
          bIdx === idx
            ? { ...boom, status: "returning", clickTargetPosition: null }
            : boom;

        setHeldBoomerangs((p) => p.map(mapReturningBoomerangs));
        gameStateRef.current.heldBoomerangs =
          gameStateRef.current.heldBoomerangs.map(mapReturningBoomerangs);
      }, 300);
    }
  }, [clickTargetPosition, status]);

  // time it takes for the boomerang to drop
  const friction =
    BOOMERANG_AIR_FRICTION * (poweredUp ? 0.5 : 1) * (rangeUp ? 0.1 : 1);
  // drop the boomerang
  useFrame(() => {
    if (!isBoomerangMoving) {
      const slowerVelocity = [
        THREE.MathUtils.lerp(velocity.current[0], 0, friction),
        THREE.MathUtils.lerp(velocity.current[1], -1, friction),
        THREE.MathUtils.lerp(velocity.current[2], 0, friction),
      ];
      api.velocity.set(slowerVelocity[0], slowerVelocity[1], slowerVelocity[2]);
    }
  });

  // pull the boomerang towards the player
  useFrame(() => {
    if (isBoomerangMoving && status === "returning") {
      const time = Date.now() - thrownTime.current;
      const maxFlyDuration =
        BOOMERANG_FLY_MAX_DURATION * (rangeUp ? 2 : 1) * (poweredUp ? 1.5 : 1);
      const slowDownPct = (1 - Math.min(time / maxFlyDuration, 1)) ** 0.5;

      // set the velocity to pull the boomerang towards the player

      const pullBoomerang: [number, number, number] = [
        playerPositionRef.current[0] - position.current[0],
        playerPositionRef.current[1] - position.current[1],
        playerPositionRef.current[2] - position.current[2],
      ];

      const pullForce =
        BOOMERANG_PULL_FORCE * (rangeUp ? 0.7 : 1) * (poweredUp ? 1.3 : 1);

      const newVelocity: [number, number, number] = [
        velocity.current[0] + pullBoomerang[0] * pullForce,
        // throttle y velocity
        Math.min(
          MAX_BOOM_VY,
          velocity.current[1] + pullBoomerang[1] * pullForce
        ),
        velocity.current[2] + pullBoomerang[2] * pullForce,
      ].map((velocity) => velocity * slowDownPct) as [number, number, number];

      api.velocity.set(...newVelocity);

      const playerRadius = PLAYER_RADIUS * (rangeUp || poweredUp ? 2 : 1);

      // if the boomerang is close to the player, set the boomerang to the player's position
      const isAtPlayer =
        Math.abs(pullBoomerang[0]) < playerRadius &&
        Math.abs(pullBoomerang[1]) < playerRadius &&
        Math.abs(pullBoomerang[2]) < playerRadius;

      // if the boomerang is close to the player, pick up the boomerang
      if (isAtPlayer && thrownTime.current > 1500) {
        console.count("💥 picked up!");
        api.position.set(...playerPositionRef.current);
        thrownTime.current = null;
        const mapHeldBoomerangs = (boom, bIdx) =>
          bIdx === idx
            ? { ...boom, status: "held", clickTargetPosition: null }
            : boom;
        setHeldBoomerangs((p) => p.map(mapHeldBoomerangs));
        gameStateRef.current.heldBoomerangs =
          gameStateRef.current.heldBoomerangs.map(mapHeldBoomerangs);
        api.velocity.set(0, 0, 0);
      }
    }
  });

  return { boomerangCylinderRef, carriedItems };
}
