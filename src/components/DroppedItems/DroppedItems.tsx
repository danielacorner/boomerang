import { DroppedMoney } from "./DroppedMoney";
import { ITEM_TYPES, useDroppedItems } from "../../store";
import { DroppedPowerup } from "./DroppedPowerup";
import React from "react";
import { DroppedRangeup } from "./DroppedRangeup";
import { DroppedBoomerang } from "./DroppedBoomerang";

export function DroppedItems() {
  const [droppedItems] = useDroppedItems();
  const droppedMoneyPositions = droppedItems.filter(
    ({ type }) => type === ITEM_TYPES.MONEY
  );
  const droppedPowerupPositions = droppedItems.filter(
    ({ type }) => type === ITEM_TYPES.POWERUP
  );
  const droppedRangeupPositions = droppedItems.filter(
    ({ type }) => type === ITEM_TYPES.RANGEUP
  );
  const droppedBoomerangPositions = droppedItems.filter(
    ({ type }) => type === ITEM_TYPES.BOOMERANG
  );
  return (
    <>
      {droppedMoneyPositions.map(({ position }) => (
        <React.Fragment key={JSON.stringify(position)}>
          <DroppedMoney {...{ position }} />
        </React.Fragment>
      ))}
      {droppedPowerupPositions.map(({ position }) => (
        <React.Fragment key={JSON.stringify(position)}>
          <DroppedPowerup {...{ position }} />
        </React.Fragment>
      ))}
      {droppedRangeupPositions.map(({ position }) => (
        <React.Fragment key={JSON.stringify(position)}>
          <DroppedRangeup {...{ position }} />
        </React.Fragment>
      ))}
      <DroppedRangeup {...{ position: [1, 1, 5] }} />
      {droppedBoomerangPositions.map(({ position }) => (
        <React.Fragment key={JSON.stringify(position)}>
          <DroppedBoomerang {...{ position }} />
        </React.Fragment>
      ))}
    </>
  );
}
