"use client";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useRef } from "react";
import AmpMarkersLayer from "./components/AmpMarkersLayer";
import { LatLngBounds } from "leaflet";
import ProtectedAreasLayer from "./components/ProtectedAreasLayer";

function MapBoundsListener({
  onBoundsChange,
}: {
  onBoundsChange: (bounds: LatLngBounds) => void;
}) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  useMapEvents({
    moveend: (e) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onBoundsChange(e.target.getBounds());
      }, 200);
    },
    zoomend: (e) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onBoundsChange(e.target.getBounds());
      }, 200);
    },
  });
  return null;
}

export default function LeafletMap() {
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);

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
        whenReady={(map) =>
          setBounds(
            (
              map as unknown as { target: { getBounds: () => LatLngBounds } }
            ).target.getBounds()
          )
        }
      >
        <MapBoundsListener onBoundsChange={setBounds} />
        <TileLayer
          attribution="&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ProtectedAreasLayer bounds={bounds} />
        <AmpMarkersLayer bounds={bounds} />
      </MapContainer>
    </div>
  );
}
