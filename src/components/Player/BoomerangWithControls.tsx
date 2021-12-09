import { forwardRef, useEffect, useRef } from "react";
import Boomerang from "../GLTFs/Boomerang";
import * as THREE from "three";
import { useBoomerangState } from "../../store";
import { useFrame } from "@react-three/fiber";
import { getMousePosition } from "./Player";

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
  const [{ targetPosition: boomerangTargetPosition, isThrown }, setState] =
    useBoomerangState();
  // useKey(" ", () => {
  // });
  // const {mouse}=useThree()
  //   useEffect(() => {
  //     const onClick = (e: MouseEvent) => {
  //       setTargetPosition([mouse.x, mouse.y, 0]);
  //     };
  //     window.addEventListener("click", onClick);
  //     return () => {
  //       window.removeEventListener("click", onClick);
  //     };
  //   }, []);
  useFrame(({ mouse, viewport }) => {
    if (!boomerangRef.current || !playerPosition) {
      return;
    }
    // spin the boomerang
    boomerangRef.current.rotation.set(
      boomerangRef.current.rotation.x,
      boomerangRef.current.rotation.y + ROTATION_SPEED,
      boomerangRef.current.rotation.z
    );

    // target: the target if it's outgoing, or the player if it's incoming
    const target =
      isThrown && boomerangTargetPosition
        ? boomerangTargetPosition
        : playerPosition || [
            playerRef.current?.position.x,
            playerRef.current?.position.y,
            playerRef.current?.position.z,
          ];
    if (!target) {
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
      boomerangTargetPosition &&
      Math.abs(newX - boomerangTargetPosition[0]) < 0.1 &&
      Math.abs(newY - boomerangTargetPosition[1]) < 0.1 &&
      Math.abs(newZ - boomerangTargetPosition[2]) < 0.1;

    const isAtPlayer =
      playerPosition.current &&
      Math.abs(newX - playerPosition.current[0]) < 0.1 &&
      Math.abs(newY - playerPosition.current[1]) < 0.1 &&
      Math.abs(newZ - playerPosition.current[2]) < 0.1;
    if (isAtTarget && isThrown) {
      setState((p) => ({ ...p, targetPosition: null }));
    } else if (isAtPlayer && isThrown) {
      setState((p) => ({ ...p, isThrown: false }));
    } else {
      boomerangRef.current.position?.set(newX, newY, newZ);
    }
  });
}
