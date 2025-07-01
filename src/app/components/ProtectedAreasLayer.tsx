import { useEffect, useState, useMemo } from "react";
import { GeoJSON, Popup } from "react-leaflet";
import { LatLngBounds } from "leaflet";
import type { Geometry } from "geojson";
import ProtectedAreaPopup from "./ProtectedAreaPopup";
import MapLoader from "./MapLoader";

interface ProtectedAreaFeature {
  type: "Feature";
  geometry: Geometry;
  properties: Record<string, unknown>;
  id?: string | number;
}

interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: ProtectedAreaFeature[];
}

interface ProtectedAreasLayerProps {
  bounds: LatLngBounds | null;
}

export default function ProtectedAreasLayer({
  bounds,
}: ProtectedAreasLayerProps) {
  const [areas, setAreas] = useState<ProtectedAreaFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [lastBounds, setLastBounds] = useState<LatLngBounds | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/protected-areas")
      .then((res) => res.json())
      .then((data: GeoJSONFeatureCollection) => setAreas(data.features || []))
      .finally(() => setLoading(false));
  }, []);

  // Helper to check if a polygon/multipolygon is in bounds
  function isInBounds(geometry: Geometry): boolean {
    if (!bounds) return true;
    if (geometry.type === "Polygon") {
      return geometry.coordinates.some((ring: any) =>
        ring.some((coord: [number, number]) =>
          bounds.contains([coord[1], coord[0]])
        )
      );
    }
    if (geometry.type === "MultiPolygon") {
      return geometry.coordinates.some((polygon: any) =>
        polygon.some((ring: any) =>
          ring.some((coord: [number, number]) =>
            bounds.contains([coord[1], coord[0]])
          )
        )
      );
    }
    return false;
  }

  // Filtering logic with loader
  const filtered = useMemo(() => {
    if (loading) return [];
    setFiltering(true);
    const result = bounds ? areas.filter((f) => isInBounds(f.geometry)) : areas;
    // Show loader for at least 150ms for UX clarity
    setTimeout(() => setFiltering(false), 150);
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areas, bounds, loading]);

  return (
    <>
      {(loading || filtering) && <MapLoader />}
      {loading
        ? null
        : filtered.map((feature, idx) =>
            feature.geometry.type === "Polygon" ||
            feature.geometry.type === "MultiPolygon" ? (
              <GeoJSON
                key={feature.id || idx}
                data={feature.geometry as Geometry}
                style={{ color: "#3388ff", weight: 2, fillOpacity: 0.2 }}
              >
                <Popup>
                  <ProtectedAreaPopup properties={feature.properties} />
                </Popup>
              </GeoJSON>
            ) : null
          )}
    </>
  );
}
