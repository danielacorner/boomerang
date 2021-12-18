import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { atom, useAtom } from "jotai";
import { useRef } from "react";
import { useIsDev } from "../store";

const orbitControlsAngleAtom = atom<number>(0);
/** goes from -Math.PI to Math.PI */
export const useOrbitControlsAngle = () => useAtom(orbitControlsAngleAtom);

export function OrbitControlsWithAngle() {
  const [ISDEV] = useIsDev();

  const [orbitControlsAngle, setOrbitControlsAngle] = useOrbitControlsAngle();
  const ref = useRef<any>(null);
  useFrame(() => {
    if (!ref.current || !ISDEV) return;
    const newAngle = ref.current.getAzimuthalAngle();
    console.log(
      "🌟🚨 ~ file: Scene.tsx ~ line 34 ~ useFrame ~  ref.current",
      ref.current
    );
    if (orbitControlsAngle !== newAngle) {
      setOrbitControlsAngle(newAngle);
    }
  });
  return ISDEV ? <OrbitControls ref={ref} /> : null;
}
