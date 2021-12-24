import { useEffect, useState } from "react";
import { useWindowSize } from "react-use";
import { CanvasAndScene } from "./CanvasAndScene";
import HUD from "./components/HUD/HUD";

function App() {
  const { width, height } = useWindowSize();
  // to prevent dragging up/down the address bar on mobile browsers,
  // record the lowest height it's ever been
  // const [lowestHeight, setLowestHeight] = useState(height);
  // useEffect(() => {
  //   if (height < lowestHeight) {
  //     setLowestHeight(height);
  //   }
  // }, [height, lowestHeight]);

  return (
    <div style={{ width, height }}>
      <CanvasAndScene />
      <HUD />
    </div>
  );
}

export default App;
