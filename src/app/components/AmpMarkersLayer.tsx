import { useEffect, useState, useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import L, { LatLngBounds } from "leaflet";
import MapLoader from "./MapLoader";

interface AmpFeature {
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: {
    title?: string;
    header_text?: string;
    description?: string;
    url?: string;
    amp_name?: string;
    [key: string]: unknown;
  };
}

interface AmpMarkersLayerProps {
  bounds: LatLngBounds | null;
}

const AMP_GEOJSON_URL =
  "https://www.amp.milieumarinfrance.fr/api/1/98/31/get_amp_geojson";

export default function AmpMarkersLayer({ bounds }: AmpMarkersLayerProps) {
  const [features, setFeatures] = useState<AmpFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(AMP_GEOJSON_URL)
      .then((res) => res.json())
      .then((data) => setFeatures(data.features || []))
      .finally(() => setLoading(false));
  }, []);

  const markerIcon = L.icon({
    iconUrl: "/marker-icon.png",
    shadowUrl: "/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // Filtering logic with loader
  const filtered = useMemo(() => {
    if (loading) return [];
    setFiltering(true);
    const result = bounds
      ? features.filter((feature) => {
          const coords = feature.geometry?.coordinates;
          if (!coords) return false;
          const [lng, lat] = coords;
          return bounds.contains([lat, lng]);
        })
      : features;
    setTimeout(() => setFiltering(false), 150);
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [features, bounds, loading]);

  return (
    <>
      {(loading || filtering) && <MapLoader />}
      {loading
        ? null
        : filtered.map((feature: AmpFeature, idx: number) => {
            const coords = feature.geometry?.coordinates;
            if (!coords) return null;
            const [lng, lat] = coords;
            const props = feature.properties || {};
            return (
              <Marker key={idx} position={[lat, lng]} icon={markerIcon}>
                <Popup>
                  <div style={{ minWidth: 220, maxWidth: 320 }}>
                    {props.title && (
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: 16,
                          marginBottom: 4,
                        }}
                      >
                        {props.title as string}
                      </div>
                    )}
                    {props.header_text && (
                      <div
                        style={{
                          fontSize: 13,
                          color: "#2563eb",
                          marginBottom: 4,
                        }}
                      >
                        {props.header_text as string}
                      </div>
                    )}
                    {props.description && (
                      <div
                        style={{ fontSize: 13, color: "#444", marginBottom: 4 }}
                      >
                        {props.description as string}
                      </div>
                    )}
                    {props.url && (
                      <img
                        src={props.url as string}
                        alt={(props.title as string) || ""}
                        style={{ width: "100%", borderRadius: 6, marginTop: 6 }}
                      />
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
    </>
  );
}
