import { useHeldBoomerangs } from "../../../store";
import { animated, useSpring } from "@react-spring/three";
import { useEffect, useRef } from "react";

export function BoomerangTarget() {
	const [[{ status, clickTargetPosition }]] = useHeldBoomerangs();
	const { scale } = useSpring({
		scale: ["flying", "returning"].includes(status) ? 1 : 0,
		config: { mass: 1, tension: 200, friction: 10 },
	});

	const lastClickTargetPosition = useRef([0, 0, 0]);
	useEffect(() => {
		if (clickTargetPosition) {
			lastClickTargetPosition.current = clickTargetPosition;
		}
	}, [clickTargetPosition]);

	return (
		<animated.mesh
			scale={scale}
			position={
				(clickTargetPosition || lastClickTargetPosition.current) as [
					number,
					number,
					number
				]
			}
			rotation={[-Math.PI / 2, 0, 0]}
		>
			<torusBufferGeometry attach="geometry" args={[1, 0.1, 16, 16]} />
			<meshBasicMaterial color="#a07e7e" />
		</animated.mesh>
	);
}
