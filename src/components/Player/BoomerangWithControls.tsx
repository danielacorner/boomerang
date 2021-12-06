import { forwardRef, useEffect, useRef } from "react";
import Boomerang from "../GLTFs/Boomerang";
import * as THREE from "three";
import { useBoomerangState } from "../../store";
import { useFrame } from "@react-three/fiber";

export const BoomerangWithControls = forwardRef((props, playerRef) => {
  const boomerangRef = useRef<THREE.Mesh>(null);
  useBoomerang(boomerangRef, playerRef);
  return (
    <mesh ref={boomerangRef} {...props}>
      <Boomerang />
    </mesh>
  );
});
/** shoots a boomerang when you hit space */
function useBoomerang(boomerangRef, playerRef) {
  console.log("🌟🚨 ~ useBoomerang ~ boomerangRef", boomerangRef);
  console.log("🌟🚨 ~ useBoomerang ~ playerRef", playerRef);
  const [{ targetPosition }, setState] = useBoomerangState();
  console.log("🌟🚨 ~ useBoomerang ~ targetPosition", targetPosition);
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
    if (boomerangRef.current) {
      // boomerangRef.current.lookAt(playerRef.current.position);

      const target = targetPosition || [
        playerRef.current.position.x,
        0,
        playerRef.current.position.z,
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
      console.log("🌟🚨 ~ useFrame ~ newX", newX);
      console.log("🌟🚨 ~ useFrame ~ targetPosition[0]", targetPosition?.[0]);
      console.log("🌟🚨 ~ useFrame ~ targetPosition", targetPosition);
      if (isAtTarget) {
        console.log("🌟🚨 ~ useFrame ~ isAtTarget", isAtTarget);
        setState((p) => ({ ...p, targetPosition: null }));
      } else {
        boomerangRef.current.position.set(newX, newY, newZ);
      }
    }
  });
}
