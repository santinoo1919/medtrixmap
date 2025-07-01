export interface WFSFeature {
  id: string;
  geometry: GeoJSON.Geometry;
  properties: Record<string, any>;
}

export async function fetchWFSWrecks(): Promise<WFSFeature[]> {
  const res = await fetch("/api/wrecks");
  if (!res.ok) throw new Error("Failed to fetch WFS data");
  const data = await res.json();
  return data.features.map((f: any) => ({
    id: f.id,
    geometry: f.geometry,
    properties: f.properties,
  }));
}

export async function fetchWFSProtectedAreas(): Promise<WFSFeature[]> {
  const res = await fetch("/api/protected-areas");
  if (!res.ok) throw new Error("Failed to fetch protected areas");
  const data = await res.json();
  return data.features.map((f: any) => ({
    id: f.id,
    geometry: f.geometry,
    properties: f.properties,
  }));
}
