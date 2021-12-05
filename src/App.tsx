import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Plane, OrbitControls } from "@react-three/drei";
import styled from "styled-components";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { DOWN, LEFT, RIGHT, UP, usePressedKeys } from "./usePressedKeys";

function App() {
  return (
    <AppStyles>
      <Canvas
        camera={{
          position: [0, 10 * (4 / 3) /* 120deg */, 10],
        }}
      >
        <Physics>
          <Scene />
        </Physics>
      </Canvas>
    </AppStyles>
  );
}
const AppStyles = styled.div`
  height: 100vh;
`;

export default App;

function Scene() {
  return (
    <>
      <OrbitControls {...({} as any)} />
      <Ground />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Player />
    </>
  );
}
function Player() {
  const [ref] = usePlayerControls();
  return (
    <RoundedBox
      ref={ref}
      args={[1, 1, 1]}
      radius={0.05}
      smoothness={4}
      {...({} as any)}
    >
      <meshPhongMaterial attach="material" color="#f3f3f3" wireframe />
    </RoundedBox>
  );
}

export type Direction = "ArrowUp" | "ArrowLeft" | "ArrowRight" | "ArrowDown";

const MOVE_SPEED = 0.3;

function usePlayerControls() {
  const pressedKeys = usePressedKeys();

  const ref = useRef<THREE.Mesh>(null!);
  const [boxRef, api] = useBox(() => ({ mass: 1, position: [0, 2, 0] }), ref);

  const position = useRef([0, 0, 0]);
  useEffect(() => {
    const unsubscribe = api.position.subscribe((v) => (position.current = v));
    return unsubscribe;
  }, []);
  useFrame(() => {
    if (!boxRef.current) {
      return;
    }
    const [x, y, z] = [
      position.current[0],
      position.current[1],
      position.current[2],
    ];
    let [x2, y2, z2] = [x, y, z];
    if (pressedKeys.includes(UP)) {
      z2 -= MOVE_SPEED;
    }
    if (pressedKeys.includes(DOWN)) {
      z2 += MOVE_SPEED;
    }
    if (pressedKeys.includes(LEFT)) {
      x2 -= MOVE_SPEED;
    }
    if (pressedKeys.includes(RIGHT)) {
      x2 += MOVE_SPEED;
    }
    api.position.set(x2, y2, z2);
  });

  return [ref, boxRef];
}

function Ground() {
  const [planeRef] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] }));
  return (
    <Plane
      ref={planeRef}
      args={[100, 100]}
      position={[0, -1, 0]}
      material-color="red"
      rotation={[-Math.PI / 2, 0, 0]}
      {...({} as any)}
    />
  );
}
