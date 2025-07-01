import { useEffect, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

interface AmpFeature {
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: {
    title?: string;
    header_text?: string;
    description?: string;
    url?: string;
    amp_name?: string;
    [key: string]: any;
  };
}

const AMP_GEOJSON_URL =
  "https://www.amp.milieumarinfrance.fr/api/1/98/31/get_amp_geojson";

export default function AmpMarkersLayer() {
  const [features, setFeatures] = useState<AmpFeature[]>([]);

  useEffect(() => {
    fetch(AMP_GEOJSON_URL)
      .then((res) => res.json())
      .then((data) => setFeatures(data.features || []));
  }, []);

  const markerIcon = L.icon({
    iconUrl: "/marker-icon.png",
    shadowUrl: "/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <>
      {features.map((feature: AmpFeature, idx: number) => {
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
                    {props.title}
                  </div>
                )}
                {props.header_text && (
                  <div
                    style={{ fontSize: 13, color: "#2563eb", marginBottom: 4 }}
                  >
                    {props.header_text}
                  </div>
                )}
                {props.description && (
                  <div style={{ fontSize: 13, color: "#444", marginBottom: 4 }}>
                    {props.description}
                  </div>
                )}
                {props.url && (
                  <img
                    src={props.url}
                    alt={props.title || ""}
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
