import { forwardRef, useEffect, useRef } from "react";
import Boomerang from "../GLTFs/Boomerang";
import * as THREE from "three";
import { useBoomerangState } from "../../store";
import { useFrame } from "@react-three/fiber";
import { FlashWhenStatusChanges } from "./FlashWhenStatusChanges";
import { useSphere } from "@react-three/cannon";
import { useMount } from "react-use";

const BOOMERANG_SPEED = 0.05;
const PLAYER_RADIUS = 3;
const ROTATION_SPEED = -0.2;

export const BoomerangWithControls = forwardRef(
  (
    { playerPosition }: { playerPosition: number[] },
    playerRef: React.ForwardedRef<THREE.Mesh>
  ) => {
    const ref = useBoomerang(playerPosition, playerRef);

    return (
      <mesh ref={ref}>
        <Spin>
          <Boomerang />
        </Spin>
        <FlashWhenStatusChanges />
      </mesh>
    );
  }
);

function Spin({ children }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.set(0, ref.current.rotation.y + ROTATION_SPEED, 0);
  });

  return <mesh ref={ref}>{children}</mesh>;
}

const INITIAL_POSITION: [number, number, number] = [0, 1, 0];

/** shoots a boomerang when you click */
function useBoomerang(playerPosition, playerRef) {
  const [boomerangRef, api] = useSphere(() => ({
    position: INITIAL_POSITION,
    type: "Static", // https://github.com/pmndrs/use-cannon#types
    // A static body does not move during simulation and behaves as if it has infinite mass. Static bodies can be moved manually by setting the position of the body. The velocity of a static body is always zero. Static bodies do not collide with other static or kinematic bodies.
  }));

  // boomerang state & click position
  const [{ status, clickTargetPosition }, setBoomerangState] =
    useBoomerangState();

  // subscribe to the position
  const position = useRef(INITIAL_POSITION);
  useEffect(() => {
    const unsubscribe = api.position.subscribe((v) => (position.current = v));
    return unsubscribe;
  }, []);

  // move the boomerang
  useFrame(() => {
    if (!api || !playerPosition || !boomerangRef.current) {
      console.log("🚨🚨 ~ no ref", playerPosition, api, boomerangRef);
      return;
    }

    // target = the click position if it's outgoing, or the player if it's incoming

    const target =
      status === "flying"
        ? clickTargetPosition
        : playerPosition || [
            playerRef.current?.position.x,
            playerRef.current?.position.y,
            playerRef.current?.position.z,
          ];

    if (!target) {
      console.log("🚨🚨 ~ no target!", target);
      return;
    }

    const [x, y, z] = position.current;
    const [x2, y2, z2] = target;
    const [dx, dy, dz] = [x2 - x, y2 - y, z2 - z];
    let newX = 0;
    let newY = 0;
    let newZ = 0;
    if (status === "flying") {
      newX = THREE.MathUtils.lerp(x, x2, BOOMERANG_SPEED);
      newY = THREE.MathUtils.lerp(y, y2, BOOMERANG_SPEED);
      newZ = THREE.MathUtils.lerp(z, z2, BOOMERANG_SPEED);
    } else {
      newX = THREE.MathUtils.lerp(
        // invert the returning speed: speed up over time (instead of slowing down)
        x,
        x2 - Math.abs(dx) * 0.1,
        BOOMERANG_SPEED
      );
      newY = THREE.MathUtils.lerp(y, y2 - dy * 0.1, BOOMERANG_SPEED);
      newZ = THREE.MathUtils.lerp(z, z2 - dz * 0.1, BOOMERANG_SPEED);
    }

    const isAtTarget =
      clickTargetPosition &&
      Math.abs(newX - clickTargetPosition[0]) < 0.1 &&
      Math.abs(newY - clickTargetPosition[1]) < 0.1 &&
      Math.abs(newZ - clickTargetPosition[2]) < 0.1;

    const isAtPlayer =
      playerPosition &&
      Math.abs(newX - playerPosition[0]) < PLAYER_RADIUS &&
      Math.abs(newY - playerPosition[1]) < PLAYER_RADIUS &&
      Math.abs(newZ - playerPosition[2]) < PLAYER_RADIUS;

    if (isAtTarget && status === "flying") {
      setBoomerangState((p) => ({ ...p, status: "returning" }));
    } else if (isAtPlayer && status === "returning") {
      setBoomerangState((p) => ({
        ...p,
        status: "idle",
      }));
    } else {
      api.position.set(newX, newY, newZ);
    }
  });

  return boomerangRef;
}
