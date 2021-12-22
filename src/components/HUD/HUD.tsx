import { Controls } from "../../Controls";
import { Score } from "./Score";

/** components overlaid on top of the 3d canvas */
const HUD = () => {
  return (
    <>
      <Controls />
      <Score />
    </>
  );
};

export default HUD;
