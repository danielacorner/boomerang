import { useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { EnemyHpBar } from "./EnemyHpBar";
import { ENEMY_CYLINDER_HEIGHT, ENEMY_NAME } from "../../utils/constants";
import { animated, useSpring } from "@react-spring/three";
import { useMoveEnemy } from "./useMoveEnemy";
import { Text } from "@react-three/drei";

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

  const { enemyRef, api, movementStatus } = useMoveEnemy({
    position,
    theyreDead,
    setTheyreDead,
    health,
    setHealth,
    unmountEnemy,
    invulnerable,
  });

  const { opacity } = useSpring({ opacity: theyreDead ? 0 : 1 });
  return (
    <>
      <animated.mesh
        material-transparent={true}
        material-opacity={opacity}
        ref={enemyRef}
        name={ENEMY_NAME}
      >
        <pointLight intensity={5} distance={8} position={[0, -5, 0]} />
        {/* <meshBasicMaterial color={"#FFFFFF"} />
      <sphereBufferGeometry attach="geometry" args={[1, 32, 32]} /> */}
        {children}
        <EnemyHpBar {...{ health, maxHp, enemyHeight, enemyUrl, enemyName }} />
        <AttackIndicator {...{ movementStatus }} />
      </animated.mesh>
    </>
  );
}

const AnimatedText = animated(Text);
/** warn before the enemy attacks */
function AttackIndicator({ movementStatus }) {
  const willAttack = movementStatus === "preAttack";
  const { opacity, position } = useSpring({
    opacity: willAttack ? 1 : 0,
    position: [0, 10 + (willAttack ? 0 : -5), 0] as [number, number, number],
  });
  return (
    <animated.mesh position={position}>
      <AnimatedText
        color={"#d63434"}
        fontSize={6}
        scale={1}
        fillOpacity={opacity}
      >
        !
      </AnimatedText>
    </animated.mesh>
  );
}
