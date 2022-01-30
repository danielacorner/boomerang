import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { EnemyHpBar } from "./EnemyHpBar";
import { ENEMY_CYLINDER_HEIGHT, ENEMY_NAME } from "../../utils/constants";
import { animated } from "@react-spring/three";
import { getCurrentStep, useMoveEnemy } from "./useMoveEnemy";
import { Text } from "@react-three/drei";
import { useWhyDidYouUpdate } from "../useWhyDidYouUpdate";
import * as THREE from "three";
import { usePlayerPositionRef } from "../../store";
import { getIsPlayerWithinRange } from "./enemyUtils";
const ANIM_SCALE_SPEED = 0.11;
const ANIM_OPACITY_SPEED = 0.4;
const ANIM_TEXT_POSITION_SPEED = 0.3;
// const CEILING_HEIGHT = CYLINDER_HEIGHT * 4;

// set up collisions on its children
export function Enemy({
  children,
  unmountEnemy,
  invulnerable,
  maxHp,
  enemyHeight,
  enemyUrl,
  enemyName,
}) {
  const { viewport } = useThree();
  const [health, setHealth] = useState(maxHp);
  const [theyreDead, setTheyreDead] = useState(false);

  const position = useRef<[number, number, number]>([
    (viewport.width / 2) * (Math.random() * 2 - 1),
    ENEMY_CYLINDER_HEIGHT + 1,
    viewport.height / 2 + ENEMY_CYLINDER_HEIGHT,
  ]);
  useEffect(() => {
    const unsubscribe = api.position.subscribe((v) => (position.current = v));
    return unsubscribe;
  }, []);

  const { enemyRef, enemyMeshRef, api, movementStatusRef } = useMoveEnemy({
    position,
    theyreDead,
    setTheyreDead,
    health,
    setHealth,
    unmountEnemy,
    invulnerable,
  });
  const [playerPositionRef] = usePlayerPositionRef();
  useFrame(({ clock }) => {
    if (!enemyRef.current || !enemyMeshRef.current) return;

    const isPlayerWithinRange = getIsPlayerWithinRange(
      position.current,
      playerPositionRef.current
    );

    const time = isPlayerWithinRange ? clock.getElapsedTime() : 0;
    const currentStep = getCurrentStep(time);
    const willAttack = currentStep?.movementType === "preAttack";
    const sss = THREE.MathUtils.lerp(
      enemyRef.current.scale.x,
      willAttack ? 1.2 : 1,
      ANIM_SCALE_SPEED
    );
    const scale = new THREE.Vector3(sss, sss, sss);
    const material = enemyMeshRef.current.material as THREE.MeshBasicMaterial;
    const opacity = THREE.MathUtils.lerp(
      material.opacity,
      theyreDead ? 0 : 1,
      ANIM_OPACITY_SPEED
    );

    material.opacity = opacity;

    enemyRef.current.scale.set(scale.x, scale.y, scale.z);
  });

  useWhyDidYouUpdate("Enemy 🦠", {
    position,
    theyreDead,
    health,
    setHealth,
    unmountEnemy,
    invulnerable,
    maxHp,
    enemyHeight,
    enemyUrl,
    enemyName,
  });

  return (
    <>
      <animated.mesh
        material-transparent={true}
        ref={enemyMeshRef}
        name={ENEMY_NAME}
      >
        {/* <pointLight intensity={5} distance={8} position={[0, -5, 0]} /> */}
        {/* <meshBasicMaterial color={"#FFFFFF"} />
      <sphereBufferGeometry attach="geometry" args={[1, 32, 32]} /> */}
        {children}
        <EnemyHpBar {...{ health, maxHp, enemyHeight, enemyUrl, enemyName }} />
        <AttackIndicator />
      </animated.mesh>
    </>
  );
}

const AnimatedText = animated(Text);
/** warn before the enemy attacks */
function AttackIndicator() {
  const textRef = useRef<any>(null);
  const meshRef = useRef<any>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current || !textRef.current) return;
    const currentStep = getCurrentStep(clock.getElapsedTime());
    const willAttack = currentStep?.movementType === "preAttack";

    textRef.current.fillOpacity = THREE.MathUtils.lerp(
      textRef.current.fillOpacity,
      willAttack ? 1 : 0,
      ANIM_OPACITY_SPEED
    );
    const nextY = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      10 + (willAttack ? 0 : -5),
      ANIM_TEXT_POSITION_SPEED
    );
    meshRef.current.position.set(0, nextY, 0);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <Text
        ref={textRef}
        color={"#d63434"}
        fontSize={6}
        scale={1}
        // fillOpacity={opacity}
      >
        !
      </Text>
    </mesh>
  );
}
