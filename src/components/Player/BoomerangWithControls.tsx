import { forwardRef, useRef } from "react";
import Boomerang from "../GLTFs/Boomerang";
import * as THREE from "three";
import { useBoomerangState } from "../../store";
import { useFrame } from "@react-three/fiber";

const ROTATION_SPEED = 0.2;
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
    const newX = THREE.MathUtils.lerp(
      boomerangRef.current.position.x,
      target[0],
      0.1
    );
    const newY = THREE.MathUtils.lerp(
      boomerangRef.current.position.y,
      target[1],
      0.1
    );
    const newZ = THREE.MathUtils.lerp(
      boomerangRef.current.position.z,
      target[2],
      0.1
    );

    const isAtTarget =
      targetPosition &&
      Math.abs(newX - targetPosition[0]) < 0.1 &&
      Math.abs(newY - targetPosition[1]) < 0.1 &&
      Math.abs(newZ - targetPosition[2]) < 0.1;

    const isAtPlayer =
      playerPosition &&
      Math.abs(newX - playerPosition[0]) < 0.1 &&
      Math.abs(newY - playerPosition[1]) < 0.1 &&
      Math.abs(newZ - playerPosition[2]) < 0.1;
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
