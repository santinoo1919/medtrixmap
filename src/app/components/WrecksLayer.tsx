"use client";
import { useEffect, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { fetchWFSWrecks, WFSFeature } from "../services/wfsService";
import { fetchWFSProtectedAreas } from "../services/wfsService";
import { GeoJSON } from "react-leaflet";

const markerIcon = L.icon({
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function WrecksLayer() {
  const [wrecks, setWrecks] = useState<WFSFeature[]>([]);

  useEffect(() => {
    fetchWFSWrecks().then(setWrecks).catch(console.error);
  }, []);

  return (
    <>
      {wrecks.map((wreck) =>
        wreck.geometry.type === "Point" ? (
          <Marker
            key={wreck.id}
            position={[
              wreck.geometry.coordinates[1],
              wreck.geometry.coordinates[0],
            ]}
            icon={L.icon({ iconUrl: "/window.svg", iconSize: [24, 24] })}
          >
            <Popup>
              <pre>{JSON.stringify(wreck.properties, null, 2)}</pre>
            </Popup>
          </Marker>
        ) : null
      )}
    </>
  );
}

export function ProtectedAreasLayer() {
  const [areas, setAreas] = useState<WFSFeature[]>([]);

  useEffect(() => {
    fetchWFSProtectedAreas()
      .then((data) => {
        console.log("Fetched protected areas:", data);
        setAreas(data);
      })
      .catch(console.error);
  }, []);

  return (
    <>
      {areas.map((area, idx) => {
        if (!area.geometry) return null;
        console.log("Feature geometry:", area.geometry);
        if (area.geometry.type === "MultiPolygon") {
          // Log the first coordinate for debug
          const coords = area.geometry.coordinates[0][0][0];
          console.log("First MultiPolygon coordinate:", coords);
        }
        // Render MultiPolygon (and Polygon) as GeoJSON
        if (
          area.geometry.type === "MultiPolygon" ||
          area.geometry.type === "Polygon"
        ) {
          return (
            <GeoJSON
              key={area.id || idx}
              data={area.geometry as any}
              style={{ color: "#3388ff", weight: 2, fillOpacity: 0.2 }}
              eventHandlers={{
                click: (e) => {
                  const layer = e.target;
                  layer
                    .bindPopup(
                      `<pre>${JSON.stringify(area.properties, null, 2)}</pre>`
                    )
                    .openPopup();
                },
              }}
            />
          );
        }
        return null;
      })}
    </>
  );
}
