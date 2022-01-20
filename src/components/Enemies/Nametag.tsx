import { Billboard, Html } from "@react-three/drei";

export function Nametag({ name, url, translateY }) {
  return (
    <group position={[0, translateY, 0]}>
      <Billboard>
        <Html
          style={{
            fontSize: "1.2rem",
            width: "fit-content",
            textAlign: "center",
            whiteSpace: "nowrap",
            display: "flex",
            justifyContent: "center",
            transform: "translateX(-50%)",
          }}
        >
          <a
            style={{
              color: "white",
              cursor: "pointer",
              textDecoration: "none",
            }}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {name}
          </a>
        </Html>
      </Billboard>
    </group>
  );
}
