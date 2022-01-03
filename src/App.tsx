import { useMediaQuery } from "@mui/material";

import { useEffect, useRef, useState } from "react";
import { useFullscreen, useToggle, useWindowSize } from "react-use";
import { CanvasAndScene } from "./CanvasAndScene";
import HUD from "./components/HUD/HUD";
import { StartButton } from "./StartButton";

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

  const isTabletOrLarger = useMediaQuery(`(min-width: ${768}px)`);

  return (
    <div ref={ref} style={{ width, height: lowestHeight, overflow: "hidden" }}>
      {!isTabletOrLarger && !isFullscreen && (
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
