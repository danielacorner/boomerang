import { Player } from "./Player/Player";
import { Ground } from "./Ground";
import { Enemies } from "./Enemies/Enemies";
import { Collisions } from "./Player/Collisions";
import { Lighting } from "./Lighting";
import { OrbitControls, Sky } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { atom, useAtom } from "jotai";
import { useRef } from "react";

export function Scene() {
  const { x, y, z } = { x: -0.02, y: 0.01, z: 0 };
  const { rayleigh } = { rayleigh: 0.7 };
  return (
    <mesh>
      <Ground />
      <Lighting />
      <Player />
      <Enemies />
      <Sky sunPosition={[x, y, z]} rayleigh={rayleigh} />
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
