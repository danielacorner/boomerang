import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useCylinder } from "@react-three/cannon";
import { BOOMERANG_NAME } from "../Player/BoomerangWithControls";
import { GROUND_NAME } from "../Ground";
import MoneyBag from "../GLTFs/MoneyBag";

const ENEMY_JITTER_SPEED = 2;
const CYLINDER_HEIGHT = 4;
const BOOMERANG_DAMAGE = 1;

const CEILING_HEIGHT = CYLINDER_HEIGHT * 4;

// set up collisions on its children
export function Enemy({ children }) {
	const { viewport } = useThree();
	const [healthPercent, setHealthPercent] = useState(1);
	const theyDied = healthPercent === 0;

	const [didDropMoney, setDidDropMoney] = useState(false);

	const initialPosition: [x: number, y: number, z: number] = [
		(viewport.width / 2) * (Math.random() * 2 - 1),
		CYLINDER_HEIGHT + 1,
		-viewport.height / 2 + CYLINDER_HEIGHT,
	];
	const [enemyRef, api] = useCylinder(() => ({
		args: [3, 1, CYLINDER_HEIGHT, 6],
		mass: 1,
		position: initialPosition,
		onCollide: (e) => {
			// when the boomerang+enemy collide, subtract some hp
			const isCollisionWithBoomerang = e.body.name === BOOMERANG_NAME;
			const isCollisionWithGround = e.body.name === GROUND_NAME;

			setHealthPercent((prevHealthPct) => {
				const _theyDied = prevHealthPct === 0;
				// after they died, when they hit the ground again, they drop their moneys
				const shouldDropMoneys = _theyDied && isCollisionWithGround;
				if (shouldDropMoneys) {
					setDidDropMoney(true);
				}

				// subtract some hp when they hit the boomerang
				if (isCollisionWithBoomerang) {
					const nextHealthPercent = Math.max(
						0,
						prevHealthPct - BOOMERANG_DAMAGE
					);
					return nextHealthPercent;
				}
				return prevHealthPct;
			});

			console.log("COLLISION", e);
		},
		material: {
			restitution: 1,
			friction: 0,
		},
	}));

	const position = useRef(initialPosition);
	useEffect(() => {
		const unsubscribe = api.position.subscribe((v) => (position.current = v));
		return unsubscribe;
	}, []);

	// useMoveEnemy(position, api);

	// TODO: they gotta drop their moneys
	// when they die, spin around, drop their moneys
	useEffect(() => {
		if (theyDied) {
			const worldPoint: [number, number, number] = [
				position.current[0],
				position.current[1] - CYLINDER_HEIGHT / 2,
				position.current[2],
			];
			const kickIntoSpace: [number, number, number] = [0, -10, 0];
			api.applyImpulse(kickIntoSpace, worldPoint);
		}
	}, [theyDied]);

	return (
		<mesh ref={enemyRef}>
			{/* <meshBasicMaterial color={"#FFFFFF"} />
      <sphereBufferGeometry attach="geometry" args={[1, 32, 32]} /> */}
			{children}
			<HpBar healthPercent={healthPercent} />
			{didDropMoney ? <DroppedMoney /> : null}
		</mesh>
	);
}

const FULL_HEALTH = 4;

function HpBar({ healthPercent }) {
	const width = FULL_HEALTH * healthPercent;
	return (
		<mesh position={[0, CYLINDER_HEIGHT / 2 + 1, 0]}>
			<boxGeometry attach="geometry" args={[width, 0.5, 0.5]} />
			<meshBasicMaterial attach="material" color={"#810f0f"} />
		</mesh>
	);
}

function useMoveEnemy(position, api) {
	useFrame(() => {
		if (!position.current) return;
		// random walk
		const randomX = Math.random() * 2 - 1;
		const randomZ = Math.random() * 2 - 0.5;

		const directionX = Math.random() > 0.5 ? 1 : -1;
		const directionZ = Math.random() > 0.2 ? 1 : -1;

		const [x, y, z] = [
			position.current[0],
			CYLINDER_HEIGHT / 2 + 1,
			position.current[2],
		];
		const [x2, y2, z2] = [
			x + (Math.random() > 0.7 ? ENEMY_JITTER_SPEED * randomX * directionX : 0),
			1,
			z + (Math.random() > 0.4 ? ENEMY_JITTER_SPEED * randomZ * directionZ : 0),
		];

		const x2Lerp = THREE.MathUtils.lerp(x, x2, 0.1);
		const y2Lerp = THREE.MathUtils.lerp(y, y2, 0.1);
		const z2Lerp = THREE.MathUtils.lerp(z, z2, 0.1);

		api.position.set(x2Lerp, y2Lerp, z2Lerp);
		api.rotation.set(0, 0, 0);
	});
}

function DroppedMoney() {
	return (
		<>
			<Bag />
			<Bag />
			<Bag />
			<Bag />
			<Bag />
		</>
	);
}

function Bag() {
	return (
		<mesh
			scale={0.1}
			position={[
				Math.random() * 5 - 2,
				Math.random() * 5 - 2,
				Math.random() * 5 - 2,
			]}
		>
			<MoneyBag />
		</mesh>
	);
}
