import { DroppedMoney } from "./DroppedMoney";
import { useDroppedItems } from "../../store";
import { DroppedPowerup } from "./DroppedPowerup";
import React from "react";
import { DroppedRangeup } from "./DroppedRangeup";
import { DroppedBoomerang } from "./DroppedBoomerang";
import { ITEM_TYPES } from "../../utils/constants";

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
      {droppedBoomerangPositions.map(({ position }) => (
        <React.Fragment key={JSON.stringify(position)}>
          <DroppedBoomerang {...{ position }} />
        </React.Fragment>
      ))}
      {process.env.NODE_ENV !== "production" && (
        <>
          <DroppedRangeup {...{ position: [5, 1, 5] }} />
          <DroppedPowerup {...{ position: [-5, 1, -5] }} />
        </>
      )}
    </>
  );
}
