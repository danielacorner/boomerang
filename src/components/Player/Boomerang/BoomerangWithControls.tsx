import { forwardRef } from "react";
import BoomerangModel from "../../GLTFs/BoomerangModel";
import * as THREE from "three";
import { usePlayerState } from "../../../store";
import { FlashWhenStatusChanges } from "./../FlashWhenStatusChanges";
import { BOOMERANG_NAME } from "../../../utils/constants";
import { animated, useSpring } from "@react-spring/three";
import { Spin } from "./Spin";
import { useBoomerang } from "./useBoomerang";

export const BoomerangWithControls = forwardRef(
	(
		{ playerPosition }: { playerPosition: number[] },
		playerRef: React.ForwardedRef<THREE.Mesh>
	) => {
		const ref = useBoomerang(playerPosition, playerRef);
		const [{ poweredUp }] = usePlayerState();
		const { scale } = useSpring({ scale: poweredUp ? 4 : 1 });
		return (
			<animated.mesh
				position={[0, 0, 0]}
				ref={ref}
				scale={scale}
				name={BOOMERANG_NAME}
			>
				<Spin>
					<BoomerangModel />
				</Spin>
				<FlashWhenStatusChanges />
			</animated.mesh>
		);
	}
);
