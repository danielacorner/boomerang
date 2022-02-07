import { Debug } from "@react-three/cannon";
import { ToggleButton } from "@mui/material";
import { Portal } from "@mui/base";
import { Html } from "@react-three/drei";
import { useIsDev } from "./store";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const isDevModeAtom = atomWithStorage(
  "isDevMode",
  process.env.NODE_ENV === "development"
);
export function DebugMode({ children }) {
  // const [isOn, setIsOn] = useState(false);
  const [isOn, setIsOn] = useAtom(isDevModeAtom);
  // const isDev = process.env.NODE_ENV === "development";
  const [, setIsDev] = useIsDev();

  return (
    <>
      <Html
        style={{
          zIndex: 1,
        }}
      >
        <Portal>
          <ToggleButton
            value="check"
            selected={isOn}
            onChange={() => {
              setIsOn(!isOn);
              setIsDev(!isOn);
            }}
            style={{ textTransform: "none", position: "fixed", bottom: 0 }}
          >
            {isOn ? "❌ Debug off" : "Debug mode 🐛"}
          </ToggleButton>
        </Portal>
      </Html>
      {isOn ? <Debug>{children}</Debug> : children}
    </>
  );
}
