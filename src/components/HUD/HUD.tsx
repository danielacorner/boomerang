import { Controls } from "../../Controls";
import { PlayerHPBar } from "./PlayerHPBar";
import { MoneyIndicator } from "./MoneyIndicator";
import { BoomerangsIndicator } from "./BoomerangsIndicator";

/** components overlaid on top of the 3d canvas */
const HUD = () => {
  return (
    <>
      <Controls />
      <div style={{ pointerEvents: "none" }}>
        <PlayerHPBar />
        <MoneyIndicator />
        <BoomerangsIndicator />
      </div>
    </>
  );
};

export default HUD;
