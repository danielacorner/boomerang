import { usePlane } from "@react-three/cannon";
import { useThree } from "@react-three/fiber";
import { GROUP1, WALL_NAME } from "../../utils/constants";

const DEPTH = 9;
export function Collisions() {
  const { viewport } = useThree();
  const z = viewport.distance * 1;
  const x = viewport.width * 0.45;
  const y = viewport.height * 0.45;

  // back, front
  const [backRef] = usePlane(() => ({
    collisionFilterGroup: GROUP1,
    position: [0, 0, -z],
    rotation: [0, 0, 0],
  }));
  const [frontRef] = usePlane(() => ({
    collisionFilterGroup: GROUP1,
    position: [0, 0, z],
    rotation: [0, -Math.PI, 0],
  }));

  // left, right
  const [leftRef] = usePlane(() => ({
    collisionFilterGroup: GROUP1,
    position: [x, 0, 0],
    rotation: [0, -Math.PI / 2, 0],
  }));
  const [rightRef] = usePlane(() => ({
    collisionFilterGroup: GROUP1,
    position: [-x, 0, 0],
    rotation: [0, Math.PI / 2, 0],
  }));

  // // top
  // usePlane(() => ({
  //   position: [0, y, 0],
  //   rotation: [Math.PI / 2, 0, 0],
  // }));
  // bottom
  // usePlane(() => ({
  //   position: [0, -y, 0],
  //   rotation: [-Math.PI / 2, 0, 0],
  // }));
  return (
    <>
      <mesh ref={backRef} name={WALL_NAME} />
      <mesh ref={frontRef} name={WALL_NAME} />
      <mesh ref={leftRef} name={WALL_NAME} />
      <mesh ref={rightRef} name={WALL_NAME} />
    </>
  );
}
