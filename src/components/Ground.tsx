import { Plane } from "@react-three/drei";
import { usePlane } from "@react-three/cannon";
import { useBoomerangState } from "../store";

export function Ground() {
  const [planeRef] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] }));

  const [{ isThrown }, setState] = useBoomerangState();
  const onClick = (e) => {
    const { x, y, z } = e.intersections[0].point;
    const targetPosition = [x, y, z];
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
      onClick={onClick}
      ref={planeRef}
      args={[1000, 1000]}
      position={[0, -1, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      material-color="#613f3f"
    />
  );
}
