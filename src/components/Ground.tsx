import { Plane } from "@react-three/drei";
import { usePlane } from "@react-three/cannon";
import { useBoomerangState, usePlayerState } from "../store";
import { ThreeEvent } from "@react-three/fiber";

export const GROUND_NAME = "groundPlane";

export function Ground() {
  const [planeRef] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] }));

  const [{ status }, setBoomerangState] = useBoomerangState();
  const [{ lookAt }, setPlayerState] = usePlayerState();

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    // ? for some reason this fires 5 times: 4 times as [0,0,0] and one time as the actual target
    // (only occurs when clicking the top half of the screen, in the initial camera rotation))
    if (lookAt[0] === 0 && lookAt[1] === 0 && lookAt[2] === 0) {
      return;
    }

    setBoomerangState((p) =>
      p.status !== "idle"
        ? p
        : {
            ...p,
            status: "flying",
            clickTargetPosition: lookAt,
          }
    );
    onPointerMove(e);
  };

  // const onRightClick=()=>{

  // }

  const onPointerMove: (event: ThreeEvent<PointerEvent>) => void = (e) => {
    if (status !== "flying") {
      const { x, y, z } = getMousePosition(e);

      setPlayerState((p) => ({ ...p, lookAt: [x, y, z] }));
    }
  };

  return (
    <Plane
      name={GROUND_NAME}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      ref={planeRef}
      args={[1000, 1000]}
      position={[0, -1, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      material-color="#53755a"
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
