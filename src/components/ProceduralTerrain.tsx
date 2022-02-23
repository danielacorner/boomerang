import { useBox } from "@react-three/cannon";
import { useEffect, useRef, useState } from "react";
import { BOOMERANG_NAME, GROUP1, COLORS } from "../utils/constants";
import { useCurrentWave } from "./Enemies/Enemies";
import { LEVELS } from "./Enemies/LEVELS";
import PlantModel from "./GLTFs/PlantModel";
import { Walls } from "./Player/Walls";

const TILE_WIDTH = 5;
const TERRAIN = {
	// width of the level in tiles
	rowWidth: 16,
	// height of the level in tiles
	colHeight: 32,
};

// probabilities of going to the next color
const TILE_PROBABILITY_MACHINE = {
	// this tile has x probability of turning into tile y
	[COLORS.DIRT]: [
		// [x, y]
		// e.g. dirt has 0.7 chance of turning into dirt
		[0.7, COLORS.DIRT],
		[0.1, COLORS.GRASS],
		[0.05, COLORS.WATER],
		[0.05, COLORS.SAND],
	],
	[COLORS.GRASS]: [
		[0.7, COLORS.GRASS],
		[0.2, COLORS.DIRT],
		[0.1, COLORS.PLANT],
	],
	[COLORS.WATER]: [
		[0.8, COLORS.WATER],
		[0.2, COLORS.GRASS],
	],
	[COLORS.PLANT]: [
		[0.6, COLORS.PLANT],
		[0.4, COLORS.GRASS],
	],
	[COLORS.SAND]: [
		[0.7, COLORS.SAND],
		[0.3, COLORS.DIRT],
	],
};

function getTerrain(currentWave) {
	const level = LEVELS[currentWave];
	const numTiles = level.terrain.width * level.terrain.height;
	return [...Array(numTiles)].reduce(
		// TODO: generate one based on the last one
		(acc, _, i) => {
			const [row, col] = getRowCol(i);

			const tileToLeft = col === 0 ? null : acc[i - 1];
			const tileAbove = row === 0 ? null : acc[i - TERRAIN.rowWidth];

			const overrideColor =
				level.terrain.overrideTiles?.find((t) => t.col === col && t.row === row)
					?.overrideColor || null;

			const color = overrideColor
				? overrideColor
				: row === 0 || col === 0
				? COLORS.DIRT
				: getNextColor(tileAbove.color, tileToLeft.color);

			const tile = {
				color,
				position: [
					(col + 0.5 - 0.5 * TERRAIN.rowWidth) * TILE_WIDTH,
					-1,
					(row + 0.5 - 0.5 * TERRAIN.colHeight) * TILE_WIDTH,
				],
				index: i,
				// gridPosition: [row, col],
			};
			return [...acc, tile];
		},
		[]
	);
}
export function ProceduralTerrain() {
	const [currentWave] = useCurrentWave();
	const [terrain, setTerrain] = useState(getTerrain(currentWave));
	const prevWave = useRef(currentWave);
	useEffect(() => {
		if (prevWave.current !== currentWave) {
			setTerrain(getTerrain(currentWave));
			prevWave.current = currentWave;
		}
	}, [currentWave]);

	// TODO: terrain in a pseudo-random shape?
	// TODO: a wall of blocks surrounding the terrain
	// const [walls] =

	return (
		<>
			{terrain.map(({ color, position }, i) => {
				return (
					<mesh key={i} position={position} receiveShadow>
						<boxBufferGeometry args={[TILE_WIDTH, 1, TILE_WIDTH]} />
						<meshStandardMaterial color={color} />
						{color === COLORS.WATER && <WallBlock {...{ position }} />}
						{color === COLORS.PLANT && <PlantBlock {...{ position }} />}
					</mesh>
				);
			})}
			<Walls
				{...{
					x: (TERRAIN.rowWidth * TILE_WIDTH) / 2,
					z: (TERRAIN.colHeight * TILE_WIDTH) / 2,
				}}
			/>
		</>
	);
}

function getRowCol(index) {
	const row = Math.floor(index / TERRAIN.rowWidth);
	const col = index % TERRAIN.rowWidth;
	return [row, col];
}

function getNextColor(col1, col2) {
	const nextPossibilities = [
		...(TILE_PROBABILITY_MACHINE[col1] ?? []),
		...(TILE_PROBABILITY_MACHINE[col2] ?? []),
	] as [number, string][];
	const nextPoolOfPossibilities = nextPossibilities.reduce(
		(acc, [probability, color]) => [
			...acc,
			...[...Array(probability * 100)].map(() => color),
		],
		[] as string[]
	);
	return nextPoolOfPossibilities[
		(Math.random() * nextPoolOfPossibilities.length) | 0
	];
}

/** block off a tile in the grid */
function WallBlock({ position }) {
	const [boxRef] = useBox(() => ({
		mass: 1,
		type: "Static",
		args: [TILE_WIDTH, TILE_WIDTH * 3, TILE_WIDTH],
		position,
		rotation: [0, 0, 0],
	}));
	return (
		<mesh ref={boxRef}>
			<boxBufferGeometry args={[TILE_WIDTH, 1, TILE_WIDTH]} />
			<meshStandardMaterial color={COLORS.DIRT} />
		</mesh>
	);
}

/** block off a tile in the grid (destructible) */
function PlantBlock({ position }) {
	const [mounted, setMounted] = useState(true);
	return mounted ? (
		<>
			<mesh>
				<DestructibleBlock {...{ setMounted, position }} />
				<PlantModel />
			</mesh>
		</>
	) : null;
}

function DestructibleBlock({
	setMounted,
	position,
	children = null as JSX.Element | null,
}) {
	const boxHeight = TILE_WIDTH * 3;
	const [boxRef] = useBox(() => ({
		mass: 99999,
		// type: "Kinematic",
		collisionFilterGroup: GROUP1,
		args: [TILE_WIDTH, boxHeight, TILE_WIDTH],
		position: [position[0], position[1] + boxHeight / 2, position[2]],
		rotation: [0, 0, 0],
		onCollide: (e) => {
			if (e.body?.name.includes(BOOMERANG_NAME)) {
				setMounted(false);
			}
		},
	}));
	return (
		<mesh ref={boxRef}>
			{/* <boxBufferGeometry args={[TILE_WIDTH, 1, TILE_WIDTH]} /> */}
			{/* <meshStandardMaterial color={COLORS.DIRT} /> */}
			{children}
		</mesh>
	);
}
