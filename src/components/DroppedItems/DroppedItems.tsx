import { DroppedMoney } from "./DroppedMoney";
import { useDroppedMoneyPositions, usePowerupPositions } from "../../store";
import { DroppedPowerup } from "./DroppedPowerup";
import React from "react";
import { useMount } from "react-use";

export function DroppedItems() {
  const [droppedMoneyPositions] = useDroppedMoneyPositions();
  const [powerupPositions] = usePowerupPositions();
  return (
    <>
      {droppedMoneyPositions.map(({ position }) => (
        <React.Fragment key={JSON.stringify(position)}>
          <DroppedMoney {...{ position }} />
        </React.Fragment>
      ))}
      {powerupPositions.map(({ position }) => (
        <React.Fragment key={JSON.stringify(position)}>
          <DroppedPowerup {...{ position }} />
        </React.Fragment>
      ))}
    </>
  );
}
