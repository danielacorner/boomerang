import { ThreeEvent } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useBoomerangState, usePlayerState } from "../../store";

export function MouseTarget({ children }) {
	const ref = useRef<THREE.Mesh | null>(null);

	const [{ lookAt }] = usePlayerState();

	useEffect(() => {
		if (!ref.current || !lookAt) return;
		const [x, y, z] = lookAt;
		ref.current.position.set(x, y, z);
		console.log(
			"🌟🚨 ~ file: MouseTarget.tsx ~ line 18 ~ MouseTarget ~ lookAt",
			lookAt.map((x) => Math.round(x * 10) / 10)
		);
	}, [lookAt]);
	// ref.current.position.set(x, y, z);
	const [{ status }] = useBoomerangState();
	return (
		<mesh ref={ref}>
			<sphereBufferGeometry args={[0.6, 16, 16]} />
			<meshBasicMaterial
				color="#b90f0f"
				transparent={true}
				opacity={status === "idle" ? 0.2 : 0}
			/>
			{children}
		</mesh>
	);
}
