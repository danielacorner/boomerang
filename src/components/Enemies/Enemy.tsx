import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { useCylinder } from "@react-three/cannon";
import {
  useHeldBoomerangs,
  usePlayerState,
  useDroppedItems,
} from "../../store";
import { EnemyHpBar } from "./EnemyHpBar";
import {
  BOOMERANG_NAME,
  ENEMY_CYLINDER_HEIGHT,
  ENEMY_NAME,
  GROUP1,
  ITEM_TYPES,
} from "../../utils/constants";
import { animated, useSpring } from "@react-spring/three";

const ENEMY_JITTER_SPEED = 2;
const BOOMERANG_BASE_DAMAGE = 0.75;
const UNMOUNT_DELAY = 2 * 1000;

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

  const { enemyRef, api } = useMoveEnemy({
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
      </animated.mesh>
    </>
  );
}

const POWERUP_PROBABILITY = 0.1;
const RANGEUP_PROBABILITY = 0.08;
const DROPPED_BOOMERANG_PROBABILITY = 0.03;
const MAX_BOOMERANGS = 6;

function useMoveEnemy({
  position,
  theyreDead,
  setTheyreDead,
  health,
  setHealth,
  unmountEnemy,
  invulnerable,
}) {
  const [heldBoomerangs] = useHeldBoomerangs();
  const [{ status }] = heldBoomerangs;
  const [{ poweredUp }] = usePlayerState();
  const [theyDroppedItems, setTheyDroppedItems] = useState(false);
  const [, setDroppedItems] = useDroppedItems();

  const [theyDied, setTheyDied] = useState(false);

  const [enemyRef, api] = useCylinder(
    () => ({
      collisionFilterGroup: GROUP1,
      args: [3, 1, ENEMY_CYLINDER_HEIGHT, 6],
      mass: 1,
      position: position.current,
      onCollide: (e) => {
        if (
          // ignore if first boomerang is held
          status === "held" ||
          theyDroppedItems ||
          invulnerable
        ) {
          return;
        }
        // when the boomerang+enemy collide, subtract some hp
        const isCollisionWithBoomerang = e.body.name.includes(BOOMERANG_NAME);
        // const isCollisionWithGround = e.body.name === GROUND_NAME;

        // subtract some hp when they hit the boomerang
        if (isCollisionWithBoomerang) {
          const nextHealth = Math.max(
            0,
            health -
              BOOMERANG_BASE_DAMAGE *
                (1 + Math.random() * 0.5) *
                (poweredUp ? 2 : 1)
          );
          setHealth(nextHealth);
          const didTheyDied = nextHealth === 0;
          if (didTheyDied) {
            setTheyDied(true);
          }
          const shouldDropItems = didTheyDied;

          if (shouldDropItems) {
            setTheyDroppedItems(true);
            const mPosition: [number, number, number] = [
              position.current[0] + Math.random() - 0.5,
              position.current[1] + Math.random() - 0.5,
              position.current[2] + Math.random() - 0.5,
            ];
            const newMoney = {
              position: mPosition,
              type: ITEM_TYPES.MONEY,
            };
            setDroppedItems((p) => [...p, newMoney]);

            const powerup = Math.random() > 1 - POWERUP_PROBABILITY;
            if (powerup) {
              const pPosition: [number, number, number] = [
                position.current[0] + Math.random() - 0.5,
                position.current[1] + Math.random() - 0.5,
                position.current[2] + Math.random() - 0.5,
              ];
              const newPowerup = {
                position: pPosition,
                type: ITEM_TYPES.POWERUP,
              };
              setDroppedItems((p) => [...p, newPowerup]);
            }

            const rangeUp = Math.random() > 1 - RANGEUP_PROBABILITY;
            if (rangeUp) {
              const rPosition: [number, number, number] = [
                position.current[0] + Math.random() - 0.5,
                position.current[1] + Math.random() - 0.5,
                position.current[2] + Math.random() - 0.5,
              ];
              const newPowerup = {
                position: rPosition,
                type: ITEM_TYPES.RANGEUP,
              };
              setDroppedItems((p) => [...p, newPowerup]);
            }

            const droppedBoomerang =
              heldBoomerangs.length < MAX_BOOMERANGS &&
              Math.random() > 1 - DROPPED_BOOMERANG_PROBABILITY;
            console.log(
              "🌟🚨 ~ file: Enemy.tsx ~ line 179 ~ heldBoomerangs",
              heldBoomerangs
            );
            if (droppedBoomerang) {
              const rPosition: [number, number, number] = [
                position.current[0] + Math.random() - 0.5,
                position.current[1] + Math.random() - 0.5,
                position.current[2] + Math.random() - 0.5,
              ];
              const newBoomerang = {
                position: rPosition,
                type: ITEM_TYPES.BOOMERANG,
              };
              setDroppedItems((p) => [...p, newBoomerang]);
            }
          }
        }
      },
      material: {
        restitution: theyreDead ? 1 : 0,
        friction: theyreDead ? 0 : 100,
      },
    }),
    null,
    [status, heldBoomerangs, theyDroppedItems, poweredUp, health]
  );

  // movement: move towards player
  useFrame(() => {
    if (!position.current || theyreDead) return;
    // random walk
    const randomX = Math.random() * 2 - 1;
    const randomZ = Math.random() * 2 - 0.5;

    const directionX = Math.random() > 0.5 ? 1 : -1;
    const directionZ = Math.random() > 0.2 ? 1 : -1;

    const [x, y, z] = [
      position.current[0],
      ENEMY_CYLINDER_HEIGHT / 2 + 1,
      position.current[2],
    ];

    // TODO: use applyForce

    const [fx, fy, fz] = [
      Math.random() > 0.7 ? ENEMY_JITTER_SPEED * randomX * directionX : 0,
      1,
      Math.random() > 0.4 ? ENEMY_JITTER_SPEED * randomZ * directionZ : 0,
    ];

    // const x2Lerp = THREE.MathUtils.lerp(x, fx, 0.1);
    // const y2Lerp = THREE.MathUtils.lerp(y, fy, 0.1);
    // const z2Lerp = THREE.MathUtils.lerp(z, fz, 0.1);

    api.applyForce([fx, fy, fz], [x, y, z]);
    // api.position.set(x2Lerp, y2Lerp, z2Lerp);
    // api.position.set(x2Lerp, y2Lerp, z2Lerp);
    api.rotation.set(0, 0, 0);
  });

  // when they die, apply a force to the enemy to make it fall
  useEffect(() => {
    if (theyDied && !theyreDead) {
      const worldPoint: [number, number, number] = [
        position.current[0],
        position.current[1] - ENEMY_CYLINDER_HEIGHT / 2,
        position.current[2],
      ];
      const kickIntoSpace: [number, number, number] = [0, -10, 0];
      api.applyImpulse(kickIntoSpace, worldPoint);
      setTheyreDead(true);
      setTimeout(() => {
        unmountEnemy();
      }, UNMOUNT_DELAY);
    }
  }, [theyDied]);

  return { enemyRef, api };
}
