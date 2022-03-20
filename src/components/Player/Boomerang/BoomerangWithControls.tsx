/* eslint-disable react/display-name */
import React, { useRef, useState } from "react";
import BoomerangModel from "../../GLTFs/BoomerangModel";
import {
  useBoomerangRefs,
  useHeldBoomerangs,
  usePlayerPositionRef,
  usePlayerState,
} from "../../../store";
import { FlashWhenStatusChanges } from "./FlashWhenStatusChanges";
import { BOOMERANG_NAME, ITEM_TYPES } from "../../../utils/constants";
import { animated, useSpring } from "@react-spring/three";
import { Spin } from "./Spin";
import { useMoveBoomerang } from "./useMoveBoomerang";
import { Powerup } from "../../GLTFs/Powerup";
import MoneyBag from "../../GLTFs/MoneyBag";
import Rangeup from "../../GLTFs/Rangeup";
import { Html } from "@react-three/drei";
import { DroppedBoomerangPin } from "../../DroppedItems/DroppedBoomerangPin";
import { BlinkingWaveAnimation } from "../BlinkingWaveAnimation";
import { useFrame } from "@react-three/fiber";
import { Trail } from "@react-three/drei";
import { distanceBetweenPoints } from "../../../utils/utils";

export const BoomerangWithControls = ({
  // TODO: use idx to only shoot one at a time
  idx,
}: {
  idx: number;
}) => {
  const { boomerangCylinderRef, carriedItems } = useMoveBoomerang({
    idx,
  });
  const [heldBoomerangs] = useHeldBoomerangs();
  const { status } = heldBoomerangs[idx] || { status: null };
  const [{ poweredUp, rangeUp }] = usePlayerState();

  const animatedScale = status === "held" ? 0.75 : poweredUp ? 2.5 : 1;
  const [{ scale, invScale }] = useSpring(
    {
      scale: animatedScale,
      invScale: 1 / animatedScale,
    },
    [status, poweredUp]
  );

  const [playerPositionRef] = usePlayerPositionRef();
  const [isVeryFarAway, setIsVeryFarAway] = useState(false);
  const [boomerangRefs] = useBoomerangRefs();
  useFrame(({ viewport }) => {
    if (
      !boomerangCylinderRef.current ||
      !playerPositionRef.current ||
      !boomerangRefs.current[idx]
    ) {
      return;
    }
    const distanceShowPin = Math.min(viewport.width, viewport.height) / 2;

    const boom = boomerangRefs.current[idx];

    const distanceToPlayer = distanceBetweenPoints(
      [boom.position[0], boom.position[1], boom.position[2]],
      playerPositionRef.current
    );

    if (Math.abs(distanceToPlayer) > distanceShowPin && !isVeryFarAway) {
      setIsVeryFarAway(true);
    } else if (distanceToPlayer < distanceShowPin && isVeryFarAway) {
      setIsVeryFarAway(false);
    }
  });

  const showPin =
    !rangeUp && (status === "dropped" || (isVeryFarAway && status !== "held"));

  return (
    <>
      <animated.mesh
        castShadow
        ref={boomerangCylinderRef}
        scale={scale}
        name={`${BOOMERANG_NAME}_${idx}`}
      >
        {rangeUp && ["flying", "returning", "dropped"].includes(status) && (
          <mesh scale={2}>
            <BlinkingWaveAnimation offsetTime={0} />
            <BlinkingWaveAnimation offsetTime={0.5} />
          </mesh>
        )}
        <Spin {...(["dropped", "held"].includes(status) ? { stop: true } : {})}>
          <BoomerangModel {...{ idx }} />
          <animated.mesh scale={invScale}>
            <CarriedItems {...{ carriedItems }} />
          </animated.mesh>
        </Spin>
        <DroppedBoomerangPin style={{ opacity: showPin ? 1 : 0 }} />
        <FlashWhenStatusChanges {...{ idx }} />
        <pointLight
          intensity={1}
          distance={12 * (rangeUp ? 2 : 1) * (poweredUp ? 2 : 1)}
        />
      </animated.mesh>
      <Trail
        width={12} // Width of the line
        color={"#2898ac"} // Color of the line
        length={2.4} // Length of the line
        decay={status === "held" ? 5 : 0.6} // How fast the line fades away
        local={false} // Wether to use the target's world or local positions
        stride={0} // Min distance between previous and current point
        interval={1} // Number of frames to wait before next calculation
        target={boomerangCylinderRef as any} // Optional target. This object will produce the trail.
        attenuation={(width) => width} // A function to define the width in each point along it.
      />
    </>
  );
};

function CarriedItems({ carriedItems }: { carriedItems: ITEM_TYPES[] }) {
  const positions = useRef<[number, number, number][]>(
    carriedItems.map(() => [
      5 * Math.random() * 0.5 - 0.25,
      5 * Math.random() * 0.5 - 0.25,
      5 * Math.random() * 0.5 - 0.25,
    ])
  ).current;
  return (
    <>
      {carriedItems.map((item, idx) => (
        <mesh position={positions[idx]} key={idx}>
          {item === ITEM_TYPES.MONEY ? (
            <MoneyBag />
          ) : item === ITEM_TYPES.POWERUP ? (
            <Powerup />
          ) : item === ITEM_TYPES.RANGEUP ? (
            <Rangeup />
          ) : item === ITEM_TYPES.HEART ? (
            <Html>♥</Html>
          ) : null}
        </mesh>
      ))}
    </>
  );
}
