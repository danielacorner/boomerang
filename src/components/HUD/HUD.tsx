import { Controls } from "../../Controls";
import { PlayerHPBar } from "./PlayerHPBar";
import { MoneyIndicator } from "./MoneyIndicator";
import { BoomerangsIndicator } from "./BoomerangsIndicator";
import { AudioSoundButton } from "./AudioSoundButton";
import { Fade, IconButton, Paper } from "@mui/material";
import { ClickAwayListener } from "@mui/base";
import { InfoOutlined } from "@mui/icons-material";
import { useState } from "react";

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
        <Info />
      </div>
    </>
  );
};

export default HUD;

/** displays accreditations for models used */
function Info() {
  const [open, setOpen] = useState(false);
  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <>
        <div
          style={{
            pointerEvents: "auto",
            position: "absolute",
            bottom: 0,
            left: 0,
            zIndex: 1000,
          }}
        >
          <IconButton onClick={() => setOpen(true)}>
            <InfoOutlined />
          </IconButton>
        </div>
        <div style={{ position: "fixed", bottom: 16, left: 16, zIndex: 1000 }}>
          <Fade in={open}>
            <Paper>
              <h1>Credits</h1>
              <p>All models licensed under Creative Commons Attribution</p>
              <p>
                <a href="https://sketchfab.com/3d-models/wizard-cat-42cc473a1c17467c8f96e47e2a4439de">
                  Wizard Cat
                </a>
                by
                <a href="">Cass Cole</a>
              </p>
              <p>
                <a href="https://sketchfab.com/3d-models/wizard-cat-42cc473a1c17467c8f96e47e2a4439de">
                  Zelda Ocarina of Time Boomerang by
                </a>
                by
                <a href="https://sketchfab.com/marvelmaster">marvelmaster</a>
              </p>
            </Paper>
          </Fade>
        </div>
      </>
    </ClickAwayListener>
  );
}
