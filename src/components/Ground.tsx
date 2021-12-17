import { Plane } from "@react-three/drei";
import { usePlane } from "@react-three/cannon";
import { useBoomerangState, usePlayerState } from "../store";
import { getMousePosition } from "./Player/Player";
import { useThree } from "@react-three/fiber";

export const GROUND_NAME = "groundPlane";

export function Ground() {
  const [planeRef] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] }));

  const [, setBoomerangState] = useBoomerangState();
  const [, setPlayerState] = usePlayerState();
  const { mouse, viewport } = useThree();
  const onClick = (e) => {
    const ground = e.intersections.find((i) => i.object.name === GROUND_NAME);
    const point = ground?.point;
    if (!point) {
      ("no intersection found!");
      return;
    }
    const { x, y, z } = getMousePosition(mouse, viewport);
    console.log(e);
    setBoomerangState((p) =>
      p.status !== "idle"
        ? p
        : {
            ...p,
            status: "flying",
            clickTargetPosition: [x, y, z],
          }
    );
    onMouseMove(e);
  };

  const onMouseMove = (e) => {
    const ground = e.intersections.find((i) => i.object.name === GROUND_NAME);
    const point = ground?.point;
    if (!point) {
      ("no intersection found!");
      return;
    }
    // const targetPosition = [point.x, 0.5, point.z];
    const { x, y, z } = getMousePosition(mouse, viewport);

    setPlayerState((p) => ({ ...p, lookAt: [x, y, z] }));
  };

  return (
    <Plane
      name={GROUND_NAME}
      onClick={onClick}
      onPointerMove={onMouseMove}
      ref={planeRef}
      args={[200, 200]}
      position={[0, -1, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      material-color="#53755a"
    />
  );
}
