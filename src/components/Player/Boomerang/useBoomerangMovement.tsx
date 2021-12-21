import { useEffect, useRef, useState } from "react";
import { useBoomerangState, usePlayerState } from "../../../store";
import { useFrame } from "@react-three/fiber";
import { useSphere } from "@react-three/cannon";

const BOOMERANG_RADIUS = 1;
const THROW_SPEED = 2;
const RETURN_SPEED = 0.08;
const INITIAL_POSITION: [number, number, number] = [0, 1, 0];

const PLAYER_RADIUS = 1.2;

const BOOMERANG_FLY_MAX_DURATION = 12 * 1000;

/** shoots a boomerang when you click */
export function useBoomerangMovement(
  playerPosition: [number, number, number],
  playerRef
) {
  const [{ lookAt, poweredUp }] = usePlayerState();

  // boomerang state & click position
  const [{ status, clickTargetPosition }, setBoomerangState] =
    useBoomerangState();

  const [boomerangRef, api] = useSphere(
    () => ({
      mass: poweredUp ? 4 : 1,
      args: [BOOMERANG_RADIUS * (poweredUp ? 4 : 1)],
      position: INITIAL_POSITION,
      type: "Kinematic",
      // A static body does not move during simulation and behaves as if it has infinite mass. Static bodies can be moved manually by setting the position of the body. The velocity of a static body is always zero. Static bodies do not collide with other static or kinematic bodies.
      material: {
        restitution: 1,
        friction: 0,
      },
    }),
    null,
    [poweredUp]
  );

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

  // throw on click
  useEffect(() => {
    if (clickTargetPosition && status === "idle") {
      const throwVelocity: [number, number, number] = [
        clickTargetPosition[0] - position.current[0],
        clickTargetPosition[1] - position.current[1],
        clickTargetPosition[2] - position.current[2],
      ].map((v) => v * THROW_SPEED) as [number, number, number];
      api.velocity.set(...throwVelocity);
      setTimeout(() => {
        setBoomerangState((p) => ({ ...p, status: "flying" }));
      }, 1000);
    }
  }, [clickTargetPosition, status]);

  // decrease the overall velocity when the boomerang is flying
  const thrownTime = useRef<any>(null);

  // pull the boomerang towards the player
  useFrame(({ viewport }) => {
    if (status !== "idle") {
      if (!thrownTime.current) {
        thrownTime.current = Date.now();
      }
      const time = Date.now() - thrownTime.current;
      const slowDownPct =
        (1 - Math.min(time / BOOMERANG_FLY_MAX_DURATION, 1)) ** 0.5;

      // set the velocity to pull the boomerang towards the player

      const pullBoomerang: [number, number, number] = [
        playerPosition[0] - position.current[0],
        playerPosition[1] - position.current[1],
        playerPosition[2] - position.current[2],
      ];

      const newVelocity: [number, number, number] = [
        velocity.current[0] + pullBoomerang[0] * RETURN_SPEED,
        velocity.current[1] + pullBoomerang[1] * RETURN_SPEED,
        velocity.current[2] + pullBoomerang[2] * RETURN_SPEED,
      ].map((velocity) => velocity * slowDownPct) as [number, number, number];

      api.velocity.set(...newVelocity);

      // if the boomerang is close to the player, set the boomerang to the player's position
      const isAtPlayer =
        Math.abs(pullBoomerang[0]) < PLAYER_RADIUS &&
        Math.abs(pullBoomerang[1]) < PLAYER_RADIUS &&
        Math.abs(pullBoomerang[2]) < PLAYER_RADIUS;
      if (isAtPlayer && thrownTime.current) {
        api.position.set(...playerPosition);
        thrownTime.current = null;
        setBoomerangState((p) => ({ ...p, status: "idle" }));
        api.velocity.set(0, 0, 0);
      }
    }
  });

  return boomerangRef;
}

function distanceBetweenTwoPoints(
  point1: [number, number, number],
  point2: [number, number, number]
) {
  const [x1, y1, z1] = point1;
  const [x2, y2, z2] = point2;
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2);
}
