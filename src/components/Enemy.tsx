import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import JeffBezos from "./GLTFs/JeffBezos";
import * as THREE from "three";

const ENEMY_JITTER_SPEED = 2;

export function Enemy() {
  const ref = useRef<THREE.Mesh>(null);

  const [first, setfirst] = useState(true);

  useFrame(({ viewport }) => {
    if (!ref.current) return;
    if (first) {
      ref.current.position.z = -viewport.height / 2;
      ref.current.position.x = (viewport.width / 2) * (Math.random() * 2 - 1);
      setfirst(false);
    }
    // random walk
    const randomX = Math.random() * 2 - 1;
    const randomZ = Math.random() * 2 - 0.5;

    const directionX = Math.random() > 0.5 ? 1 : -1;
    const directionZ = Math.random() > 0.2 ? 1 : -1;

    const [x, y, z] = [ref.current.position.x, 1, ref.current.position.z];
    const [x2, y2, z2] = [
      x + (Math.random() > 0.7 ? ENEMY_JITTER_SPEED * randomX * directionX : 0),
      1,
      z + (Math.random() > 0.4 ? ENEMY_JITTER_SPEED * randomZ * directionZ : 0),
    ];

    ref.current.position.x = THREE.MathUtils.lerp(x, x2, 0.1);
    ref.current.position.y = THREE.MathUtils.lerp(y, y2, 0.1);
    ref.current.position.z = THREE.MathUtils.lerp(z, z2, 0.1);

    // ref.current.position.set(x2, y2, z2);
  });

  const { viewport, ...rest } = useThree();
  return (
    <mesh ref={ref}>
      {/* <meshBasicMaterial color={"#FFFFFF"} />
      <sphereBufferGeometry attach="geometry" args={[1, 32, 32]} /> */}
      <JeffBezos scale={20} rotation={[Math.PI / 2, 0, 0]} />
    </mesh>
  );
}
