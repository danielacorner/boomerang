import { useEffect, useRef, useState } from "react";
import { useBoomerangState, usePlayerState } from "../../../store";
import { useFrame } from "@react-three/fiber";
import { useSphere } from "@react-three/cannon";

const BOOMERANG_RADIUS = 1;
const THROW_SPEED = 2;
const RETURN_SPEED = 0.08;
const INITIAL_POSITION: [number, number, number] = [0, 1, 0];

/** shoots a boomerang when you click */
export function useBoomerang(playerPosition: number[], playerRef) {
	const [{ lookAt, poweredUp }] = usePlayerState();

	// boomerang state & click position
	const [{ status, clickTargetPosition }, setBoomerangState] =
		useBoomerangState();

	const [boomerangRef, api] = useSphere(
		() => ({
			mass: poweredUp ? 4 : 1,
			args: [BOOMERANG_RADIUS * (poweredUp ? 4 : 1)],
			position: INITIAL_POSITION,
			type: "Kinematic",
			// A static body does not move during simulation and behaves as if it has infinite mass. Static bodies can be moved manually by setting the position of the body. The velocity of a static body is always zero. Static bodies do not collide with other static or kinematic bodies.
			material: {
				restitution: 1,
				friction: 0,
			},
		}),
		null,
		[poweredUp]
	);

	// subscribe to the position
	const position = useRef(INITIAL_POSITION);
	useEffect(() => {
		const unsubscribe = api.position.subscribe((v) => (position.current = v));
		return unsubscribe;
	}, []);

	// subscribe to the velocity
	const velocity = useRef(INITIAL_POSITION);
	useEffect(() => {
		const unsubscribe = api.velocity.subscribe((v) => (velocity.current = v));
		return unsubscribe;
	}, []);

	const [thrown, setThrown] = useState(false);

	// throw on click
	useEffect(() => {
		if (clickTargetPosition && !thrown) {
			const throwVelocity: [number, number, number] = [
				clickTargetPosition[0] - position.current[0],
				clickTargetPosition[1] - position.current[1],
				clickTargetPosition[2] - position.current[2],
			].map((v) => v * THROW_SPEED) as [number, number, number];
			api.velocity.set(...throwVelocity);
			setTimeout(() => {
				setThrown(true);
			}, 100);
		}
	}, [clickTargetPosition, thrown]);

	// pull the boomerang towards the player
	useFrame(() => {
		if (thrown) {
			const pullBoomerang: [number, number, number] = [
				playerPosition[0] - position.current[0],
				playerPosition[1] - position.current[1],
				playerPosition[2] - position.current[2],
			];

			const newVelocity: [number, number, number] = [
				velocity.current[0] + pullBoomerang[0] * RETURN_SPEED,
				velocity.current[1] + pullBoomerang[1] * RETURN_SPEED,
				velocity.current[2] + pullBoomerang[2] * RETURN_SPEED,
			];

			api.velocity.set(...newVelocity);
		}
	});

	return boomerangRef;
}
