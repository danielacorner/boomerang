import { Debug } from "@react-three/cannon";
import { Portal, ToggleButton } from "@mui/material";
import { useState } from "react";
import { Html } from "@react-three/drei";

export function DebugMode({ children }) {
  const [isOn, setIsOn] = useState(process.env.NODE_ENV === "development");
  // const isDev = process.env.NODE_ENV === "development";
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
            onChange={() => setIsOn(!isOn)}
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
