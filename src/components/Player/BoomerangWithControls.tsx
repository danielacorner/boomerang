import { forwardRef, useEffect, useRef } from "react";
import Boomerang from "../GLTFs/Boomerang";
import * as THREE from "three";
import { useTargetPosition } from "../../store";
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
  const [targetPosition, setTargetPosition] = useTargetPosition();
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
      boomerangRef.current.lookAt(playerRef.current.position);

      const newX = THREE.MathUtils.lerp(
        boomerangRef.current.position.x,
        targetPosition[0],
        0.1
      );
      const newY = THREE.MathUtils.lerp(
        boomerangRef.current.position.y,
        targetPosition[1],
        0.1
      );
      const newZ = THREE.MathUtils.lerp(
        boomerangRef.current.position.z,
        targetPosition[2],
        0.1
      );
      boomerangRef.current.position.set(newX, newY, newZ);
    }
  });
}
