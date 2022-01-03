import { Joystick } from "./components/Joystick/Joystick";
import { useMediaQuery } from "@mui/material";

export function Controls() {
  const isTouchDevice = useMediaQuery(`(max-width: ${768}px)`);

  return <>{isTouchDevice ? <Joystick /> : null}</>;
}
