import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { useCylinder } from "@react-three/cannon";
import {
	useHeldBoomerangs,
	usePlayerState,
	useDroppedItems,
	usePlayerPositionRef,
} from "../../store";
import {
	BOOMERANG_NAME,
	ENEMY_CYLINDER_HEIGHT,
	GROUP1,
	ITEM_TYPES,
} from "../../utils/constants";
import * as THREE from "three";
import { Vector3 } from "three";
const POWERUP_PROBABILITY = 0.12;
const RANGEUP_PROBABILITY = 0.16;
const HEART_PROBABILITY = 0.16;
const DROPPED_BOOMERANG_PROBABILITY = 0.08;
const MAX_BOOMERANGS = 6;

const ENEMY_JITTER_SPEED = 2;
const BOOMERANG_BASE_DAMAGE = 0.75;
const UNMOUNT_DELAY = 5 * 1000;
type MovementType = "randomWalk" | "preAttack" | "attack";

type MovementStep = {
	stepIdx: number;
	duration: number;
	startTime: number;
	movementType: MovementType;
};
const MOVEMENT_SEQUENCE_RAW: MovementStep[] = [
	{
		stepIdx: 0,
		startTime: 0,
		duration: 4.5,
		movementType: "randomWalk",
	},
	{
		stepIdx: 1,
		startTime: 4.5,
		duration: 1,
		movementType: "preAttack",
	},
	{
		stepIdx: 2,
		startTime: 5.5,
		duration: 1,
		movementType: "attack",
	},
];

const MOVEMENT_SEQUENCE: MovementStep[] = MOVEMENT_SEQUENCE_RAW.reduce(
	(acc, cur, idx) => {
		const prev = MOVEMENT_SEQUENCE_RAW[idx - 1];
		return [
			...acc,
			{ ...cur, startTime: prev ? (prev.startTime || 0) + prev.duration : 0 },
		];
	},
	[] as MovementStep[]
);

const MOVEMENT_SEQUENCE_DURATION = MOVEMENT_SEQUENCE.reduce(
	(acc, curr) => acc + curr.duration,
	0
);

const ENEMY_ATTACK_SPEED = 14;

