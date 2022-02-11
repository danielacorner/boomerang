import BlackMage from "../GLTFs/BlackMage";
import { MouseTarget } from "./MouseTarget";
import { useEffect, useRef, useState } from "react";
import {
  useGameState,
  useGameStateRef,
  usePlayerPositionRef,
  usePlayerRef,
  usePlayerState,
} from "../../store";
import { useSpring, animated } from "@react-spring/three";
import { PLAYER_NAME } from "../../utils/constants";
import {
  Boomerang,
  MaxThrowDistanceRangeIndicator,
} from "./MaxThrowDistanceRangeIndicator";
import { usePlayerControls } from "./usePlayerControls";
import { RangeupCircularTimer } from "./RangeupCircularTimer";
import { RangeupIndicator } from "./RangeupIndicator";
import { PowerupCircularTimer } from "./PowerupCircularTimer";
import { Html, OrbitControls } from "@react-three/drei";
import { useInterval } from "react-use";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useControls } from "leva";

export function Player() {
  return (
    <>
      <Mage />
      <Boomerang />
      <RangeupCircularTimer />
      <PowerupCircularTimer />
      <RangeupIndicator />
      <Target />
      <Controls />
      <MaxThrowDistanceRangeIndicator />
    </>
  );
}

function Controls() {
  usePlayerControls();

  return null;
}
const Target = () => {
  return <MouseTarget />;
};

function Mage() {
  const { scale, opacity } = useMageSpring();

  const [playerRef] = usePlayerRef();
  useAnimateMage();
  return (
    <animated.mesh
      scale={scale}
      material-transparent={true}
      material-opacity={opacity}
      ref={playerRef}
      name={PLAYER_NAME}
    >
      {process.env.NODE_ENV === "development" && <PositionIndicator />}
      <BlackMage position={[0, -1, 0]} rotation={[0, Math.PI, 0]} />
      <pointLight intensity={5} distance={24} />
    </animated.mesh>
  );
}

const ANIMATION_DURATION = 5 * 1000;
function useAnimateMage() {
  // when we pick up the first boomerang, we want to animate the mage
  const [gameStateRef] = useGameStateRef();
  const [playerRef] = usePlayerRef();

  const { x, y, z } = useControls({ x: 0, y: Math.PI, z: 0 });
  useFrame(() => {
    const { cylinderApi, cylinderRef, heldBoomerangs, isAnimating } =
      gameStateRef.current;

    if (
      cylinderApi &&
      playerRef.current &&
      cylinderRef?.current &&
      heldBoomerangs.length === 1
    ) {
      if (!isAnimating) {
        gameStateRef.current.isAnimating = true;
        setTimeout(() => {
          // TODO turn into string state?
          gameStateRef.current.isAnimating = false;
        }, ANIMATION_DURATION);
      }

      // animate the mage up
      cylinderRef.current.position.set(
        THREE.MathUtils.lerp(cylinderRef.current.position.x, 0, 0.1),
        THREE.MathUtils.lerp(cylinderRef.current.position.y, 3, 0.06),
        THREE.MathUtils.lerp(cylinderRef.current.position.z, 0, 0.1)
      );
      cylinderRef.current.rotation.set(
        THREE.MathUtils.lerp(cylinderRef.current.rotation.x, x, 0.1),
        THREE.MathUtils.lerp(cylinderRef.current.rotation.y, y, 0.1),
        THREE.MathUtils.lerp(cylinderRef.current.rotation.z, z, 0.1)
      );
      cylinderApi.velocity.set(0, 0, 0);
      cylinderApi.angularVelocity.set(0, 0, 0);
    }
  });
}

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
      <OrbitControls />
    </>
  );
}
function useMageSpring() {
  const [{ poweredUp }] = usePlayerState();
  const [{ invulnerable }] = useGameState();

  const [blinkOn, setBlinkOn] = useState(false);

  useEffect(() => {
    if (invulnerable) {
      setBlinkOn(true);
    }
  }, [invulnerable]);

  return useSpring({
    scale: poweredUp ? 2.4 : 1.4,
    opacity: blinkOn ? 0 : 1,
    onRest: () => {
      if (invulnerable) {
        setBlinkOn(!blinkOn);
      }
      if (!invulnerable && blinkOn) {
        setBlinkOn(false);
      }
    },
  });
}
