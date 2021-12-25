import { forwardRef } from "react";
import BoomerangModel from "../../GLTFs/BoomerangModel";
import * as THREE from "three";
import { useHeldBoomerangs, usePlayerState } from "../../../store";
import { FlashWhenStatusChanges } from "./../FlashWhenStatusChanges";
import { BOOMERANG_NAME } from "../../../utils/constants";
import { animated, useSpring } from "@react-spring/three";
import { Spin } from "./Spin";
import { useBoomerangMovement } from "./useBoomerangMovement";

export const BoomerangWithControls = forwardRef(
  (
    {
      playerPosition,
      // TODO: use idx to only shoot one at a time
      idx,
    }: { playerPosition: [number, number, number]; idx: number },
    playerRef: React.ForwardedRef<THREE.Mesh>
  ) => {
    const ref = useBoomerangMovement(playerPosition, playerRef, idx);
    const [heldBoomerangs] = useHeldBoomerangs();
    const { status } = heldBoomerangs[idx];
    const [{ poweredUp }] = usePlayerState();
    const [{ scale }] = useSpring(
      {
        scale: status === "idle" ? 0 : poweredUp ? 4 : 1,
      },
      [status, poweredUp]
    );
    return (
      <animated.mesh castShadow ref={ref} scale={scale} name={BOOMERANG_NAME}>
        <Spin>
          <BoomerangModel {...{ idx }} />
        </Spin>
        <FlashWhenStatusChanges {...{ idx }} />
      </animated.mesh>
    );
  }
);