export function useMoveEnemy({
	position,
	theyreDeadRef,
	health,
	setHealth,
	unmountEnemy,
	invulnerable,
}) {
	const [heldBoomerangs] = useHeldBoomerangs();
	const [{ status }] = heldBoomerangs;
	const [{ poweredUp }] = usePlayerState();
	const [theyDroppedItems, setTheyDroppedItems] = useState(false);
	const [, setDroppedItems] = useDroppedItems();
	const [playerPositionRef] = usePlayerPositionRef();
	const [theyDied, setTheyDied] = useState(false);
	const movementStatusRef = useRef<MovementType | null>(null);
	const enemyMeshRef = useRef<THREE.Mesh | null>(null);
	const attackedRef = useRef<boolean>(false);
	const onceRef = useRef<boolean>(false);
	const [enemyRef, api] = useCylinder(
		() => ({
			collisionFilterGroup: GROUP1,
			args: [3, 1, ENEMY_CYLINDER_HEIGHT, 6],
			mass: 1,
			position: position.current,
			onCollide: (e) => {
				if (
					// ignore if first boomerang is held
					status === "held" ||
					theyDroppedItems ||
					invulnerable
				) {
					return;
				}
				// when the boomerang+enemy collide, subtract some hp
				const isCollisionWithBoomerang = e.body?.name.includes(BOOMERANG_NAME);
				// const isCollisionWithGround = e.body?.name === GROUND_NAME;
				// subtract some hp when they hit the boomerang
				if (isCollisionWithBoomerang) {
					const nextHealth = Math.max(
						0,
						health -
							BOOMERANG_BASE_DAMAGE *
								(1 + Math.random() * 0.5) *
								(poweredUp ? 2 : 1)
					);
					setHealth(nextHealth);
					const didTheyDied = nextHealth === 0;
					if (didTheyDied) {
						setTheyDied(true);
					}
					const shouldDropItems = didTheyDied && !onceRef.current;

					if (shouldDropItems) {
						onceRef.current = true;
						setTheyDroppedItems(true);
						const mPosition: [number, number, number] = [
							position.current[0] + Math.random() - 0.5,
							position.current[1] + Math.random() - 0.5,
							position.current[2] + Math.random() - 0.5,
						];
						const newMoney = {
							position: mPosition,
							type: ITEM_TYPES.MONEY,
						};
						setDroppedItems((p) => [...p, newMoney]);

						const powerup = Math.random() > 1 - POWERUP_PROBABILITY;
						if (powerup) {
							const pPosition: [number, number, number] = [
								position.current[0] + Math.random() - 0.5,
								position.current[1] + Math.random() - 0.5,
								position.current[2] + Math.random() - 0.5,
							];
							const newPowerup = {
								position: pPosition,
								type: ITEM_TYPES.POWERUP,
							};
							setDroppedItems((p) => [...p, newPowerup]);
						}

						const rangeUp = Math.random() > 1 - RANGEUP_PROBABILITY;
						if (rangeUp) {
							const rPosition: [number, number, number] = [
								position.current[0] + Math.random() - 0.5,
								position.current[1] + Math.random() - 0.5,
								position.current[2] + Math.random() - 0.5,
							];
							const newPowerup = {
								position: rPosition,
								type: ITEM_TYPES.RANGEUP,
							};
							setDroppedItems((p) => [...p, newPowerup]);
						}

						const heart = Math.random() > 1 - HEART_PROBABILITY;
						if (heart) {
							const rPosition: [number, number, number] = [
								position.current[0] + Math.random() - 0.5,
								position.current[1] + Math.random() - 0.5,
								position.current[2] + Math.random() - 0.5,
							];
							const newPowerup = {
								position: rPosition,
								type: ITEM_TYPES.HEART,
							};
							setDroppedItems((p) => [...p, newPowerup]);
						}

						const droppedBoomerang =
							heldBoomerangs.length < MAX_BOOMERANGS &&
							Math.random() > 1 - DROPPED_BOOMERANG_PROBABILITY;
						if (droppedBoomerang) {
							const rPosition: [number, number, number] = [
								position.current[0] + Math.random() - 0.5,
								position.current[1] + Math.random() - 0.5,
								position.current[2] + Math.random() - 0.5,
							];
							const newBoomerang = {
								position: rPosition,
								type: ITEM_TYPES.BOOMERANG,
							};
							setDroppedItems((p) => [...p, newBoomerang]);
						}
					}
				}
			},
			material: {
				restitution: theyreDeadRef.current ? 1 : 0,
				friction: theyreDeadRef.current ? 0 : 100,
			},
		}),
		enemyMeshRef,
		[
			status,
			heldBoomerangs,
			theyDroppedItems,
			poweredUp,
			health,
			theyreDeadRef.current,
		]
	);

	const [attacked, setAttacked] = useState(false);
	// movement: move towards player
	useFrame(({ clock }) => {
		if (!position.current || !enemyRef.current || theyreDeadRef.current) {
			return;
		}
		const time = clock.getElapsedTime();
		const currentStep = getCurrentStep(time);

		if (!currentStep) {
			return;
		}
		const movementStatus = currentStep.movementType;
		movementStatusRef.current = movementStatus;

		const [x, y, z] = [
			position.current[0],
			ENEMY_CYLINDER_HEIGHT / 2 + 1,
			position.current[2],
		];
		if (movementStatus === "randomWalk") {
			if (attackedRef.current) {
				attackedRef.current = false;
			}
			// random walk towards player
			const randomX = Math.random() * 2;
			const randomZ = Math.random() * 2;

			const directionX = Math.random() > 0.5 ? 1 : -1;
			const directionZ = Math.random() > 0.5 ? 1 : -1;

			const [dx, dy, dz] = [
				Math.random() > 0.5 ? ENEMY_JITTER_SPEED * randomX * directionX : 0,
				0.1,
				Math.random() > 0.5 ? ENEMY_JITTER_SPEED * randomZ * directionZ : 0,
			];
			const [x2, y2, z2] = [
				playerPositionRef.current[0],
				playerPositionRef.current[1],
				playerPositionRef.current[2],
			];

			const x2Lerp = THREE.MathUtils.lerp(x, x2 + dx, 0.011);
			const y2Lerp = THREE.MathUtils.lerp(y, y2 + dy, 0.011);
			const z2Lerp = THREE.MathUtils.lerp(z, z2 + dz, 0.011);

			// api.applyForce([fx, fy, fz], [x, y, z]);
			api.position.set(x2Lerp, y2Lerp, z2Lerp);
			api.rotation.set(0, 0, 0);
			api.velocity.set(0, 0, 0);
		} else if (movementStatus === "preAttack") {
			api.rotation.set(0, 0, 0);
			api.position.set(x, y, z);
			api.velocity.set(0, 0, 0);
		} else if (movementStatus === "attack") {
			if (!attackedRef.current) {
				attackedRef.current = true;
				const newVelocity = new Vector3(
					playerPositionRef.current[0] - position.current[0],
					playerPositionRef.current[1] - position.current[1],
					playerPositionRef.current[2] - position.current[2]
				);

				const newVelocityNormalized = newVelocity.normalize();

				api.velocity.set(
					newVelocityNormalized.x * ENEMY_ATTACK_SPEED,
					newVelocityNormalized.y * ENEMY_ATTACK_SPEED,
					newVelocityNormalized.z * ENEMY_ATTACK_SPEED
				);
			}
			api.rotation.set(0, 0, 0);
			// api.position.set(x, y, z);
		}
	});

	// when they die, apply a force to the enemy to make it fall
	useEffect(() => {
		if (theyDied && !theyreDeadRef.current) {
			const worldPoint: [number, number, number] = [
				position.current[0],
				position.current[1] - ENEMY_CYLINDER_HEIGHT / 2,
				position.current[2],
			];
			const kickIntoSpace: [number, number, number] = [0, -10, 0];
			api.applyImpulse(kickIntoSpace, worldPoint);
			theyreDeadRef.current = true;
			setTimeout(() => {
				unmountEnemy();
			}, UNMOUNT_DELAY);
		}
	}, [theyDied]);

	return { enemyRef, enemyMeshRef, api, movementStatusRef };
}
export function getCurrentStep(time: number) {
	const timeInSequence = time % MOVEMENT_SEQUENCE_DURATION;
	const currentStep = MOVEMENT_SEQUENCE.find((step) => {
		return (
			timeInSequence >= step.startTime &&
			timeInSequence < step.startTime + step.duration
		);
	});
	return currentStep;
}
