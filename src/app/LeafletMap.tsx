"use client";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import type { Geometry } from "geojson";
import ProtectedAreaPopup from "./components/ProtectedAreaPopup";
import AmpMarkersLayer from "./components/AmpMarkersLayer";

// Minimal GeoJSON FeatureCollection type
interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    geometry: Geometry;
    properties: Record<string, unknown>;
    id?: string | number;
  }>;
}

export default function LeafletMap() {
  const [areas, setAreas] = useState<GeoJSONFeatureCollection | null>(null);

  useEffect(() => {
    fetch("/api/protected-areas")
      .then((res) => res.json())
      .then((data: GeoJSONFeatureCollection) => setAreas(data))
      .catch(console.error);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
      }}
    >
      <MapContainer
        center={[43.2965, 5.3698]}
        zoom={8}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {areas &&
          areas.features.map((feature, idx) =>
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
        <AmpMarkersLayer />
      </MapContainer>
    </div>
  );
}
