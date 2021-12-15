import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useSphere } from "@react-three/cannon";

const ENEMY_JITTER_SPEED = 2;

// set up collisions on its children
export function Enemy({ children }) {
  const { viewport } = useThree();

  const initialPosition: [x: number, y: number, z: number] = [
    (viewport.width / 2) * (Math.random() * 2 - 1),
    1,
    -viewport.height / 2,
  ];
  const [sphereRef, api] = useSphere(() => ({
    mass: 1,
    position: initialPosition,
  }));

  const position = useRef(initialPosition);
  useEffect(() => {
    const unsubscribe = api.position.subscribe((v) => (position.current = v));
    return unsubscribe;
  }, []);

  useFrame(() => {
    if (!position.current) return;
    // random walk
    const randomX = Math.random() * 2 - 1;
    const randomZ = Math.random() * 2 - 0.5;

    const directionX = Math.random() > 0.5 ? 1 : -1;
    const directionZ = Math.random() > 0.2 ? 1 : -1;

    const [x, y, z] = [position.current[0], 1, position.current[2]];
    const [x2, y2, z2] = [
      x + (Math.random() > 0.7 ? ENEMY_JITTER_SPEED * randomX * directionX : 0),
      1,
      z + (Math.random() > 0.4 ? ENEMY_JITTER_SPEED * randomZ * directionZ : 0),
    ];

    const x2Lerp = THREE.MathUtils.lerp(x, x2, 0.1);
    const y2Lerp = THREE.MathUtils.lerp(y, y2, 0.1);
    const z2Lerp = THREE.MathUtils.lerp(z, z2, 0.1);

    api.position.set(x2Lerp, y2Lerp, z2Lerp);
  });

  return (
    <mesh ref={sphereRef}>
      {/* <meshBasicMaterial color={"#FFFFFF"} />
      <sphereBufferGeometry attach="geometry" args={[1, 32, 32]} /> */}
      {children}
    </mesh>
  );
}
