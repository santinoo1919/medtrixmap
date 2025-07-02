import { useEffect, useState, useMemo, useRef } from "react";
import { Marker, Popup } from "react-leaflet";
import L, { LatLngBounds } from "leaflet";
import MapLoader from "./MapLoader";
import { getAmpCategoryInfo } from "./ampCategoryMap";
import type { AmpCategory } from "./SidePanel";
import ReactDOMServer from "react-dom/server";
import { AmpCategoryCircleIcon } from "./AmpCategoryIcon";
import React from "react";

interface AmpFeature {
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: {
    title?: string;
    header_text?: string;
    description?: string;
    url?: string;
    amp_name?: string;
    category?: number;
    [key: string]: unknown;
  };
}

interface AmpMarkersLayerProps {
  bounds: LatLngBounds | null;
  selectedCategories: AmpCategory[];
}

const AMP_GEOJSON_URL =
  "https://www.amp.milieumarinfrance.fr/api/1/98/31/get_amp_geojson";

export default function AmpMarkersLayer({
  bounds,
  selectedCategories,
}: AmpMarkersLayerProps) {
  const [features, setFeatures] = useState<AmpFeature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(AMP_GEOJSON_URL)
      .then((res) => res.json())
      .then((data) => setFeatures(data.features || []))
      .finally(() => setLoading(false));
  }, []);

  // Filtering logic (no setState in useMemo)
  const filtered = useMemo(() => {
    if (loading) return [];
    let result = features;
    if (bounds) {
      result = result.filter((feature) => {
        const coords = feature.geometry?.coordinates;
        if (!coords) return false;
        const [lng, lat] = coords;
        return bounds.contains([lat, lng]);
      });
    }
    // Filter by selected categories
    if (selectedCategories.length > 0) {
      result = result.filter((feature) =>
        selectedCategories.includes(
          (feature.properties.category as AmpCategory) ?? null
        )
      );
    } else {
      result = [];
    }
    return result;
  }, [features, bounds, loading, selectedCategories]);

  // Memoize marker icons by category
  const iconCache = useRef<Record<string, L.DivIcon>>({});
  function getCategoryDivIcon(category: AmpCategory) {
    const key = String(category);
    if (!iconCache.current[key]) {
      const html = ReactDOMServer.renderToString(
        <AmpCategoryCircleIcon category={category} size={40} />
      );
      iconCache.current[key] = L.divIcon({
        html,
        className: "amp-marker-icon",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });
    }
    return iconCache.current[key];
  }

  return (
    <>
      {loading && <MapLoader />}
      {loading
        ? null
        : filtered.map((feature: AmpFeature, idx: number) => {
            const coords = feature.geometry?.coordinates;
            if (!coords) return null;
            const [lng, lat] = coords;
            const props = feature.properties || {};
            const category =
              props.category as import("./ampCategoryMap").AmpCategory;
            const categoryInfo = getAmpCategoryInfo(category);
            // Use a unique id if available, otherwise append idx to ensure uniqueness
            const markerKey = props.id
              ? String(props.id)
              : props.amp_name
              ? `${props.amp_name}_${lat}_${lng}_${idx}`
              : props.title
              ? `${props.title}_${lat}_${lng}_${idx}`
              : `${lat}_${lng}_${idx}`;
            return (
              <Marker
                key={markerKey}
                position={[lat, lng]}
                icon={getCategoryDivIcon(category)}
              >
                <Popup>
                  <div
                    style={{
                      minWidth: 220,
                      maxWidth: 320,
                      maxHeight: "80vh",
                      overflowY: "auto",
                    }}
                  >
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
                    <div
                      className={`amp-category-label amp-category-label-${categoryInfo.label
                        .replace(/[^a-z0-9]+/gi, "-")
                        .toLowerCase()}`}
                    >
                      {categoryInfo.label}
                    </div>
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
                        style={{
                          fontSize: 13,
                          color: "#444",
                          marginBottom: 4,
                        }}
                      >
                        {props.description as string}
                      </div>
                    )}
                    {props.url && (
                      <img
                        src={props.url as string}
                        alt={(props.title as string) || ""}
                        style={{
                          width: "100%",
                          borderRadius: 6,
                          marginTop: 6,
                        }}
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
