import { forwardRef, useRef } from "react";
import Boomerang from "../GLTFs/Boomerang";
import * as THREE from "three";
import { useBoomerangState } from "../../store";
import { useFrame } from "@react-three/fiber";
import { FlashWhenStatusChanges } from "./FlashWhenStatusChanges";

const ROTATION_SPEED = 0.2;
const BOOMERANG_SPEED = 0.05;
const PLAYER_RADIUS = 3;
export const BoomerangWithControls = forwardRef(
  (
    { playerPosition }: { playerPosition: number[] },
    playerRef: React.ForwardedRef<THREE.Mesh>
  ) => {
    const boomerangRef = useRef<THREE.Mesh>(null);
    useBoomerang(boomerangRef, playerPosition, playerRef);
    return (
      <mesh ref={boomerangRef}>
        <Boomerang />
        <FlashWhenStatusChanges />
      </mesh>
    );
  }
);
/** shoots a boomerang when you hit space */
function useBoomerang(boomerangRef, playerPosition, playerRef) {
  const [{ status, clickTargetPosition }, setBoomerangState] =
    useBoomerangState();

  useFrame(({ mouse, viewport }) => {
    if (!boomerangRef.current || !playerPosition) {
      console.log(
        "🚨🚨 ~ no playerPosition! or ref",
        playerPosition,
        boomerangRef.current
      );
      return;
    }
    // spin the boomerang
    boomerangRef.current.rotation.set(
      boomerangRef.current.rotation.x,
      boomerangRef.current.rotation.y + ROTATION_SPEED,
      boomerangRef.current.rotation.z
    );

    // target: the target if it's outgoing, or the player if it's incoming

    // const { x, y, z } = getMousePosition(mouse, viewport);
    const targetPosition = clickTargetPosition;
    const target =
      status === "flying"
        ? targetPosition
        : playerPosition || [
            playerRef.current?.position.x,
            playerRef.current?.position.y,
            playerRef.current?.position.z,
          ];
    if (!target) {
      console.log("🚨🚨 ~ no target!", target);
      return;
    }

    const [x, y, z] = boomerangRef.current.position;
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
      targetPosition &&
      Math.abs(newX - targetPosition[0]) < 0.1 &&
      Math.abs(newY - targetPosition[1]) < 0.1 &&
      Math.abs(newZ - targetPosition[2]) < 0.1;

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
      boomerangRef.current.position?.set(newX, newY, newZ);
    }
  });
}
