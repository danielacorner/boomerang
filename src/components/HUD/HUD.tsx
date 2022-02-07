import { Controls } from "../../Controls";
import { PlayerHPBar } from "./PlayerHPBar";
import { MoneyIndicator } from "./MoneyIndicator";
import { BoomerangsIndicator } from "./BoomerangsIndicator";
import { AudioSoundButton } from "./AudioSoundButton";

/** components overlaid on top of the 3d canvas */
const HUD = () => {
  return (
    <>
      <Controls />
      <div style={{ pointerEvents: "none" }}>
        <PlayerHPBar />
        <MoneyIndicator />
        <BoomerangsIndicator />
        <AudioSoundButton
          href={"https://www.youtube.com/watch?v=D4MdHQOILdw"}
          title={"Anjunadeep Radio • Live 24/7"}
        />
      </div>
    </>
  );
};

export default HUD;
