import { Plane } from "@react-three/drei";
import { usePlane } from "@react-three/cannon";
import { useBoomerangState, usePlayerState } from "../store";
import { getMousePosition } from "./Player/Player";
import { useThree } from "@react-three/fiber";

const GROUND_PLANE = "groundPlane";

export function Ground() {
  const [planeRef] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] }));

  const [{ isThrown }, setBoomerangState] = useBoomerangState();
  const [, setPlayerState] = usePlayerState();
  const { mouse, viewport } = useThree();
  const onClick = (e) => {
    const ground = e.intersections.find((i) => i.object.name === GROUND_PLANE);
    const point = ground?.point;
    if (!point) {
      ("no intersection found!");
      return;
    }
    const mousePosition = getMousePosition(mouse, viewport);
    console.log(e);
    if (!isThrown) {
      setBoomerangState((p) => ({
        ...p,
        isThrown: true,
        targetPosition: [mousePosition.x, mousePosition.y, mousePosition.z],
      }));
      onMouseMove(e);
    }
  };

  const onMouseMove = (e) => {
    const ground = e.intersections.find((i) => i.object.name === GROUND_PLANE);
    const point = ground?.point;
    if (!point) {
      ("no intersection found!");
      return;
    }
    const targetPosition = [point.x, 0.5, point.z];

    setPlayerState((p) => ({ ...p, lookAt: targetPosition }));
  };

  return (
    <Plane
      name={GROUND_PLANE}
      onClick={onClick}
      onPointerMove={onMouseMove}
      ref={planeRef}
      args={[200, 200]}
      position={[0, -1, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      material-color="#613f3f"
    />
  );
}
