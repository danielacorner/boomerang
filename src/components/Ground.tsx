import { Plane } from "@react-three/drei";
import { usePlane } from "@react-three/cannon";
import { useTargetPosition } from "../store";

export function Ground() {
  const [planeRef] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] }));
  const [targetPosition, setTargetPosition] = useTargetPosition();

  return (
    <Plane
      ref={planeRef}
      onClick={(e) => {
        console.log(e);
        console.log("🌟🚨 ~ Ground ~ [e.point.x, e.point.y, e.point.z]", [
          e.point.x,
          e.point.y,
          e.point.z,
        ]);
        setTargetPosition([e.point.x, 1, e.point.z]);
      }}
      args={[1000, 1000]}
      position={[0, -1, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      material-color="#613f3f"
    />
  );
}
