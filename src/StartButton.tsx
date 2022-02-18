import { Button } from "@mui/material";
import { Fullscreen } from "@mui/icons-material";

export function StartButton({ handleStart }) {
  return process.env.NODE_ENV === "development" ? null : (
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
        pointerEvents: "none",
      }}
    >
      <Button
        onClick={handleStart}
        style={{
          pointerEvents: "auto",
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
