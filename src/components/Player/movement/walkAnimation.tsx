import * as THREE from "three";

const ANIMATION_HEIGHT = 0.7;
const ANIMATION_ROT_DEG = 3;
const ANIMATION_DURATION_S = 0.04;
export function walkAnimation({ initialY, frameRef, initialYRef }) {
  frameRef.current++;

  const FPS = 60;
  const animationPct = frameRef.current / (ANIMATION_DURATION_S * FPS);
  const animationPctSin = Math.sin(animationPct);
  console.log(
    "🌟🚨 ~ file: walkAnimation.tsx ~ line 13 ~ walkAnimation ~ animationPctSin",
    animationPctSin
  );
  if (!initialYRef.current) {
    initialYRef.current = initialY;
  }

  const nextY =
    initialYRef.current + ANIMATION_HEIGHT * (animationPctSin + 0.5);
  const nextRotZ =
    THREE.MathUtils.degToRad(ANIMATION_ROT_DEG) * animationPctSin;
  return {
    nextY,
    nextRotZ,
  };
}
