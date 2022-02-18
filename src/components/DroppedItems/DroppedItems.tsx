import { DroppedMoney } from "./DroppedMoney";
import { DroppedHeart } from "./DroppedHeart";
import { DroppedItemType, useDroppedItems } from "../../store";
import { DroppedPowerup } from "./DroppedPowerup";
import React, { useRef, useState } from "react";
import { DroppedRangeup } from "./DroppedRangeup";
import { DroppedBoomerang } from "./DroppedBoomerang";
import { ITEM_TYPES } from "../../utils/constants";
import { useMount } from "react-use";
import { Float } from "@react-three/drei";

export function DroppedItems() {
  const [droppedItems] = useDroppedItems();

  return (
    <>
      {droppedItems.map((item) => (
        <DroppedItem key={item.id} {...item} />
      ))}
    </>
  );
}

const ITEM_TYPES_COMPONENTS: {
  [itemType: string]: ({
    position,
    setMounted,
    id,
  }: {
    position: [number, number, number];
    setMounted: (mounted: boolean) => void;
    id: string;
  }) => JSX.Element;
} = {
  [ITEM_TYPES.MONEY]: DroppedMoney,
  [ITEM_TYPES.POWERUP]: DroppedPowerup,
  [ITEM_TYPES.RANGEUP]: DroppedRangeup,
  [ITEM_TYPES.BOOMERANG]: DroppedBoomerang,
};
const ITEM_TYPES_UNMOUNT_DELAYS = {
  [ITEM_TYPES.MONEY]: null,
  [ITEM_TYPES.POWERUP]: null,
  [ITEM_TYPES.RANGEUP]: null,
  // [ITEM_TYPES.MONEY]: 16 * 1000,
  // [ITEM_TYPES.POWERUP]: 16 * 1000,
  // [ITEM_TYPES.RANGEUP]: 16 * 1000,
  [ITEM_TYPES.BOOMERANG]: null,
};

function DroppedItem({ id, position, type, unmounted }: DroppedItemType) {
  if (!ITEM_TYPES_COMPONENTS[type]) {
    console.log(
      "🌟🚨🚨🚨🚨 ~ file: DroppedItems.tsx ~ line 53 ~ DroppedItem ~ type",
      type
    );
    return null;
  }
  const Component = (p) => ITEM_TYPES_COMPONENTS[type](p);
  const [mounted, setMounted] = useState(!unmounted);
  const timerRef = useRef<number>(0);
  useMount(() => {
    if (!ITEM_TYPES_UNMOUNT_DELAYS[type]) {
      return;
    }
    timerRef.current = window.setTimeout(() => {
      setMounted(false);
    }, ITEM_TYPES_UNMOUNT_DELAYS[type]);
  });
  const [, setDroppedItems] = useDroppedItems();

  return mounted ? (
    <Float
      speed={4}
      rotationIntensity={0.5} // XYZ rotation intensity, defaults to 1
      floatIntensity={0.5} // Up/down float intensity, defaults to 1
    >
      <Component
        {...{
          position,
          setMounted: (m) => {
            setMounted(m);
            if (!m) {
              setDroppedItems((p) => p.filter((i) => i.id !== id));
              if (timerRef.current) {
                window.clearTimeout(timerRef.current);
              }
            }
          },
          id,
        }}
      />
    </Float>
  ) : null;
}
