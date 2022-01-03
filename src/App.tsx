import { Button } from "@mui/material";
import { Fullscreen } from "@mui/icons-material";

import { useEffect, useRef, useState } from "react";
import { useFullscreen, useToggle, useWindowSize } from "react-use";
import { CanvasAndScene } from "./CanvasAndScene";
import HUD from "./components/HUD/HUD";

function App() {
  const { width, height } = useWindowSize();
  // to prevent dragging up/down the address bar on mobile browsers,
  // record the lowest height it's ever been
  const [lowestHeight, setLowestHeight] = useState(height);
  useEffect(() => {
    if (height < lowestHeight) {
      setLowestHeight(height);
    }
  }, [height, lowestHeight]);

  const ref = useRef(null);
  const [show, toggle] = useToggle(false);
  const isFullscreen = useFullscreen(ref, show, {
    onClose: () => toggle(false),
  });

  return (
    <div ref={ref} style={{ width, height: lowestHeight, overflow: "hidden" }}>
      {!isFullscreen && (
        <StartButton
          handleStart={() => {
            toggle(true);
          }}
        />
      )}

      <CanvasAndScene />
      <HUD />
    </div>
  );
}

export default App;

function StartButton({ handleStart }) {
  return (
    <div
      style={{
        position: "fixed",
        zIndex: 999,
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        onClick={handleStart}
        style={{
          textTransform: "none",
        }}
        variant="contained"
        endIcon={<Fullscreen />}
      >
        Start
      </Button>
    </div>
  );
}
