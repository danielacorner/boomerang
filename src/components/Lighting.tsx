export function Lighting() {
	const { x, y, z } = { x: -4, y: 9, z: 4 };
	return (
		<>
			<directionalLight
				castShadow
				position={[x, y, z]}
				intensity={1}
				shadow-mapSize-width={1024}
				shadow-mapSize-height={1024}
				shadow-camera-far={500}
				shadow-camera-left={-10}
				shadow-camera-right={10}
				shadow-camera-top={10}
				shadow-camera-bottom={-10}
			/>
			<ambientLight intensity={0.35} />
		</>
	);
}
