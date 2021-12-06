import { useGLTF } from "@react-three/drei";
import BlackMage from "../GLTFs/BlackMage";
import { usePlayerControls } from "./usePlayerControls";

export function Player() {
	const [ref] = usePlayerControls();
	const { scene, ...stuff } = useGLTF("/models/black_mage/scene.gltf");
	return (
		<mesh ref={ref}>
			<BlackMage />
		</mesh>
	);
}
