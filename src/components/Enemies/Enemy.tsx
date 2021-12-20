import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useCylinder } from "@react-three/cannon";
import {
  useBoomerangState,
  useDroppedMoneyPositions,
  usePlayerState,
  usePowerupPositions,
} from "../../store";
import { HpBar } from "./HpBar";
import { GROUND_NAME, BOOMERANG_NAME } from "../../utils/constants";
import { animated, useSpring } from "@react-spring/three";

const ENEMY_JITTER_SPEED = 2;
export const CYLINDER_HEIGHT = 4;
const BOOMERANG_DAMAGE = 0.5 + Math.random() * 0.2;
const UNMOUNT_DELAY = 2 * 1000;

const CEILING_HEIGHT = CYLINDER_HEIGHT * 4;

// set up collisions on its children
export function Enemy({ children, unmountEnemy }) {
  const { viewport } = useThree();
  const [healthPercent, setHealthPercent] = useState(1);
  const theyDied = healthPercent === 0;
  const [theyreDead, setTheyreDead] = useState(false);

  const position = useRef<[number, number, number]>([
    (viewport.width / 2) * (Math.random() * 2 - 1),
    CYLINDER_HEIGHT + 1,
    viewport.height / 2 + CYLINDER_HEIGHT,
  ]);
  useEffect(() => {
    const unsubscribe = api.position.subscribe((v) => (position.current = v));
    return unsubscribe;
  }, []);

  const { enemyRef, api } = useMoveEnemy({
    position,
    theyreDead,
    setHealthPercent,
  });

  // TODO: they gotta drop their moneys
  // when they die, spin around, drop their moneys
  useEffect(() => {
    if (theyDied && !theyreDead) {
      const worldPoint: [number, number, number] = [
        position.current[0],
        position.current[1] - CYLINDER_HEIGHT / 2,
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

  const { opacity } = useSpring({ opacity: theyreDead ? 0 : 1 });
  return (
    <>
      <animated.mesh
        material-transparent={true}
        material-opacity={opacity}
        ref={enemyRef}
      >
        {/* <meshBasicMaterial color={"#FFFFFF"} />
      <sphereBufferGeometry attach="geometry" args={[1, 32, 32]} /> */}
        {children}
        <HpBar healthPercent={healthPercent} />
      </animated.mesh>
    </>
  );
}

const POWERUP_PROBABILITY = 0.2;

function useMoveEnemy({ position, theyreDead, setHealthPercent }) {
  const [{ status }] = useBoomerangState();
  const [{ poweredUp }] = usePlayerState();
  const [theyDroppedItems, setTheyDroppedItems] = useState(false);
  const [, setDroppedMoneyPositions] = useDroppedMoneyPositions();
  const [, setPowerupPositions] = usePowerupPositions();
  const [enemyRef, api] = useCylinder(
    () => ({
      args: [3, 1, CYLINDER_HEIGHT, 6],
      mass: 1,
      position: position.current,
      onCollide: (e) => {
        if (status === "idle") return;
        // when the boomerang+enemy collide, subtract some hp
        const isCollisionWithBoomerang = e.body.name === BOOMERANG_NAME;
        const isCollisionWithGround = e.body.name === GROUND_NAME;

        setHealthPercent((prevHealthPct) => {
          const _theyDied = prevHealthPct === 0;
          // after they died, when they hit the ground again, they drop their moneys
          const shouldDropMoneys =
            _theyDied && isCollisionWithGround && !theyDroppedItems;
          if (shouldDropMoneys) {
            setTheyDroppedItems(true);
            const mPosition: [number, number, number] = [
              position.current[0] + Math.random() - 0.5,
              position.current[1] + Math.random() - 0.5,
              position.current[2] + Math.random() - 0.5,
            ];
            const newMoney = {
              position: mPosition,
              unmounted: false,
              unmount: () => {
                setDroppedMoneyPositions((prev) =>
                  prev.map((dmp) =>
                    dmp.position === mPosition
                      ? { ...dmp, unmounted: true }
                      : dmp
                  )
                );
              },
            };
            setDroppedMoneyPositions((p) => [...p, newMoney]);

            const powerup = Math.random() > 1 - POWERUP_PROBABILITY;
            if (powerup) {
              const pPosition: [number, number, number] = [
                position.current[0] + Math.random() - 0.5,
                position.current[1] + Math.random() - 0.5,
                position.current[2] + Math.random() - 0.5,
              ];
              const newPowerup = {
                position: pPosition,
                unmounted: false,
                unmount: () => {
                  setPowerupPositions((p) =>
                    p.map((pup) =>
                      pup.position === pPosition
                        ? { ...pup, unmounted: true }
                        : pup
                    )
                  );
                },
              };
              setPowerupPositions((p) => [...p, newPowerup]);
            }
          }

          // subtract some hp when they hit the boomerang
          if (isCollisionWithBoomerang) {
            const nextHealthPercent = Math.max(
              0,
              prevHealthPct - BOOMERANG_DAMAGE * (poweredUp ? 2 : 1)
            );
            return nextHealthPercent;
          }
          return prevHealthPct;
        });

        console.log("COLLISION", e);
      },
      material: {
        restitution: theyreDead ? 1 : 0,
        friction: theyreDead ? 0 : 100,
      },
    }),
    null,
    [status]
  );
  useFrame(() => {
    if (!position.current || theyreDead) return;
    // random walk
    const randomX = Math.random() * 2 - 1;
    const randomZ = Math.random() * 2 - 0.5;

    const directionX = Math.random() > 0.5 ? 1 : -1;
    const directionZ = Math.random() > 0.2 ? 1 : -1;

    const [x, y, z] = [
      position.current[0],
      CYLINDER_HEIGHT / 2 + 1,
      position.current[2],
    ];

    // TODO: use applyForce

    const [fx, fy, fz] = [
      x + (Math.random() > 0.7 ? ENEMY_JITTER_SPEED * randomX * directionX : 0),
      0,
      z + (Math.random() > 0.4 ? ENEMY_JITTER_SPEED * randomZ * directionZ : 0),
    ];

    const x2Lerp = THREE.MathUtils.lerp(x, fx, 0.1);
    const y2Lerp = THREE.MathUtils.lerp(y, fy, 0.1);
    const z2Lerp = THREE.MathUtils.lerp(z, fz, 0.1);

    api.applyForce([x2Lerp - x, y2Lerp - y, z2Lerp - z], [x, y, z]);
    // api.position.set(x2Lerp, y2Lerp, z2Lerp);
    // api.position.set(x2Lerp, y2Lerp, z2Lerp);
    api.rotation.set(0, 0, 0);
  });

  return { enemyRef, api };
}
