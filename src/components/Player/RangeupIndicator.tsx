import { usePlayerState } from "../../store";
import { useSpring, animated } from "@react-spring/three";
import BoomerangModel from "../GLTFs/BoomerangModel";
import { Spin } from "./Boomerang/Spin";

export function RangeupIndicator() {
  const [{ rangeUp }] = usePlayerState();
  const { scale } = useSpring({ scale: rangeUp ? 0.6 : 0 });
  return (
    <animated.mesh scale={scale} position={[0, 5, 0]}>
      <Spin>
        <BoomerangModel idx={Infinity} keepFlying={true} />
      </Spin>
    </animated.mesh>
  );
}
