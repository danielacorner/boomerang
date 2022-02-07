import { useEffect, useRef, useState } from "react";
import MoneyBag from "../GLTFs/MoneyBag";
import { useMount } from "react-use";
import { useCylinder } from "@react-three/cannon";
import {
  useGameState,
  useGameStateRef,
  useMoney,
  usePlayerState,
} from "../../store";
import { useFrame } from "@react-three/fiber";
import { animated, useSpring } from "@react-spring/three";
import { BOOMERANG_NAME, GROUP1, ITEM_TYPES } from "../../utils/constants";
import { Html } from "@react-three/drei";
import HeartModel from "../GLTFs/HeartModel";

const BAG_RADIUS = 1;
const UNMOUNT_DELAY = 16 * 1000;

const BAG_INVULNERABLE_DURATION = 2 * 1000;
export function DroppedHeart({ position }) {
  return (
    <group>
      <Bag {...{ position }} />
    </group>
  );
}

function Bag({ position }) {
  const [mounted, setMounted] = useState(true);

  return mounted ? <BagContent {...{ position, setMounted }} /> : null;
}
function BagContent({ position, setMounted }) {
  const [interactive, setInteractive] = useState(false);
  useMount(() => {
    setTimeout(() => {
      setInteractive(true);
    }, BAG_INVULNERABLE_DURATION);
  });

  const [collectedStatus, setCollectedStatus] = useState<
    "uncollected" | "collected" | "unmounting"
  >("uncollected");
  const [{ opacity, scaleAnimated }] = useSpring(
    {
      scaleAnimated: collectedStatus === "collected" ? 1.5 : 1,
      opacity: ["collected", "unmounting"].includes(collectedStatus) ? 0 : 1,
    },
    [collectedStatus]
  );

  // const [, setGameState] = useGameState();
  const [gameStateRef] = useGameStateRef();

  const onceRef = useRef(false);

  const [ref, api] = useCylinder(
    () => ({
      collisionFilterGroup: GROUP1,
      collisionResponse: 0, // ? don't push back on collisions
      args: [1, 1, BAG_RADIUS, 6],
      mass: 1,
      type: interactive ? "Dynamic" : "Static",
      position,
      onCollide: (e) => {
        // when the player touches it, gain +1 money
        if (
          e.body?.name === "player" &&
          collectedStatus === "uncollected" &&
          !onceRef.current
        ) {
          onceRef.current = true;
          console.log("💥 oof a HEART");
          gameStateRef.current = {
            ...gameStateRef.current,
            maxHitpoints: gameStateRef.current.maxHitpoints + 1,
            hitpoints: gameStateRef.current.hitpoints + 1,
          };
          // setGameState((p) => ({
          // 	...p,
          // 	maxHitpoints: p.maxHitpoints + 1,
          // 	hitpoints: p.hitpoints + 1,
          // }));
          setCollectedStatus("collected");
          setTimeout(() => {
            setMounted(false);
          }, 1000);
        }

        if (e.body?.name.includes(BOOMERANG_NAME) && interactive) {
          setMounted(false);
        }
      },
    }),
    null,
    [interactive, collectedStatus]
  );

  useMount(() => {
    if (!ref.current) {
      return;
    }
    const worldPoint: [number, number, number] = [
      ref.current.position.x,
      ref.current.position.y - BAG_RADIUS / 2,
      ref.current.position.z,
    ];
    const kickUp: [number, number, number] = [
      Math.random() * 0.5 - 0.25,
      Math.random() * -1,
      Math.random() * 0.5 - 0.25,
    ];

    api.applyImpulse(kickUp, worldPoint);

    // 1s before unmount, fade out
    setTimeout(() => {
      setCollectedStatus("unmounting");
    }, UNMOUNT_DELAY - 1000);

    // unmount after the delay
    setTimeout(() => setMounted(false), UNMOUNT_DELAY);
  });

  // limit the angular velocity
  const angularVelocity = useRef<[number, number, number]>([0, 0, 0]);
  useEffect(() => {
    const unsubscribe = api.angularVelocity.subscribe(
      (v) => (angularVelocity.current = v)
    );
    return unsubscribe;
  }, []);
  useFrame(() => {
    if (!ref.current) return;
    const MAX_ANGULAR_VELOCITY = 1;
    let changed = false;
    const [x, y, z] = angularVelocity.current;
    if (Math.abs(x) > MAX_ANGULAR_VELOCITY) {
      angularVelocity.current[0] = Math.sign(x) * MAX_ANGULAR_VELOCITY;
      changed = true;
    }
    if (Math.abs(y) > MAX_ANGULAR_VELOCITY) {
      angularVelocity.current[1] = Math.sign(y) * MAX_ANGULAR_VELOCITY;
      changed = true;
    }
    if (Math.abs(z) > MAX_ANGULAR_VELOCITY) {
      angularVelocity.current[2] = Math.sign(z) * MAX_ANGULAR_VELOCITY;
      changed = true;
    }
    if (changed) {
      api.angularVelocity.set(...angularVelocity.current);
    }
  });

  return (
    <animated.mesh ref={ref} name={ITEM_TYPES.HEART}>
      <animated.mesh
        scale={scaleAnimated}
        material-transparent={true}
        material-opacity={opacity}
        position={[0, -4, 0]}
      >
        <HeartModel />
      </animated.mesh>
    </animated.mesh>
  );
}
