import { Canvas } from "@react-three/fiber";
import { RoundedBox, Plane, OrbitControls } from "@react-three/drei";
import styled from "styled-components";
import { Physics, useBox, usePlane } from "@react-three/cannon";

function App() {
  return (
    <AppStyles>
      <Canvas>
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
  const [boxRef] = useBox(() => ({ mass: 1, position: [0, 2, 0] }));
  return (
    <>
      <OrbitControls {...({} as any)} />
      <Ground />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh ref={boxRef}>
        <RoundedBox
          args={[1, 1, 1]}
          radius={0.05}
          smoothness={4}
          {...({} as any)}
        >
          <meshPhongMaterial attach="material" color="#f3f3f3" wireframe />
        </RoundedBox>
      </mesh>
    </>
  );
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
