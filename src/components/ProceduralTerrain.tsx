import { useState } from "react";
import { Walls } from "./Player/Walls";

const TILE_WIDTH = 5;
const TERRAIN = {
  // width of the level in tiles
  rowWidth: 8,
  // height of the level in tiles
  colHeight: 16,
};
const NUM_TILES = TERRAIN.rowWidth * TERRAIN.colHeight;
const COLORS = {
  GRASS: "#2bb169",
  DIRT: "#8c5900",
  SAND: "#e0c946",
  WATER: "#006958",
  PLANT: "#ca6c3e",
};

export function ProceduralTerrain() {
  const [terrain] = useState(
    [...Array(NUM_TILES)].reduce(
      // TODO: generate one based on the last one
      (acc, _, i) => {
        const [row, col] = getRowCol(i);
        console.log(
          "🌟🚨 ~ file: ProceduralTerrain.tsx ~ line 25 ~ ProceduralTerrain ~ row, col",
          row,
          col
        );
        const tileToLeft = col === 0 ? null : acc[i - 1];
        const tileAbove = row === 0 ? null : acc[i - TERRAIN.rowWidth];

        const color =
          row === 0 || col === 0
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
    )
  );

  // TODO: terrain in a pseudo-random shape?
  // TODO: a wall of blocks surrounding the terrain
  // const [walls] =

  console.log(
    "🌟🚨 ~ file: ProceduralTerrain.tsx ~ line 22 ~ ProceduralTerrain ~ terrain",
    terrain
  );

  return (
    <>
      {terrain.map(({ color, position }, i) => {
        return (
          <mesh key={i} position={position} receiveShadow>
            <boxBufferGeometry args={[TILE_WIDTH, 1, TILE_WIDTH]} />
            <meshStandardMaterial color={color} />
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

// probabilities of going to the next color
const TILE_PROBABILITY_MACHINE = {
  // this tile has x probability of turning into tile y
  [COLORS.DIRT]: [
    // [x, y]
    [0.6, COLORS.DIRT],
    [0.2, COLORS.GRASS],
    [0.1, COLORS.WATER],
    [0.1, COLORS.SAND],
  ],
  [COLORS.GRASS]: [
    [0.6, COLORS.GRASS],
    [0.3, COLORS.DIRT],
    [0.1, COLORS.PLANT],
  ],
  [COLORS.WATER]: [
    [0.7, COLORS.WATER],
    [0.3, COLORS.GRASS],
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
