import { useCylinder } from "@react-three/cannon";
import { useCallback, useRef } from "react";
import {
  PLAYER_NAME,
  BOOMERANG_ITEM_NAME,
  GROUP1,
  getAnimationDuration,
} from "../../utils/constants";
import BoomerangModel from "../GLTFs/BoomerangModel";
import {
  useDroppedItems,
  useGameStateRef,
  useHeldBoomerangs,
} from "../../store";
import { DroppedBoomerangPin } from "./DroppedBoomerangPin";
import { useIsDebugMode } from "../../DebugMode";
import { Float } from "@react-three/drei";

const BOOMERANG_ITEM_HEIGHT = 2;

export function DroppedBoomerang({ position, setMounted, id }) {
  const [, setDroppedItems] = useDroppedItems();
  const [, setHeldBoomerangs] = useHeldBoomerangs();
  const [gameStateRef] = useGameStateRef();
  const [isDebugMode] = useIsDebugMode();

  const onceRef = useRef(false);
  const unmountBoom = useCallback(() => {
    setDroppedItems((p) =>
      p.map((i) => (i.id === id ? { ...i, unmounted: true } : i))
    );
    setMounted(false);
  }, []);
  const [cylRef, api] = useCylinder(
    () => ({
      args: [2, 2, BOOMERANG_ITEM_HEIGHT, 6],
      mass: 200,
      position,
      rotation: [-0.36, -1.42, -0.13],
      collisionFilterGroup: GROUP1,
      onCollide: (e) => {
        const isCollisionWithPlayer = e.body && e.body.name === PLAYER_NAME;

        if (isCollisionWithPlayer && !onceRef.current) {
          onceRef.current = true;
          console.log("💥 oof a BOOMERANG", e);
          // console.log("COLLISION! with boomerang", e);
          const newBoomerang = {
            status: "held" as any,
            clickTargetPosition: null,
          };
          setHeldBoomerangs((p) => [...p, newBoomerang]);

          const isZeldaAnimation =
            gameStateRef.current.heldBoomerangs.length === 0 &&
            !gameStateRef.current.isAnimating;

          unmountBoom();

          if (isZeldaAnimation) {
            if (isDebugMode) {
              gameStateRef.current.levelStatus = "won";
            } else {
              gameStateRef.current.isAnimating = true;
              setTimeout(() => {
                gameStateRef.current.isAnimating = false;
                gameStateRef.current.levelStatus = "won";
                window.localStorage.setItem("firstVisit", "false");
              }, getAnimationDuration());
            }
          }

          gameStateRef.current.heldBoomerangs = [
            ...gameStateRef.current.heldBoomerangs,
            newBoomerang,
          ];
        }
      },
    }),
    null,
    [
      position,
      setDroppedItems,
      setHeldBoomerangs,
      gameStateRef,
      isDebugMode,
      unmountBoom,
    ]
  );
  const { x, y, z } = { x: 1.18, y: 0.79, z: -2 };

  return (
    <>
      {/* the pin stays at the initial height of the boomerang */}
      <mesh position={position}>
        <DroppedBoomerangPin />
      </mesh>
      <mesh ref={cylRef} name={BOOMERANG_ITEM_NAME}>
        <pointLight intensity={1} distance={8} position={[0, 2, 0]} />
        <Float rotationIntensity={x} floatIntensity={y} speed={z}>
          <BoomerangModel idx={null} isDroppedBoomerang={true} />
        </Float>
      </mesh>
    </>
  );
}
