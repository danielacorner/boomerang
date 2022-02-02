import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useGameStateRef, useHeldBoomerangs } from "../../store";

export function MouseTarget() {
	const ref = useRef<THREE.Mesh | null>(null);
	const [gameStateRef] = useGameStateRef();

	useFrame(() => {
		if (!ref.current) return;
		const [x, y, z] = gameStateRef.current.lookAt;
		ref.current.position.set(x, y, z);
	});
	const [heldBoomerangs] = useHeldBoomerangs();
	const { status } = heldBoomerangs[0];
	return (
		<mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
			<torusBufferGeometry args={[1, 0.1, 16, 16]} />
			<meshBasicMaterial
				color="#831a00"
				transparent={true}
				opacity={status === "held" ? 0.4 : 0}
			/>
		</mesh>
	);
}
