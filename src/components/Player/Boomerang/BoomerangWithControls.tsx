import { forwardRef } from "react";
import BoomerangModel from "../../GLTFs/BoomerangModel";
import * as THREE from "three";
import { useBoomerangState, usePlayerState } from "../../../store";
import { FlashWhenStatusChanges } from "./../FlashWhenStatusChanges";
import { BOOMERANG_NAME } from "../../../utils/constants";
import { animated, useSpring } from "@react-spring/three";
import { Spin } from "./Spin";
import { useBoomerangMovement } from "./useBoomerangMovement";

export const BoomerangWithControls = forwardRef(
  (
    { playerPosition }: { playerPosition: [number, number, number] },
    playerRef: React.ForwardedRef<THREE.Mesh>
  ) => {
    const ref = useBoomerangMovement(playerPosition, playerRef);
    const [{ status }] = useBoomerangState();
    const [{ poweredUp }] = usePlayerState();
    const [{ scale }] = useSpring(
      {
        scale: status === "idle" ? 0 : poweredUp ? 4 : 1,
      },
      [status, poweredUp]
    );
    return (
      <animated.mesh ref={ref} scale={scale} name={BOOMERANG_NAME}>
        <Spin>
          <BoomerangModel />
        </Spin>
        <FlashWhenStatusChanges />
      </animated.mesh>
    );
  }
);
