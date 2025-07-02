"use client";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useRef } from "react";
import { Map as LeafletMap, LatLngBounds } from "leaflet";
import AmpMarkersLayer from "./components/AmpMarkersLayer";
import ProtectedAreasLayer from "./components/ProtectedAreasLayer";
import SidePanel, { DataSource, AmpCategory } from "./components/SidePanel";
import MapLoader from "./components/MapLoader";

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

export default function LeafletMapComponent() {
  // Map state
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  // Data source state
  const [sources, setSources] = useState<DataSource[]>([
    { id: "protected-areas", label: "Protected Areas", enabled: true },
    { id: "amp", label: "AMP Points of Interest", enabled: true },
  ]);

  // Loader state
  const [isLoading, setIsLoading] = useState(false);

  // AMP category filter state
  const [selectedAmpCategories, setSelectedAmpCategories] = useState<
    AmpCategory[]
  >([1, 2, 3, 4, null]);
  const handleToggleAmpCategory = (cat: AmpCategory) => {
    setSelectedAmpCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Protected Area region filter state
  const [regions] = useState<string[]>([]); // TODO: Populate from data
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const handleSelectRegion = (region: string) =>
    setSelectedRegion(region || null);

  // Menu selection state
  const [selectedMenu, setSelectedMenu] = useState<string>("layers");
  const handleSelectMenu = (key: string) => setSelectedMenu(key);

  const handleToggleSource = (id: string) => {
    setSources((prev) =>
      prev.map((src) =>
        src.id === id ? { ...src, enabled: !src.enabled } : src
      )
    );
    // Simulate loading for 1.5s
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const showProtectedAreas = sources.find(
    (s) => s.id === "protected-areas"
  )?.enabled;
  const showAmp = sources.find((s) => s.id === "amp")?.enabled;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      <MapContainer
        center={[43.2965, 5.3698]}
        zoom={8}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
        whenReady={() => {
          if (mapRef.current) setBounds(mapRef.current.getBounds());
        }}
      >
        <MapBoundsListener onBoundsChange={setBounds} />
        <TileLayer
          attribution="&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {showProtectedAreas && <ProtectedAreasLayer bounds={bounds} />}
        {showAmp && (
          <AmpMarkersLayer
            bounds={bounds}
            selectedCategories={selectedAmpCategories}
          />
        )}
      </MapContainer>
      {isLoading && <MapLoader />}
      {/* SidePanel is fixed to the right, with width 320px, and menu is fixed to the right with width 56px */}
      <SidePanel
        sources={sources}
        onToggle={handleToggleSource}
        selectedAmpCategories={selectedAmpCategories}
        onToggleAmpCategory={handleToggleAmpCategory}
        regions={regions}
        selectedRegion={selectedRegion}
        onSelectRegion={handleSelectRegion}
        selectedMenu={selectedMenu}
        onSelectMenu={handleSelectMenu}
      />
    </div>
  );
}
