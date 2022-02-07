/* eslint-disable react/display-name */
import React, { useRef } from "react";
import BoomerangModel from "../../GLTFs/BoomerangModel";
import { useHeldBoomerangs, usePlayerState } from "../../../store";
import { FlashWhenStatusChanges } from "./FlashWhenStatusChanges";
import { BOOMERANG_NAME, ITEM_TYPES } from "../../../utils/constants";
import { animated, useSpring } from "@react-spring/three";
import { Spin } from "./Spin";
import { useBoomerangMovement } from "./useBoomerangMovement";
import { Powerup } from "../../DroppedItems/Powerup";
import MoneyBag from "../../GLTFs/MoneyBag";
import Rangeup from "../../GLTFs/Rangeup";
import { Html } from "@react-three/drei";
import { DroppedBoomerangPin } from "../../DroppedItems/DroppedBoomerang";

export const BoomerangWithControls = ({
  // TODO: use idx to only shoot one at a time
  idx,
}: {
  idx: number;
}) => {
  const { boomerangRef: ref, carriedItems } = useBoomerangMovement({
    idx,
  });
  const [heldBoomerangs] = useHeldBoomerangs();
  const { status } = heldBoomerangs[idx];
  const [{ poweredUp, rangeUp }] = usePlayerState();

  const [{ scale }] = useSpring(
    {
      scale: status === "held" ? 0.75 : poweredUp ? 2.5 : 1,
    },
    [status, poweredUp]
  );

  return (
    <animated.mesh
      castShadow
      ref={ref}
      scale={scale}
      name={`${BOOMERANG_NAME}_${idx}`}
    >
      <Spin {...(["dropped", "held"].includes(status) ? { stop: true } : {})}>
        <BoomerangModel {...{ idx }} />
        <CarriedItems {...{ carriedItems }} />
      </Spin>
      {status === "dropped" && <DroppedBoomerangPin />}
      <FlashWhenStatusChanges {...{ idx }} />
      <pointLight
        intensity={2}
        distance={12 * (rangeUp ? 2 : 1) * (poweredUp ? 2 : 1)}
      />
    </animated.mesh>
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
