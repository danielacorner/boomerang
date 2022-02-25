import { useBox } from "@react-three/cannon";
import { MeshDistortMaterial, useTexture } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { BOOMERANG_NAME, GROUP1, COLORS, GROUP2 } from "../../utils/constants";
import { useCurrentWave } from "../Enemies/Enemies";
import { LEVELS } from "../Enemies/LEVELS";
import PlantModel from "../GLTFs/PlantModel";
import { Walls } from "../Player/Walls";
import { useControls } from "leva";
import { TILE_PROBABILITY_MACHINE } from "./TILE_PROBABILITY_MACHINE";

const TILE_WIDTH = 5;

export function ProceduralTerrain() {
  const [currentWave] = useCurrentWave();
  const { terrain } = LEVELS[currentWave];
  const [tiles, setTiles] = useState(getTiles(currentWave));
  const prevWave = useRef(currentWave);
  useEffect(() => {
    if (prevWave.current !== currentWave) {
      setTiles(getTiles(currentWave));
      prevWave.current = currentWave;
    }
  }, [currentWave]);

  return (
    <>
      {tiles.map(({ color, position }, i) => {
        return (
          <mesh key={i} position={position} receiveShadow>
            <boxBufferGeometry args={[TILE_WIDTH, 1, TILE_WIDTH]} />
            {color === COLORS.WATER && <WaterBlock {...{ position }} />}
            {color === COLORS.GRASS && <GrassBlock />}
            {color === COLORS.PLANT && <PlantBlock {...{ position }} />}
            {color === COLORS.DIRT && <DirtBlock />}
            {color === COLORS.SAND && <SandBlock />}
            {color === COLORS.TEMPLE && <TempleBlock />}
          </mesh>
        );
      })}
      <Walls
        {...{
          x: terrain.width * TILE_WIDTH,
          z: terrain.height * TILE_WIDTH,
        }}
      />
    </>
  );
}

function WaterBlock({ position }) {
  const { speed, distort } = useControls({ speed: 6, distort: 0.15 });
  const texture = useTexture("/textures/water.png");
  return (
    <>
      <WallBlock {...{ position }} />
      <MeshDistortMaterial
        map={texture}
        alphaWrite={false}
        color={COLORS.WATER}
        attach="material"
        speed={speed}
        distort={distort}
      />
    </>
  );
}

function GrassBlock() {
  const texture = useTexture("/textures/grass.png");
  return (
    <meshStandardMaterial
      map={texture}
      color={COLORS.GRASS}
      attach="material"
    />
  );
}

function SandBlock() {
  const texture = useTexture("/textures/sand.png");
  return (
    <meshStandardMaterial map={texture} color={COLORS.SAND} attach="material" />
  );
}

function TempleBlock() {
  const texture = useTexture("/textures/brick.png");
  return (
    <meshStandardMaterial
      map={texture}
      color={COLORS.TEMPLE}
      attach="material"
    />
  );
}

function DirtBlock() {
  const texture = useTexture(
    Math.random() > 0.5 ? "/textures/dirt.jpg" : "/textures/dirt2.jpg"
  );
  return (
    <meshStandardMaterial map={texture} color={COLORS.DIRT} attach="material" />
  );
}

/** block off a tile in the grid */
function WallBlock({ position }) {
  const [boxRef] = useBox(() => ({
    mass: 0,
    collisionFilterGroup: GROUP2,
    type: "Static",
    args: [TILE_WIDTH, TILE_WIDTH * 2, TILE_WIDTH],
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
  const texture = useTexture("/textures/grass.png");
  return mounted ? (
    <>
      <meshStandardMaterial
        map={texture}
        color={COLORS.PLANT}
        attach="material"
      />
      <mesh>
        <DestructibleBlock {...{ setMounted, position, passThrough: true }} />
        <PlantModel />
      </mesh>
    </>
  ) : null;
}

function DestructibleBlock({
  setMounted,
  position,
  children = null as JSX.Element | null,
  passThrough = false,
}) {
  const boxHeight = TILE_WIDTH * 2;
  const [boxRef] = useBox(() => ({
    mass: 99999,
    type: "Static",
    ...(passThrough
      ? {
          collisionFilterGroup: GROUP1,
        }
      : {}),
    args: [TILE_WIDTH, boxHeight, TILE_WIDTH],
    position: [position[0], position[1] + boxHeight / 2, position[2]],
    rotation: [0, 0, 0],
    onCollide: (e) => {
      console.log(
        "🌟🚨 ~ file: ProceduralTerrain.tsx ~ line 193 ~ const[boxRef]=useBox ~ e.body?.name",
        e.body?.name
      );
      if (e.body?.name.includes(BOOMERANG_NAME)) {
        console.log(
          "🌟🌟🌟🌟🚨 ~ file: ProceduralTerrain.tsx ~ line 165 ~ const[boxRef]=useBox ~ e.body?.name.includes(BOOMERANG_NAME)",
          e.body?.name.includes(BOOMERANG_NAME)
        );
        setMounted(false);
      }
    },
  }));
  return <mesh ref={boxRef}>{children}</mesh>;
}

function getTiles(currentWave) {
  const { terrain } = LEVELS[currentWave];
  const numTiles = terrain.width * terrain.height;
  return [...Array(numTiles)].reduce(
    // generate each tile based on its neighbors, from the bottom-right to the top-left
    (acc, _, i) => {
      const [row, col] = getRowCol(i, terrain);

      const tileToLeft = col === 0 ? null : acc[i - 1];
      const tileAbove = row === 0 ? null : acc[i - terrain.width];

      const overrideColor =
        terrain.overrideTiles?.find((t) => t.col === col && t.row === row)
          ?.overrideColor || null;

      const color = overrideColor
        ? overrideColor
        : row === 0 || col === 0
        ? COLORS.DIRT
        : getNextColor(tileAbove.color, tileToLeft.color);

      const tile = {
        color,
        position: [
          (col + 0.5 - 0.5 * terrain.width) * TILE_WIDTH,
          -1,
          (row + 0.5 - 0.5 * terrain.height) * TILE_WIDTH,
        ],
        index: i,
        // gridPosition: [row, col],
      };
      return [...acc, tile];
    },
    []
  );
}

function getRowCol(index, terrain) {
  const row = Math.floor(index / terrain.width);
  const col = index % terrain.width;
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
