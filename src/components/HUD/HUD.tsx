import { Controls } from "../../Controls";
import { PlayerHPBar } from "./PlayerHPBar";
import { Score } from "./Score";

/** components overlaid on top of the 3d canvas */
const HUD = () => {
  return (
    <>
      <Controls />
      <PlayerHPBar />
      <Score />
    </>
  );
};

export default HUD;
