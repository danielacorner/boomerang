import { Plane, useTexture } from "@react-three/drei";
import { usePlane } from "@react-three/cannon";
import { useBoomerangState, usePlayerState } from "../store";
import { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { GROUND_NAME } from "../utils/constants";

export function Ground() {
  const [planeRef] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] }));
  const [{ status }, setBoomerangState] = useBoomerangState();
  const [{ farthestTargetPosition, playerPosition, rangeUp }, setPlayerState] =
    usePlayerState();

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    // ? for some reason this fires 5 times: 4 times as [0,0,0] and one time as the actual target
    // (only occurs when clicking the top half of the screen, in the initial camera rotation))

    if (
      !farthestTargetPosition ||
      (farthestTargetPosition[0] === 0 &&
        farthestTargetPosition[1] === 0 &&
        farthestTargetPosition[2] === 0)
    ) {
      return;
    }

    setBoomerangState((p) =>
      p.status === "idle" || rangeUp
        ? {
            ...p,
            status: "flying",
            clickTargetPosition: farthestTargetPosition,
          }
        : p
    );

    onPointerMove(e);
  };

  const MAX_THROW_DISTANCE = 12;

  const onPointerMove: (event: ThreeEvent<PointerEvent>) => void = (e) => {
    if ((rangeUp || status !== "flying") && playerPosition) {
      const { x, y, z } = getMousePosition(e);

      // limit the throw distance
      const distance = distanceBetweenPoints(playerPosition, [x, y, z]);

      // if it's above the max distance, shrink it down to the max distance
      const maxThrowDistance = MAX_THROW_DISTANCE * (rangeUp ? 3 : 1);

      const pctAboveMax = Math.abs(distance) / maxThrowDistance;

      const lookAt: [number, number, number] = [x, y, z];

      // if the distance is above the max distance, scale it down
      // (normalize, then multiply by maxThrowDistance)

      const [normX, normY, normZ] = normalizeVector([
        x - playerPosition[0],
        y - playerPosition[1],
        z - playerPosition[2],
      ]);

      const farthestTargetPosition: [number, number, number] =
        pctAboveMax > 1
          ? [
              normX * maxThrowDistance + playerPosition[0],
              normY * maxThrowDistance + playerPosition[1],
              normZ * maxThrowDistance + playerPosition[2],
            ]
          : lookAt;

      setPlayerState((p) => ({ ...p, lookAt, farthestTargetPosition }));
    }
  };

  const { texture } = useTexture({ texture: "/textures/grass.jpg" });

  if (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(20, 20);
    texture.anisotropy = 16;
  }

  return (
    <Plane
      name={GROUND_NAME}
      ref={planeRef}
      onPointerDown={onPointerDown}
      material-map={texture}
      onPointerMove={onPointerMove}
      material-transparent={true}
      material-opacity={0.4}
      args={[1000, 1000]}
      position={[0, -1, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      material-color="#c1e9c9"
    />
  );
}
export function getMousePosition(e: ThreeEvent<PointerEvent>) {
  const ground = e.intersections.find((i) => i.object.name === GROUND_NAME);

  // const point = ground?.point;
  const point = e.point;
  if (!point) {
    return { x: 0, y: 0, z: 0 };
  }
  const { x, y, z } = point;
  return { x, y: 1, z };
}

function distanceBetweenPoints([x1, y1, z1], [x2, y2, z2]) {
  return Math.sqrt(
    Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2)
  );
}

function normalizeVector([x, y, z]) {
  const magnitude = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
  return [x / magnitude, y / magnitude, z / magnitude];
}
