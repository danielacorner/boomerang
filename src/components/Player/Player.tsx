import BlackMage from "../GLTFs/BlackMage";
import { MouseTarget } from "./MouseTarget";
import { useState } from "react";
import { usePlayerPositionRef, usePlayerRef } from "../../store";
import { PLAYER_NAME } from "../../utils/constants";
import {
  Boomerang,
  MaxThrowDistanceRangeIndicator,
} from "./MaxThrowDistanceRangeIndicator";
import { usePlayerControls } from "./movement/usePlayerControls";
import { RangeupCircularTimer } from "./RangeupCircularTimer";
import { RangeupIndicator } from "./RangeupIndicator";
import { PowerupCircularTimer } from "./PowerupCircularTimer";
import { Html } from "@react-three/drei";
import { useInterval } from "react-use";
import { useAnimateMage } from "./movement/useAnimateMage";
import { ZeldaBoomerangAnimation } from "./ZeldaBoomerangAnimation";
import { useMoveCamera } from "./movement/useMoveCamera";

export function Player() {
  useMoveCamera();
  return (
    <>
      <Mage />
      <Animations />
      <Boomerang />
      <RangeupCircularTimer />
      <PowerupCircularTimer />
      <RangeupIndicator />
      <MouseTarget />
      <Controls />
      <MaxThrowDistanceRangeIndicator />
    </>
  );
}
function Animations() {
  const isAnimating = useAnimateMage();
  return isAnimating ? <ZeldaBoomerangAnimation /> : null;
}

function Controls() {
  usePlayerControls();

  return null;
}

function Mage() {
  const [playerRef] = usePlayerRef();
  return (
    <mesh
      // material-transparent={true}
      // material-opacity={opacity}
      ref={playerRef}
      name={PLAYER_NAME}
    >
      {process.env.NODE_ENV === "development" && <PositionIndicator />}
      <BlackMage position={[0, -1, 0]} rotation={[0, Math.PI, 0]} />
    </mesh>
  );
}

/** for debugging */
function PositionIndicator() {
  const [playerPositionRef] = usePlayerPositionRef();
  const [key, setkey] = useState(0);
  useInterval(() => {
    setkey(Math.random());
  }, 100);
  return (
    <>
      <Html position={[0, -2, 0]} style={{ color: "white" }} key={key}>
        {playerPositionRef.current.map((p) => p.toFixed(1)).join(",")}
      </Html>
      {/* <OrbitControls /> */}
    </>
  );
}
