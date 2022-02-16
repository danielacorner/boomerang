import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { EnemyHpBar } from "./EnemyHpBar";
import { ENEMY_CYLINDER_HEIGHT, ENEMY_NAME } from "../../utils/constants";
import { animated } from "@react-spring/three";
import { getCurrentStep, useMoveEnemy } from "./useMoveEnemy";
import { Text } from "@react-three/drei";
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
  id: enemyId,
}) {
  const { viewport } = useThree();
  const [health, setHealth] = useState(maxHp);
  const theyreDeadRef = useRef(false);

  const position = useRef<[number, number, number]>([
    (viewport.width / 2) * (Math.random() * 2 - 1),
    ENEMY_CYLINDER_HEIGHT + 1,
    viewport.height / 2 + ENEMY_CYLINDER_HEIGHT,
  ]);
  useEffect(() => {
    const unsubscribe = api.position.subscribe((v) => (position.current = v));
    return unsubscribe;
  }, []);

  const { enemyRef, enemyMeshRef, api } = useMoveEnemy({
    position,
    theyreDeadRef,
    health,
    setHealth,
    unmountEnemy,
    invulnerable,
  });
  const [playerPositionRef] = usePlayerPositionRef();

  // attack the player if they're within range
  useFrame(({ clock }) => {
    if (!enemyRef.current || !enemyMeshRef.current) return;

    // only attack if the player is within range
    const isPlayerWithinRange = getIsPlayerWithinRange(
      position.current,
      playerPositionRef.current
    );

    const time = isPlayerWithinRange ? clock.getElapsedTime() : 0;
    const currentStep = getCurrentStep(time);
    const willAttack = currentStep?.movementType === "preAttack";
    const sss = THREE.MathUtils.lerp(
      enemyRef.current.scale.x,
      theyreDeadRef.current ? 2 : willAttack ? 1.2 : 1,
      ANIM_SCALE_SPEED
    );
    const scale = new THREE.Vector3(sss, sss, sss);

    enemyRef.current.scale.set(scale.x, scale.y, scale.z);

    // const material = enemyMeshRef.current.material as THREE.MeshBasicMaterial;
    // const opacity = THREE.MathUtils.lerp(
    //   material.opacity,
    //   theyreDeadRef.current ? 0 : 1,
    //   ANIM_OPACITY_SPEED
    // );

    // enemyMeshRef.current.traverse(function (node: any) {
    //   if (node.material) {
    //     node.material.transparent = true;
    //     node.material.opacity = opacity;
    //   }
    // });
  });

  // hp bar follows the enemy
  const hpBarRef = useRef(null as any);
  useFrame(() => {
    hpBarRef.current.position.set(
      position.current[0],
      position.current[1] + enemyHeight / 2,
      position.current[2]
    );
  });
  return (
    <>
      <mesh ref={hpBarRef}>
        <EnemyHpBar {...{ health, maxHp, enemyHeight, enemyUrl, enemyName }} />
      </mesh>
      <mesh material-transparent={true} ref={enemyMeshRef} name={ENEMY_NAME}>
        {/* <pointLight intensity={5} distance={8} position={[0, -5, 0]} /> */}
        {/* <meshBasicMaterial color={"#FFFFFF"} />
      <sphereBufferGeometry attach="geometry" args={[1, 32, 32]} /> */}
        {children}
        <AttackIndicator {...{ position }} />
      </mesh>
    </>
  );
}

/** warn before the enemy attacks */
function AttackIndicator({ position }) {
  const textRef = useRef<any>(null);
  const meshRef = useRef<any>(null);
  const [playerPositionRef] = usePlayerPositionRef();

  useFrame(({ clock }) => {
    if (!meshRef.current || !textRef.current) return;
    const isPlayerWithinRange = getIsPlayerWithinRange(
      position.current,
      playerPositionRef.current
    );
    const currentStep = getCurrentStep(clock.getElapsedTime());
    const willAttack =
      isPlayerWithinRange && currentStep?.movementType === "preAttack";

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
