import { useGameStateRef, usePlayerRef } from "../../store";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useControls } from "leva";
import { useState } from "react";

export function useAnimateMage() {
	// when we pick up the first boomerang, we want to animate the mage
	const [gameStateRef] = useGameStateRef();
	const [playerRef] = usePlayerRef();

	const [isAnimatingBoom, setIsAnimatingBoom] = useState(false);
	const { x, y, z } = useControls({ x: 0, y: Math.PI, z: 0 });
	useFrame(({ camera }) => {
		const { cylinderApi, cylinderRef, heldBoomerangs, isAnimating } =
			gameStateRef.current;

		if (
			!(
				isAnimating &&
				cylinderApi &&
				playerRef.current &&
				cylinderRef?.current &&
				heldBoomerangs.length === 1
			)
		) {
			return;
		}
		if (!isAnimatingBoom) {
			console.log(
				"🌟🚨 ~SETSTATE!! file: useAnimateMage.tsx ~ line 30 ~ useFrame ~ isAnimatingBoom",
				isAnimatingBoom
			);
			setIsAnimatingBoom(true);
		}
		// animate the mage up
		const MAGE_UP = {
			position: [0, 5, 0],
			rotation: [x, y, z],
		};
		cylinderRef.current.position.set(
			THREE.MathUtils.lerp(
				cylinderRef.current.position.x,
				MAGE_UP.position[0],
				0.1
			),
			THREE.MathUtils.lerp(
				cylinderRef.current.position.y,
				MAGE_UP.position[1],
				0.06
			),
			THREE.MathUtils.lerp(
				cylinderRef.current.position.z,
				MAGE_UP.position[2],
				0.1
			)
		);
		cylinderRef.current.rotation.set(
			THREE.MathUtils.lerp(
				cylinderRef.current.rotation.x,
				MAGE_UP.rotation[0],
				0.1
			),
			THREE.MathUtils.lerp(
				cylinderRef.current.rotation.y,
				MAGE_UP.rotation[1],
				0.1
			),
			THREE.MathUtils.lerp(
				cylinderRef.current.rotation.z,
				MAGE_UP.rotation[2],
				0.1
			)
		);
		cylinderApi.velocity.set(0, 0, 0);
		cylinderApi.angularVelocity.set(0, 0, 0);

		// animate the camera down
		const CAMERA_Y = 5;
		camera.position.set(
			camera.position.x,
			THREE.MathUtils.lerp(camera.position.y, CAMERA_Y, 0.06),
			camera.position.z
		);
	});
	return isAnimatingBoom;
}
