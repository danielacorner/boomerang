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
      {droppedMoneyPositions.map(({ position, unmounted, unmount }) => (
        <React.Fragment key={JSON.stringify(position)}>
          <UnmountHandler {...{ unmount }} />
          {unmounted ? null : <DroppedMoney {...{ position }} />}
        </React.Fragment>
      ))}
      {powerupPositions.map(({ position, unmounted, unmount }) => (
        <React.Fragment key={JSON.stringify(position)}>
          <UnmountHandler {...{ unmount }} />
          {unmounted ? null : <DroppedPowerup {...{ position }} />}
        </React.Fragment>
      ))}
    </>
  );
}

const UNMOUNT_DELAY = 3 * 1000;
function UnmountHandler({ unmount }) {
  useMount(() => {
    setTimeout(unmount, UNMOUNT_DELAY);
  });
  return null;
}
