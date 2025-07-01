"use client";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import type { Geometry } from "geojson";
import ProtectedAreaPopup from "./components/ProtectedAreaPopup";
import L from "leaflet";
import { Marker } from "react-leaflet";

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

const AMP_GEOJSON_URL =
  "https://www.amp.milieumarinfrance.fr/api/1/98/31/get_amp_geojson";

function AmpMarkersLayer() {
  const [features, setFeatures] = useState<any[]>([]);

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
      {features.map((feature, idx) => {
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
