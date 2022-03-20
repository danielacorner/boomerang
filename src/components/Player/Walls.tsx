import { usePlane } from "@react-three/cannon";
import { useThree } from "@react-three/fiber";
import { GROUP_1, WALL_NAME } from "../../utils/constants";

export function Walls({ z: z1, x: x1 }) {
  const { viewport } = useThree();
  const z = z1 / 2 || viewport.distance * 1;
  const x = x1 / 2 || viewport.width * 0.45;
  // const y = props.y || viewport.height * 0.45;

  // back, front
  const [backRef] = usePlane(
    () => ({
      collisionFilterGroup: GROUP_1,
      position: [0, 0, -z],
      rotation: [0, 0, 0],
    }),
    null,
    [z]
  );
  const [frontRef] = usePlane(
    () => ({
      collisionFilterGroup: GROUP_1,
      position: [0, 0, z],
      rotation: [0, -Math.PI, 0],
    }),
    null,
    [z]
  );

  // left, right
  const [leftRef] = usePlane(
    () => ({
      collisionFilterGroup: GROUP_1,
      position: [x, 0, 0],
      rotation: [0, -Math.PI / 2, 0],
    }),
    null,
    [x]
  );
  const [rightRef] = usePlane(
    () => ({
      collisionFilterGroup: GROUP_1,
      position: [-x, 0, 0],
      rotation: [0, Math.PI / 2, 0],
    }),
    null,
    [x]
  );

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
