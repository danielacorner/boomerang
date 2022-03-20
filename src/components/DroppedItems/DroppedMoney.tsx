import { useEffect, useRef, useState } from "react";
import MoneyBag from "../GLTFs/MoneyBag";
import { useMount } from "react-use";
import { useCylinder } from "@react-three/cannon";
import { useMoney, usePlayerState } from "../../store";
import { useFrame } from "@react-three/fiber";
import { animated, useSpring } from "@react-spring/three";
import { BOOMERANG_NAME, GROUP_1, ITEM_TYPES } from "../../utils/constants";

const BAG_RADIUS = 1;

// const BAG_INVULNERABLE_DURATION = 2 * 1000;

export function DroppedMoney({ position, setMounted, id }) {
  const [interactive, setInteractive] = useState(true);
  // useMount(() => {
  //   setTimeout(() => {
  //     setInteractive(true);
  //   }, BAG_INVULNERABLE_DURATION);
  // });

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

  const [, setMoney] = useMoney();

  const [ref, api] = useCylinder(
    () => ({
      // collisionFilterGroup: GROUP1,
      // collisionResponse: 0, // ? don't push back on collisions
      args: [1, 1, BAG_RADIUS, 6],
      mass: 1,
      type: "Dynamic",
      // type: interactive ? "Dynamic" : "Kinematic",
      position,
      onCollide: (e) => {
        // when the player touches it, gain +1 money
        if (e.body?.name === "player" && collectedStatus === "uncollected") {
          setMoney((p) => p + 1);
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
    [interactive]
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
  });

  // pull the bag towards the player
  const [{ playerPosition }] = usePlayerState();
  useFrame(() => {
    if (!ref.current || !playerPosition) return;
    const direction = [
      playerPosition[0] - ref.current.position.x,
      playerPosition[1] - ref.current.position.y,
      playerPosition[2] - ref.current.position.z,
    ];
    const distance = Math.sqrt(
      direction[0] * direction[0] +
        direction[1] * direction[1] +
        direction[2] * direction[2]
    );
    const force: [number, number, number] = [
      (direction[0] / distance) * 2,
      0,
      (direction[2] / distance) * 2,
    ];
    api.applyForce(force, position);
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
    <animated.mesh ref={ref} name={ITEM_TYPES.MONEY}>
      <animated.mesh
        scale={scaleAnimated}
        material-transparent={true}
        material-opacity={opacity}
        position={[0, -4, 0]}
      >
        <MoneyBag
          fadeOut={["collected", "unmounting"].includes(collectedStatus)}
        />
      </animated.mesh>
    </animated.mesh>
  );
}
