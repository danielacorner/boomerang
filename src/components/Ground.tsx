import { Plane } from "@react-three/drei";
import { usePlane } from "@react-three/cannon";
import { useBoomerangState, usePlayerState } from "../store";
import { ThreeEvent, useThree } from "@react-three/fiber";
import { useState } from "react";

export const GROUND_NAME = "groundPlane";

export function Ground() {
	const [planeRef] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] }));

	const [{ status }, setBoomerangState] = useBoomerangState();
	const [{ lookAt }, setPlayerState] = usePlayerState();

	const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
		console.log("🌟🚨 ~ file: Ground.tsx ~ line 14 ~ Ground ~ lookAt", lookAt);

		// TODO: click goes to [0,0,0] on top side of page

		setBoomerangState((p) =>
			p.status !== "idle"
				? p
				: {
						...p,
						status: "flying",
						clickTargetPosition: lookAt,
				  }
		);
		onPointerMove(e);
	};

	// const onRightClick=()=>{

	// }

	const onPointerMove: (event: ThreeEvent<PointerEvent>) => void = (e) => {
		if (status !== "flying") {
			const { x, y, z } = getMousePosition(e);
			console.log("🌟🚨 ~ file: Ground.tsx ~ line 35 ~ Ground ~ { x, y, z }", [
				Math.round(x * 10) / 10,
				Math.round(y * 10) / 10,
				Math.round(z * 10) / 10,
			]);
			setPlayerState((p) => ({ ...p, lookAt: [x, y, z] }));
		}
	};

	return (
		<Plane
			name={GROUND_NAME}
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			ref={planeRef}
			args={[200, 200]}
			position={[0, -1, 0]}
			rotation={[-Math.PI / 2, 0, 0]}
			receiveShadow
			material-color="#53755a"
		/>
	);
}
export function getMousePosition(e: ThreeEvent<PointerEvent>) {
	const ground = e.intersections.find((i) => i.object.name === GROUND_NAME);

	const point = e.point;
	// const point = ground?.point;
	if (!point) {
		return { x: 0, y: 0, z: 0 };
	}
	const { x, y, z } = point;
	return { x, y: 1, z };
}
