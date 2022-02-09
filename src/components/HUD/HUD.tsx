import { Controls } from "../../Controls";
import styled from "styled-components";
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
      <div
        style={{
          pointerEvents: "auto",
          position: "absolute",
          bottom: 8,
          left: 8,

          zIndex: 1000,
        }}
      >
        <IconButton onClick={() => setOpen(true)}>
          <InfoOutlined style={{ color: "white", opacity: 0.5 }} />
        </IconButton>
        <Fade style={{ position: "absolute", left: 16, bottom: 16 }} in={open}>
          <CreditsStyledPaper>
            <h1>
              <span style={{ fontSize: "0.8em" }}>🏆</span> Credits
            </h1>
            <p style={{ fontSize: "0.8em", opacity: 0.5 }}>
              All models licensed under Creative Commons Attribution
            </p>
            <p>
              <a href="https://sketchfab.com/3d-models/wizard-cat-42cc473a1c17467c8f96e47e2a4439de">
                Wizard Cat
              </a>{" "}
              by <a href="">Cass Cole</a>
            </p>
            <p>
              <a href="https://sketchfab.com/3d-models/wizard-cat-42cc473a1c17467c8f96e47e2a4439de">
                Zelda Ocarina of Time Boomerang
              </a>{" "}
              by <a href="https://sketchfab.com/marvelmaster">marvelmaster</a>
            </p>
            <p>
              <a href="https://github.com/danielacorner/viruses">
                various virus models
              </a>{" "}
              from <a href="https://www.rcsb.org/">RCSB</a> by{" "}
              <a href="https://github.com/danielacorner">danielacorner</a>{" "}
              {`(that's me!)`}
            </p>
          </CreditsStyledPaper>
        </Fade>
      </div>
    </ClickAwayListener>
  );
}

const CreditsStyledPaper = styled(Paper)`
  width: 400px;
  opacity: 0.9;
  background: #212121;
  color: white;
  padding: 0.5em 1em;
  border: 1px solid #414141;
  border-radius: 16px;
  h1 {
    margin: 0 0 0.25em;
  }
  p {
    margin-top: 0;
  }
  a {
    color: #f1af4b;
  }
`;
