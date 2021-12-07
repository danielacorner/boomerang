import { Plane } from "@react-three/drei";
import { usePlane } from "@react-three/cannon";
import { useBoomerangState } from "../store";

const GROUND_PLANE = "groundPlane";

export function Ground() {
  const [planeRef] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] }));

  const [{ isThrown }, setState] = useBoomerangState();
  const onClick = (e) => {
    const ground = e.intersections.find((i) => i.object.name === GROUND_PLANE);
    const point = ground?.point;
    console.log("🌟🚨 ~ onClick ~ point", point);
    if (!point) {
      ("no intersection found!");
      return;
    }
    console.log("🌟🚨 ~ onClick ~ point", point);
    console.log("🌟🚨 ~ onClick ~ e.intersections", e.intersections);
    const targetPosition = [point.x, 0.5, point.z];
    console.log(e);
    if (!isThrown) {
      setState((p) => ({
        ...p,
        isThrown: true,
        targetPosition,
      }));
    }
  };

  return (
    <Plane
      name={GROUND_PLANE}
      onClick={onClick}
      ref={planeRef}
      args={[30, 30]}
      position={[0, -1, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      material-color="#613f3f"
    />
  );
}
