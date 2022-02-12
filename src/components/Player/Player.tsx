import BlackMage from "../GLTFs/BlackMage";
import { MouseTarget } from "./MouseTarget";
import { useEffect, useRef, useState } from "react";
import {
	useGameState,
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
import { useAnimateMage } from "./useAnimateMage";
import BoomerangModel from "../GLTFs/BoomerangModel";

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
	const isAnimating = useAnimateMage();
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
			{isAnimating && <ZeldaBoomerangAnimation />}
		</animated.mesh>
	);
}

function ZeldaBoomerangAnimation() {
	return <BoomerangModel {...{ idx: null, position: [0, 4, 0] }} />;
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
