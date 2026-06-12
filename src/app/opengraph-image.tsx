import { ImageResponse } from "next/og";

export const alt =
  "Maher Fayad | Senior Product Designer (UX/UI, Design Systems)";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#000",
          color: "#c5c5c5",
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 30, fontWeight: 700, color: "#fff", letterSpacing: -1 }}>
            Maher Fayad
          </span>
          <span style={{ fontSize: 18, textTransform: "uppercase", color: "#7a7a7a" }}>
            Riyadh / Remote · AR / EN
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 52 }}>
          <div
            style={{
              width: 170,
              height: 170,
              borderRadius: 9999,
              border: "14px solid transparent",
              borderTopColor: "#2b6df0",
              borderRightColor: "#38bdf8",
              borderBottomColor: "#4ade80",
              transform: "rotate(-30deg)",
              display: "flex",
              flexShrink: 0,
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 62, fontWeight: 700, color: "#fff", letterSpacing: -3 }}>
              Senior Product Designer
            </span>
            <span style={{ fontSize: 28, marginTop: 14, color: "#c5c5c5" }}>
              UX/UI · Design Systems
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 44, fontSize: 24, color: "#9a9a9a" }}>
          <span>+47% account openings</span>
          <span>+81% transactions</span>
          <span>50+ projects</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
