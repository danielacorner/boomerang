import { useFrame } from "@react-three/fiber";
import { PublicApi, useCylinder } from "@react-three/cannon";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { DOWN, LEFT, RIGHT, UP, usePressedKeys } from "./usePressedKeys";
import { useEventListener } from "../../utils/useEventListener";
import { useHeldBoomerangs, useGameState, usePlayerState } from "../../store";
import {
	BOOMERANG_ITEM_NAME,
	ENEMY_NAME,
	GROUP2,
	POWERUP_NAME,
	RANGEUP_NAME,
} from "../../utils/constants";
import { useInterval, useMount } from "react-use";

const POWERUP_DURATION = 10 * 1000;
const [ROT_TOP, ROT_RIGHT, ROT_BOTTOM, ROT_LEFT] = [
	Math.PI * 1,
	Math.PI * 0.5,
	Math.PI * 0,
	Math.PI * -0.5,
];
export function usePlayerControls(): {
	cylinderRef: React.RefObject<THREE.Object3D<THREE.Event>>;
	cylinderApi: PublicApi;
	playerRef: React.MutableRefObject<null | THREE.Mesh<
		THREE.BufferGeometry,
		THREE.Material | THREE.Material[]
	>>;
	targetRef: React.MutableRefObject<null | THREE.Mesh<
		THREE.BufferGeometry,
		THREE.Material | THREE.Material[]
	>>;
	positionRef: React.MutableRefObject<null | number[]>;
	velocityRef: React.MutableRefObject<null | number[]>;
} {
	const [, setHeldBoomerangs] = useHeldBoomerangs();

	const moveSpeed = 0.35;

	const { pressedKeys, up, left, down, right } = usePressedKeys();

	// we'll wait till we've moved to start the useFrame below (forget why)
	const [hasMoved, setHasMoved] = useState(false);
	const [, setGameState] = useGameState();
	useEffect(() => {
		if (!hasMoved && pressedKeys.length !== 0) {
			setHasMoved(true);
		}
	}, [pressedKeys]);

	const [{ lookAt, poweredUp }, setPlayerState] = usePlayerState();

	const [movedMouse, setMovedMouse] = useState(false);
	useEventListener("mousemove", () => setMovedMouse(true));
	useEffect(() => {
		setMovedMouse(false);
	}, [pressedKeys]);
	const targetRef = useRef<THREE.Mesh>(null);
	const playerRef = useRef<THREE.Mesh>(null);

	const [cylinderRef, cylinderApi] = useCylinder(
		() => ({
			collisionFilterGroup: GROUP2,
			mass: 1,
			args: poweredUp ? [2, 2, 4] : [1, 1, 3],
			position: [0, 2, 0],
			// if collides with powerup, power up!
			onCollide: (e) => {
				// if collides with enemy, take damage
				const isCollisionWithEnemy = e.body.name === ENEMY_NAME;
				if (isCollisionWithEnemy) {
					// console.log("COLLISION! with ENEMY", e);
					setGameState((p) =>
						p.invulnerable
							? p
							: {
									...p,
									hitpoints: Math.max(0, p.hitpoints - 1),
									invulnerable: true,
							  }
					);
					const INVULNERABLE_DURATION = 6 * 1000;
					setTimeout(() => {
						setGameState((p) => ({ ...p, invulnerable: false }));
					}, INVULNERABLE_DURATION);
				}

				// if collides with powerup, power up!
				const isCollisionWithPowerup = e.body.name === POWERUP_NAME;
				if (isCollisionWithPowerup) {
					// console.log("COLLISION! with POWERUP", e);
					setPlayerState((p) => ({ ...p, poweredUp: true }));
					setTimeout(() => {
						setPlayerState((p) => ({ ...p, poweredUp: false }));
					}, POWERUP_DURATION);
				}

				// if collides with rangeup, range up!
				const isCollisionWithRangeup = e.body.name === RANGEUP_NAME;
				if (isCollisionWithRangeup) {
					// console.log("COLLISION! with RANGEUP", e);
					setPlayerState((p) => ({ ...p, rangeUp: true }));
					setTimeout(() => {
						setPlayerState((p) => ({ ...p, rangeUp: false }));
					}, POWERUP_DURATION);
				}

				// if collides with dropped boomerang, record it
				const isCollisionWithBoomerang = e.body.name === BOOMERANG_ITEM_NAME;
				if (isCollisionWithBoomerang) {
					// console.log("COLLISION! with boomerang", e);
					const newBoomerang = {
						status: "held" as any,
						clickTargetPosition: null,
					};
					setHeldBoomerangs((p) => [...p, newBoomerang]);
				}
			},
			type: "Dynamic", // https://github.com/pmndrs/use-cannon#types
			// A static body does not move during simulation and behaves as if it has infinite mass. Static bodies can be moved manually by setting the position of the body. The velocity of a static body is always zero. Static bodies do not collide with other static or kinematic bodies.
		}),
		playerRef,
		[poweredUp]
	);

	const positionRef = useRef<[number, number, number]>([0, 0, 0]);
	useEffect(() => {
		const unsubscribe = cylinderApi.position.subscribe((v) => {
			positionRef.current = v;
		});
		return unsubscribe;
	}, []);

	const velocityRef = useRef<[number, number, number]>([0, 0, 0]);
	useEffect(() => {
		const unsubscribe = cylinderApi.velocity.subscribe((v) => {
			velocityRef.current = v;
		});
		return unsubscribe;
	}, []);

	const rotation = useRef([0, 0, 0]);

	useInterval(() => {
		setPlayerState((p) => ({ ...p, playerPosition: positionRef.current }));
	}, 400);

	useEffect(() => {
		const unsubscribe = cylinderApi.rotation.subscribe(
			(v) => (rotation.current = v)
		);
		return unsubscribe;
	}, []);

	// move  the player
	useFrame(({ camera }) => {
		if (!cylinderRef.current || !playerRef.current || !hasMoved) {
			return;
		}
		const [px, py, pz] = [
			positionRef.current[0],
			positionRef.current[1],
			positionRef.current[2],
		];

		const [x2, y2, z2] = [
			px + (right ? -1 : left ? 1 : 0) * moveSpeed,
			py,
			pz + (down ? -1 : up ? 1 : 0) * moveSpeed,
		];

		cylinderApi.position.set(x2, y2, z2);

		// TODO: rotate to lookAt position
		const newRotY = -getAngleFromCenter(
			[playerRef.current.position.x, playerRef.current.position.z],
			[lookAt[0], lookAt[2]]
		);
		// const newRotY = getPlayerRotation(lastPressedKey) + orbitControlsAngle;

		const PLAYER_ROTATION_SPEED = 0.004;
		// const newRX = THREE.MathUtils.lerp(
		//   rotation.current[0],
		//   newRotX,
		//   PLAYER_ROTATION_SPEED
		// );
		const newRY = THREE.MathUtils.lerp(
			rotation.current[1],
			newRotY,
			PLAYER_ROTATION_SPEED
		);
		// const newRZ = THREE.MathUtils.lerp(
		//   rotation.current[2],
		//   newRotZ,
		//   PLAYER_ROTATION_SPEED
		// );
		cylinderApi.rotation.set(0, newRY, 0);
	});

	return {
		playerRef,
		cylinderRef,
		targetRef,
		positionRef,
		velocityRef,
		cylinderApi,
	};
}

function getPlayerRotation(lastPressedKey) {
	return lastPressedKey === LEFT
		? ROT_LEFT
		: lastPressedKey === DOWN
		? ROT_BOTTOM
		: lastPressedKey === RIGHT
		? ROT_RIGHT
		: lastPressedKey === UP
		? ROT_TOP
		: 0;
}

function getAngleFromCenter([x1, y1], [x2, y2]) {
	const dx = x2 - x1;
	const dy = y2 - y1;
	const radians = Math.atan2(dy, dx);
	return radians * (180 / Math.PI);
}
