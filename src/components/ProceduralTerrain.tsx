export function ProceduralTerrain() {
  const terrain = [...Array(NUM_TILES)].reduce(
    // TODO: generate one based on the last one
    (acc, _, i) => {
      const tileToLeft = acc[i - 1];
      const tileAbove = acc[i - TERRAIN.rowWidth];

      const color =
        !tileToLeft?.color || !tileAbove?.color
          ? COLORS.DIRT
          : getNextColor(tileAbove.color);

      // TODO: generate the array from the top left to the bottom right
      // row starts at 0, col starts at 0
      // increment the column, then traverse diagonally up-right
      const [prevRow, prevCol] = acc[i - 1]?.gridPosition ?? [null, null];

      const row = tileToLeft ? tileToLeft.gridPosition[0] : 0;

      const tile = {
        color,
        position: tilePosition(i),
        index: i,
        gridPosition: [row, col],
      };
      return [...acc, tile];
    },
    []
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
    </>
  );
}
const TILE_WIDTH = 5;
const NUM_TILES = 100;
const TERRAIN = {
  rowWidth: NUM_TILES ** 0.5,
};
// const COLORS = ["#2bb169", "#8c5900", "#e0c946", "#006920", "#ca6c3e"];
const COLORS = {
  GRASS: "#2bb169",
  DIRT: "#8c5900",
  SAND: "#e0c946",
  WATER: "#006920",
  PLANT: "#ca6c3e",
};

function getRowCol(index) {
  const row = Math.floor(index / NUM_TILES ** 0.5);
  const col = index % NUM_TILES ** 0.5;
  return [row, col];
}
// TODO: generate the array from the top left to the bottom right

// function getRowCol(index) {
//   const row = Math.floor(index / NUM_TILES ** 0.5);
//   const col = index % NUM_TILES ** 0.5;
//   return [row, col];
// }
function tilePosition(index): [number, number, number] {
  const [row, col] = getRowCol(index);
  const position: [number, number, number] = [
    col * TILE_WIDTH - NUM_TILES / 4,
    -1,
    row * TILE_WIDTH - NUM_TILES / 4,
  ];
  console.log(
    "🌟🚨 ~ file: Ground.tsx ~ line 174 ~ tilePosition ~ position",
    position
  );
  return position;
}
const POSITIONS = [...Array(NUM_TILES)].map((_, i) => tilePosition(i));
// probabilities of going to the next color
const TILE_PROBABILITY_MACHINE = {
  // this tile has x probability of turning into tile y
  [COLORS.DIRT]: [
    // [x, y]
    [0.7, COLORS.DIRT],
    [0.1, COLORS.GRASS],
    [0.1, COLORS.WATER],
    [0.1, COLORS.SAND],
  ],
  [COLORS.GRASS]: [
    [0.6, COLORS.GRASS],
    [0.3, COLORS.DIRT],
    [0.1, COLORS.PLANT],
  ],
  [COLORS.WATER]: [
    [0.8, COLORS.WATER],
    [0.2, COLORS.GRASS],
  ],
  [COLORS.PLANT]: [
    [0.5, COLORS.PLANT],
    [0.5, COLORS.GRASS],
  ],
  [COLORS.SAND]: [
    [0.5, COLORS.SAND],
    [0.5, COLORS.GRASS],
  ],
};
function getNextColor(col1) {
  const nextPossibilities = [
    ...(TILE_PROBABILITY_MACHINE[col1] ?? []),
    // ...(TILE_PROBABILITY_MACHINE[col2] ?? []),
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
