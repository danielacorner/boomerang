import { BoomerangTarget } from "./Boomerang/BoomerangTarget";
import { useHeldBoomerangs, usePlayerState } from "../../store";
import { MAX_THROW_DISTANCE } from "../../utils/constants";
import { BoomerangWithControls } from "./Boomerang/BoomerangWithControls";

/** a white torus of radius MAX_THROW_DISTANCE */
export function MaxThrowDistanceIndicator() {
  const [{ rangeUp }] = usePlayerState();
  // if it's above the max distance, shrink it down to the max distance
  const maxThrowDistance = MAX_THROW_DISTANCE * (rangeUp ? 3 : 1);
  return (
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <torusBufferGeometry
        attach="geometry"
        args={[maxThrowDistance, 0.2, 8, 32]}
      />
      <meshBasicMaterial
        attach="material"
        transparent={true}
        opacity={0.2}
        color={0xdcfcfc}
      />
    </mesh>
  );
}
export function Boomerang({
  playerPositionRef,
  playerCylinderApi,
  playerVelocityRef,
}) {
  const [heldBoomerangs] = useHeldBoomerangs();
  return (
    <>
      {heldBoomerangs.map((_, idx) => (
        <BoomerangWithControls
          key={idx}
          {...{
            idx,
            playerPositionRef,
            playerCylinderApi,
            playerVelocityRef,
          }}
        />
      ))}
      <BoomerangTarget />
    </>
  );
}
