import { Canvas } from "@react-three/fiber";
import { Plane, OrbitControls } from "@react-three/drei";
import styled from "styled-components";
import { Physics, usePlane } from "@react-three/cannon";
import { Player } from "./components/Player/Player";

function App() {
	return (
		<AppStyles>
			<Canvas
				camera={{
					position: [0, 10 * (3 / 3) /* 120deg */, 10],
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
export type Direction = "ArrowUp" | "ArrowLeft" | "ArrowRight" | "ArrowDown";

function Ground() {
	const [planeRef] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] }));
	return (
		<Plane
			ref={planeRef}
			args={[100, 100]}
			position={[0, -1, 0]}
			material-color="#613f3f"
			rotation={[-Math.PI / 2, 0, 0]}
			{...({} as any)}
		/>
	);
}
