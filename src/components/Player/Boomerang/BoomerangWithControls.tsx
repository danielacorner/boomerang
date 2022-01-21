/* eslint-disable react/display-name */
import React from "react";
import { forwardRef } from "react";
import BoomerangModel from "../../GLTFs/BoomerangModel";
import * as THREE from "three";
import { useHeldBoomerangs, usePlayerState } from "../../../store";
import { FlashWhenStatusChanges } from "./FlashWhenStatusChanges";
import { BOOMERANG_NAME, ITEM_TYPES } from "../../../utils/constants";
import { animated, useSpring } from "@react-spring/three";
import { Spin } from "./Spin";
import { useBoomerangMovement } from "./useBoomerangMovement";
import { PublicApi } from "@react-three/cannon";
import { Powerup } from "../../DroppedItems/Powerup";
import MoneyBag from "../../GLTFs/MoneyBag";
import Rangeup from "../../GLTFs/Rangeup";

export const BoomerangWithControls = forwardRef(
  (
    {
      playerVelocityRef,
      playerPositionRef,
      playerCylinderApi,
      // TODO: use idx to only shoot one at a time
      idx,
    }: {
      playerPositionRef: { current: [number, number, number] };
      playerVelocityRef: { current: [number, number, number] };
      idx: number;
      playerCylinderApi: PublicApi;
    },
    playerRef: React.ForwardedRef<THREE.Mesh>
  ) => {
    const { boomerangRef: ref, carriedItems } = useBoomerangMovement({
      playerPositionRef,
      playerVelocityRef,
      playerCylinderApi,
      playerRef,
      idx,
    });
    const [heldBoomerangs] = useHeldBoomerangs();
    const { status } = heldBoomerangs[idx];
    const [{ poweredUp }] = usePlayerState();

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
        <FlashWhenStatusChanges {...{ idx }} />
      </animated.mesh>
    );
  }
);

function CarriedItems({ carriedItems }: { carriedItems: ITEM_TYPES[] }) {
  return (
    <>
      {carriedItems.map((item, idx) => (
        <React.Fragment key={idx}>
          {item === ITEM_TYPES.MONEY ? (
            <MoneyBag />
          ) : item === ITEM_TYPES.POWERUP ? (
            <Powerup />
          ) : item === ITEM_TYPES.RANGEUP ? (
            <Rangeup />
          ) : null}
        </React.Fragment>
      ))}
    </>
  );
}
