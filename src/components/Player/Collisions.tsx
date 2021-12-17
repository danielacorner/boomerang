import { usePlane } from "@react-three/cannon";
import { useThree } from "@react-three/fiber";

const DEPTH = 9;
export function Collisions() {
  const { viewport } = useThree();
  const z = viewport.distance * 0.8;
  console.log("🌟🚨 ~ Collisions ~ viewport", viewport);
  const x = viewport.width * 0.5;
  const y = viewport.height * 0.5;

  // back, front
  usePlane(() => ({ position: [0, 0, -z], rotation: [0, 0, 0] }));
  usePlane(() => ({ position: [0, 0, z], rotation: [0, -Math.PI, 0] }));

  // left, right
  usePlane(() => ({
    position: [x, 0, 0],
    rotation: [0, -Math.PI / 2, 0],
  }));
  usePlane(() => ({
    position: [-x, 0, 0],
    rotation: [0, Math.PI / 2, 0],
  }));

  // // top
  // usePlane(() => ({
  //   position: [0, y, 0],
  //   rotation: [Math.PI / 2, 0, 0],
  // }));
  // bottom
  usePlane(() => ({
    position: [0, -y, 0],
    rotation: [-Math.PI / 2, 0, 0],
  }));
  return null;
}
