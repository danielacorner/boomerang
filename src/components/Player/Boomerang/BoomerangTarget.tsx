import { useBoomerangState } from "../../../store";
import { animated, useSpring } from "@react-spring/three";

export function BoomerangTarget() {
  const [{ status, clickTargetPosition }] = useBoomerangState();
  const { scale, opacity } = useSpring({
    scale: status === "flying" ? 1 : 0.4,
    opacity: status === "flying" ? 0.2 : 0.1,
    config: { mass: 1, tension: 200, friction: 10 },
  });
  return (
    <animated.mesh
      scale={scale}
      position={clickTargetPosition as [number, number, number]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <torusBufferGeometry attach="geometry" args={[1, 0.1, 16, 16]} />
      <animated.meshBasicMaterial
        attach="material"
        color="#a07e7e"
        transparent={true}
        opacity={opacity}
      />
    </animated.mesh>
  );
}
