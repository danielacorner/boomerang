import { Debug } from "@react-three/cannon";
import { ToggleButton } from "@mui/material";
import { Portal } from "@mui/base";
import { Html } from "@react-three/drei";
import { useIsDev } from "./store";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const isDebugModeAtom = atomWithStorage(
  "isDebugMode",
  process.env.NODE_ENV === "development"
);
export const useIsDebugMode = () => useAtom(isDebugModeAtom);
export function DebugMode({ children }) {
  const [isOn, setIsOn] = useIsDebugMode();
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
            style={{
              textTransform: "none",
              position: "fixed",
              bottom: 64,
              left: 64,
            }}
          >
            {isOn ? "❌ Debug off" : "Debug mode 🐛"}
          </ToggleButton>
        </Portal>
      </Html>
      {isOn ? (
        <Debug>
          <color attach="background" args={["white"]} />
          {children}
        </Debug>
      ) : (
        children
      )}
    </>
  );
}
