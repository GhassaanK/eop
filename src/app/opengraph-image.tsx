import { ImageResponse } from "next/og";

export const alt = "Echo of Palestine. From solidarity to sustained action.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ background: "#F8F8F5", width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "70px 80px", color: "#09573D", justifyContent: "space-between" }}><div style={{ fontSize: 28, display: "flex" }}>Echo of Palestine</div><div style={{ fontSize: 78, lineHeight: 1.08, letterSpacing: "-3px", display: "flex", maxWidth: 900 }}>From Solidarity to Sustained Action.</div><div style={{ fontSize: 23, borderTop: "1px solid #E3E6E1", paddingTop: 25, display: "flex" }}>International Student Solidarity Movement for Palestine</div></div>, size);
}
