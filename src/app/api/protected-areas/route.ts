import { NextResponse } from "next/server";

// Minimal GeoJSON FeatureCollection type
interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    geometry: {
      type: string;
      coordinates: unknown;
    };
    properties: Record<string, unknown>;
    id?: string | number;
  }>;
}

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
    const data = (await res.json()) as GeoJSONFeatureCollection;
    return NextResponse.json(data);
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("WFS fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
