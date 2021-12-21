import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const ROTATION_SPEED = -0.2;

export function Spin({ children }) {
	const ref = useRef<THREE.Mesh>(null);

	useFrame(() => {
		if (!ref.current) return;
		ref.current.rotation.set(0, ref.current.rotation.y + ROTATION_SPEED, 0);
	});

	return <mesh ref={ref}>{children}</mesh>;
}
