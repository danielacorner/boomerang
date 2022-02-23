/* eslint-disable react/display-name */
import React, { useRef } from "react";
import BoomerangModel from "../../GLTFs/BoomerangModel";
import { useHeldBoomerangs, usePlayerState } from "../../../store";
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

export const BoomerangWithControls = ({
	// TODO: use idx to only shoot one at a time
	idx,
}: {
	idx: number;
}) => {
	const { boomerangRef: ref, carriedItems } = useMoveBoomerang({
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

	return (
		<animated.mesh
			castShadow
			ref={ref}
			scale={scale}
			name={`${BOOMERANG_NAME}_${idx}`}
		>
			{rangeUp && (
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
			{status === "dropped" && <DroppedBoomerangPin />}
			<FlashWhenStatusChanges {...{ idx }} />
			<pointLight
				intensity={1}
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
