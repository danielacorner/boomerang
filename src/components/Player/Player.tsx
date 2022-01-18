import { usePlayerControls } from "./usePlayerControls";
import BlackMage from "../GLTFs/BlackMage";
import { BoomerangTarget } from "./Boomerang/BoomerangTarget";
import { MouseTarget } from "./MouseTarget";
import { useEffect, useState } from "react";
import { useHeldBoomerangs, useGameState, usePlayerState } from "../../store";
import { useSpring, animated } from "@react-spring/three";
import { MAX_THROW_DISTANCE, PLAYER_NAME } from "../../utils/constants";
import { BoomerangWithControls } from "./Boomerang/BoomerangWithControls";
import { RangeupIndicator } from "./RangeupIndicator";
import { Ground } from "../Ground";
import { useControls } from "leva";

export function Player() {
  const {
    playerRef,
    targetRef,
    positionRef: playerPositionRef,
    velocityRef: playerVelocityRef,
    cylinderRef: playerCylinderRef,
    cylinderApi: playerCylinderApi,
  } = usePlayerControls();

  // TODO: try putting a ref into jotai?
  return (
    <>
      <Ground {...{ playerPositionRef }} />

      <Mage {...{ playerRef, targetRef }} />
      <Boomerang
        {...{
          playerPositionRef,
          playerVelocityRef,
          playerCylinderApi,
          playerRef,
        }}
      />
    </>
  );
}

function Mage({ playerRef, targetRef }) {
  const [{ poweredUp }] = usePlayerState();
  const [{ invulnerable }] = useGameState();

  const [blinkOn, setBlinkOn] = useState(false);

  useEffect(() => {
    if (invulnerable) {
      setBlinkOn(true);
    }
  }, [invulnerable]);

  const { scale, opacity } = useSpring({
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
  return (
    <>
      <MouseTarget>
        <mesh ref={targetRef} />
      </MouseTarget>
      <animated.mesh
        scale={scale}
        material-transparent={true}
        material-opacity={opacity}
        ref={playerRef}
        name={PLAYER_NAME}
      >
        <BlackMage position={[0, -1, 0]} rotation={[0, Math.PI, 0]} />
        <RangeupIndicator />
        <MaxThrowDistanceIndicator />
        <pointLight intensity={4} distance={10} />
      </animated.mesh>
    </>
  );
}

/** a white torus of radius MAX_THROW_DISTANCE */
function MaxThrowDistanceIndicator() {
  const [{ rangeUp }] = usePlayerState();
  // if it's above the max distance, shrink it down to the max distance
  const maxThrowDistance = MAX_THROW_DISTANCE * (rangeUp ? 3 : 1);
  const { x, y, z } = useControls({ x: 0, y: 0, z: 0 });
  return (
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <torusBufferGeometry
        attach="geometry"
        args={[maxThrowDistance, 0.2, 8, 32]}
      />
      <meshBasicMaterial
        attach="material"
        transparent={true}
        opacity={0.2}
        color={0xdcfcfc}
      />
    </mesh>
  );
}

function Boomerang({
  playerPositionRef,
  playerCylinderApi,
  playerRef,
  playerVelocityRef,
}) {
  const [heldBoomerangs] = useHeldBoomerangs();
  return (
    <>
      {heldBoomerangs.map((_, idx) => (
        <BoomerangWithControls
          key={idx}
          ref={playerRef}
          {...{
            idx,
            playerPositionRef,
            playerCylinderApi,
            playerVelocityRef,
          }}
        />
      ))}
      <BoomerangTarget />
    </>
  );
}
