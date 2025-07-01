import { NextResponse } from "next/server";

export async function GET() {
  const url =
    "https://wxs.ofb.fr/geoserver/gestion/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=gestion:ges_omon_amp_ofb_pol_3857_vue&outputFormat=application/json&srsName=EPSG:4326&count=10";
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      console.error("WFS fetch failed:", res.status, text);
      return NextResponse.json(
        {
          error: "Failed to fetch protected areas",
          status: res.status,
          details: text,
        },
        { status: 500 }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("WFS fetch error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
