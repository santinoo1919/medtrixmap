"use client";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import type { Geometry } from "geojson";
import ProtectedAreaPopup from "./components/ProtectedAreaPopup";

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

// Mapping of property keys to friendly labels (updated for actual data)
const PROPERTY_LABELS: Record<string, string> = {
  des_desigfr: "Designation (FR)",
  des_desigtype: "Designation Type",
  mpa_status: "Status",
  mpa_datebegin: "Designation Date",
  mpa_calcarea: "Area (ha)",
  subloc_name: "Sub-location",
  country_iso3namefr: "Country (FR)",
  iucn_idiucn: "IUCN Category",
  mpa_url: "Official URL",
};

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
      </MapContainer>
    </div>
  );
}
