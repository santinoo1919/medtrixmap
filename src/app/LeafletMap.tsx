"use client";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import type { Geometry } from "geojson";
import ProtectedAreaPopup from "./components/ProtectedAreaPopup";
import { renderToString } from "react-dom/server";

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

function renderProtectedAreaPopup(properties: Record<string, unknown>) {
  const name = properties.mpa_name as string | undefined;
  const originalName = properties.mpa_oriname as string | undefined;
  const otherFields = Object.entries(PROPERTY_LABELS)
    .filter(([key]) => properties[key] !== undefined)
    .map(([key, label]) => ({
      key,
      label,
      value: properties[key],
    }));
  const mid = Math.ceil(otherFields.length / 2);
  const col1 = otherFields.slice(0, mid);
  const col2 = otherFields.slice(mid);
  return `
    <div class='p-2 min-w-[260px] max-w-[340px]'>
      ${name ? `<div class='text-lg font-bold mb-1'>${name}</div>` : ""}
      ${
        originalName
          ? `<div class='text-sm text-gray-500 mb-2'>${originalName}</div>`
          : ""
      }
      <div class='flex gap-4'>
        <div class='flex-1 space-y-2'>
          ${col1
            .map(
              (field) => `
                <div>
                  <div class='text-xs text-gray-400 font-semibold mb-0.5'>${
                    field.label
                  }</div>
                  <div class='text-sm break-words'>${String(field.value)}</div>
                </div>
              `
            )
            .join("")}
        </div>
        <div class='flex-1 space-y-2'>
          ${col2
            .map(
              (field) => `
                <div>
                  <div class='text-xs text-gray-400 font-semibold mb-0.5'>${
                    field.label
                  }</div>
                  <div class='text-sm break-words'>${String(field.value)}</div>
                </div>
              `
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
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
      </MapContainer>
    </div>
  );
}
