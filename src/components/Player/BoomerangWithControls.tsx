import { forwardRef, useEffect, useRef } from "react";
import Boomerang from "../GLTFs/Boomerang";
import * as THREE from "three";
import { useBoomerangState } from "../../store";
import { useFrame } from "@react-three/fiber";

const ROTATION_SPEED = 0.2;
export const BoomerangWithControls = ({ position: playerPosition }) => {
  const boomerangRef = useRef<THREE.Mesh>(null);
  useBoomerang(boomerangRef, playerPosition);
  return (
    <mesh ref={boomerangRef}>
      <Boomerang />
    </mesh>
  );
};
/** shoots a boomerang when you hit space */
function useBoomerang(boomerangRef, playerPosition) {
  console.log("🌟🚨 ~ useBoomerang ~ playerPosition", playerPosition);
  const [{ targetPosition, isThrown }, setState] = useBoomerangState();
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
  useFrame(() => {
    if (!boomerangRef.current || !playerPosition.current) {
      return;
    }
    boomerangRef.current.rotation.set(
      boomerangRef.current.rotation.x,
      boomerangRef.current.rotation.y + ROTATION_SPEED,
      boomerangRef.current.rotation.z
    );

    // boomerangRef.current.lookAt(playerRef.current.position);

    const target = targetPosition || [
      playerPosition.current[0],
      playerPosition.current[1],
      playerPosition.current[2],
    ];

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
