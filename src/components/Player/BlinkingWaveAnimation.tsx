import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

/** circles that expand and fade out, like rader blips */
export function BlinkingWaveAnimation({ offsetTime = 0 }) {
  const ref = useRef<THREE.Mesh | null>();
  const matRef = useRef<THREE.MeshBasicMaterial | null>();
  useFrame(({ clock }) => {
    if (!ref.current || !matRef.current) return;
    const time = clock.getElapsedTime() * 2 + offsetTime;
    const scale = Math.sin(time * 2) * 2.5 + 2;
    const opacity = Math.max(0, Math.sin((time + 0.9) * 2) * 0.5 + 0.3);
    ref.current.scale.set(scale, scale, scale);
    matRef.current.opacity = opacity;
  });
  return (
    <>
      <mesh ref={ref} position={[0, 1, -1]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial
          ref={matRef}
          color="#62d6eb"
          transparent={true}
          opacity={0}
        />
        <torusBufferGeometry args={[0.75, 0.03, 16, 16]} />
      </mesh>
    </>
  );
}
