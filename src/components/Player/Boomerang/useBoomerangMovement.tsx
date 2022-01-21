import { ReactNode, useEffect, useRef, useState } from "react";
import { useHeldBoomerangs, useMoney, usePlayerState } from "../../../store";
import { useFrame } from "@react-three/fiber";
import { PublicApi, useCylinder, useSphere } from "@react-three/cannon";
import { isEqual } from "@react-spring/shared";
import {
  GROUP1,
  ITEM_TYPES,
  PLAYER_NAME,
  WALL_NAME,
} from "../../../utils/constants";
import * as THREE from "three";
import { useInterval } from "react-use";
import { usePressedKeys } from "../usePressedKeys";
import MoneyBag from "../../GLTFs/MoneyBag";

const BOOMERANG_RADIUS = 2;
const BOOMERANG_PULL_FORCE = 0.1;
const BOOMERANG_FLY_MAX_DURATION = 12 * 1000;
const THROW_SPEED = 3;
const INITIAL_POSITION: [number, number, number] = [0, 1, 0];
const PLAYER_RADIUS = 1.5;
const PLAYER_THROW_VELOCITY_MULTIPLIER = 3;

/** shoots a boomerang when you click */
export function useBoomerangMovement({
  playerPositionRef,
  playerVelocityRef,
  playerCylinderApi,
  playerRef,
  idx,
}: {
  playerPositionRef: { current: [number, number, number] };
  playerVelocityRef: { current: [number, number, number] };
  playerCylinderApi: PublicApi;
  playerRef;
  idx;
}) {
  const [{ poweredUp, rangeUp }, setPlayerState] = usePlayerState();
  const [, setMoney] = useMoney();

  // subscribe to the position
  const position = useRef(INITIAL_POSITION);
  useEffect(() => {
    const unsubscribe = api.position.subscribe((v) => (position.current = v));
    return unsubscribe;
  }, []);

  // subscribe to the velocity
  const velocity = useRef(INITIAL_POSITION);
  useEffect(() => {
    const unsubscribe = api.velocity.subscribe((v) => (velocity.current = v));
    return unsubscribe;
  }, []);

  // boomerang state & click position
  const [heldBoomerangs, setHeldBoomerangs] = useHeldBoomerangs();
  const { status, clickTargetPosition } = heldBoomerangs[idx];

  const isHeld = status === "held";
  const isBoomerangMoving = !["dropped", "held"].includes(status);

  const [width, height] = [
    BOOMERANG_RADIUS * (poweredUp ? 2.5 : 1) * (isHeld ? 0 : 1),
    2,
  ];

  const [carriedItems, setCarriedItems] = useState<ITEM_TYPES[]>([]);

  const [boomerangRef, api] = useCylinder(
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
        if (e.body.name === WALL_NAME) {
          api.velocity.set(
            -velocity.current[0],
            -velocity.current[1],
            -velocity.current[2]
          );
        }

        // pick up the boomerang when it collides with the player
        const isCollisionWithPlayer = e.body.name === PLAYER_NAME;
        if (isCollisionWithPlayer) {
          console.log(
            "🌟🚨 ~ file: useBoomerangMovement.tsx ~ line 102 ~ isCollisionWithPlayer",
            isCollisionWithPlayer
          );
          setHeldBoomerangs((currentBoomerangs) => {
            return currentBoomerangs.map((boom, bIdx) => {
              if (bIdx === idx) {
                return {
                  ...boom,
                  status: "held",
                  clickTargetPosition: null,
                };
              }
              return boom;
            });
          });

          // also pick up any items on the boomerang
          if (carriedItems.length) {
            // apply each item's effect
            carriedItems.forEach((item) => {
              if (item === ITEM_TYPES.MONEY) {
                setMoney((p) => p + 1);
              } else if (item === ITEM_TYPES.RANGEUP) {
                setPlayerState((p) => ({ ...p, rangeUp: true }));
              } else if (item === ITEM_TYPES.POWERUP) {
                setPlayerState((p) => ({ ...p, poweredUp: true }));
              }
            });
            setCarriedItems([]);
          }
        }

        const isCollisionWithDroppedItem = [
          ITEM_TYPES.MONEY,
          ITEM_TYPES.POWERUP,
          ITEM_TYPES.RANGEUP,
        ].includes(e.body.name as any);
        if (isCollisionWithDroppedItem) {
          console.log(
            "🌟🚨 ~ file: useBoomerangMovement.tsx ~ line 137 ~ isCollisionWithDroppedItem",
            isCollisionWithDroppedItem
          );
          setCarriedItems((p) => [...p, e.body.name as ITEM_TYPES]);
        }
      },
    }),
    null,
    [poweredUp, width, height, isBoomerangMoving]
  );

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
        setHeldBoomerangs((p) =>
          p.map((boom, bIdx) =>
            bIdx === idx ? { ...boom, status: "dropped" } : boom
          )
        );
      }, DROP_TIMEOUT);
    }
  }, [rangeUp, status]);

  // decrease the overall velocity when the boomerang is flying
  const thrownTime = useRef<any>(null);

  // throw on click
  const { up, left, down, right } = usePressedKeys();
  useEffect(() => {
    if (!playerRef.current) {
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

      const throwVelocity: [number, number, number] = [
        clickTargetPosition[0] -
          position.current[0] +
          playerVelocity[0] * PLAYER_THROW_VELOCITY_MULTIPLIER,
        clickTargetPosition[1] -
          position.current[1] +
          playerVelocity[1] * PLAYER_THROW_VELOCITY_MULTIPLIER,
        clickTargetPosition[2] -
          position.current[2] +
          playerVelocity[2] * PLAYER_THROW_VELOCITY_MULTIPLIER,
      ].map((v) => v * THROW_SPEED) as [number, number, number];

      api.velocity.set(...throwVelocity);

      setTimeout(() => {
        setHeldBoomerangs((p) =>
          p.map((boom, bIdx) =>
            bIdx === idx
              ? { ...boom, status: "returning", clickTargetPosition: null }
              : boom
          )
        );
      }, 300);
    }
  }, [clickTargetPosition, status]);

  // drop the boomerang
  useFrame(() => {
    if (!isBoomerangMoving) {
      const slowerVelocity = [
        THREE.MathUtils.lerp(velocity.current[0], 0, 0.05),
        THREE.MathUtils.lerp(velocity.current[1], -1, 0.05),
        THREE.MathUtils.lerp(velocity.current[2], 0, 0.05),
      ];
      api.velocity.set(slowerVelocity[0], slowerVelocity[1], slowerVelocity[2]);
    }
  });

  // pull the boomerang towards the player
  useFrame(() => {
    if (isBoomerangMoving && status === "returning") {
      const time = Date.now() - thrownTime.current;
      const slowDownPct =
        (1 - Math.min(time / BOOMERANG_FLY_MAX_DURATION, 1)) ** 0.5;

      // set the velocity to pull the boomerang towards the player

      const pullBoomerang: [number, number, number] = [
        playerPositionRef.current[0] - position.current[0],
        playerPositionRef.current[1] - position.current[1],
        playerPositionRef.current[2] - position.current[2],
      ];

      const pullForce = BOOMERANG_PULL_FORCE * (rangeUp ? 0.5 : 1);

      const newVelocity: [number, number, number] = [
        velocity.current[0] + pullBoomerang[0] * pullForce,
        velocity.current[1] + pullBoomerang[1] * pullForce,
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
        api.position.set(...playerPositionRef.current);
        thrownTime.current = null;
        setHeldBoomerangs((p) =>
          p.map((boom, bIdx) =>
            bIdx === idx
              ? {
                  ...boom,
                  status: "held",
                  clickTargetPosition: null,
                }
              : boom
          )
        );
        api.velocity.set(0, 0, 0);
      }
    }
  });

  return { boomerangRef, carriedItems };
}
