import { Player } from "./Player/Player";
import { Ground } from "./Ground";
import { Enemies } from "./Enemies/Enemies";
import { Collisions } from "./Player/Collisions";
import { Lighting } from "./Lighting";
import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { atom, useAtom } from "jotai";
import { useRef } from "react";

export function Scene() {
  return (
    <mesh>
      <Ground />
      <Lighting />
      <Player />
      <Enemies />
      {/* <Collisions /> */}
      <OrbitControlsWithAngle />
    </mesh>
  );
}
export type Direction = "ArrowUp" | "ArrowLeft" | "ArrowRight" | "ArrowDown";

const orbitControlsAngleAtom = atom<number>(0);
/** goes from -Math.PI to Math.PI */
export const useOrbitControlsAngle = () => useAtom(orbitControlsAngleAtom);

function OrbitControlsWithAngle() {
  const [orbitControlsAngle, setOrbitControlsAngle] = useOrbitControlsAngle();
  const ref = useRef<any>(null);
  useFrame(() => {
    if (!ref.current) return;
    const newAngle = ref.current.getAzimuthalAngle();
    console.log(
      "🌟🚨 ~ file: Scene.tsx ~ line 34 ~ useFrame ~  ref.current",
      ref.current
    );
    if (orbitControlsAngle !== newAngle) {
      setOrbitControlsAngle(newAngle);
    }
  });
  return <OrbitControls ref={ref} />;
}
