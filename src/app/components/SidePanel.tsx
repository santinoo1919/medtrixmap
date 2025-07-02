import React from "react";

export type DataSource = {
  id: string;
  label: string;
  enabled: boolean;
};

export type AmpCategory = 1 | 2 | 3 | 4 | null;

interface SidePanelProps {
  sources: DataSource[];
  onToggle: (id: string) => void;
  // AMP category filter
  selectedAmpCategories: AmpCategory[];
  onToggleAmpCategory: (cat: AmpCategory) => void;
  // Protected Area region filter
  regions: string[];
  selectedRegion: string | null;
  onSelectRegion: (region: string) => void;
  selectedMenu: string;
}

const AMP_CATEGORIES: { value: AmpCategory; label: string }[] = [
  { value: 1, label: "Birds" },
  { value: 2, label: "Marine Fauna" },
  { value: 3, label: "Habitats & Flora" },
  { value: 4, label: "Human Activities" },
  { value: null, label: "Other" },
];

const getBoxBg = (id: string) => {
  if (id === "protected-areas") return "/protected.jpg";
  if (id === "amp") return "/species.jpg";
  return undefined;
};

const PLACEHOLDER_SECTIONS = [
  { title: "Marine Zones" },
  { title: "Seabed Types" },
  { title: "Shipping Lanes" },
];

const SidePanel: React.FC<SidePanelProps> = ({
  sources,
  onToggle,
  selectedAmpCategories,
  onToggleAmpCategory,
  regions,
  selectedRegion,
  onSelectRegion,
  selectedMenu,
}) => {
  console.log("SidePanel rendered");
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 56,
        width: 320,
        height: "100vh",
        background: "#fff",
        color: "black",
        zIndex: 2000,
        padding: 20,
        overflowY: "auto",
      }}
    >
      {selectedMenu === "layers" && (
        <>
          <h3 style={{ marginBottom: 12, textAlign: "left" }}>Data Sources</h3>
          <div
            style={{
              width: "100%",
              paddingLeft: 8,
              paddingRight: 8,
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {sources.map((src) => {
              const bg = getBoxBg(src.id);
              const isSelected = src.enabled;
              return (
                <div key={src.id}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 15,
                      marginBottom: 4,
                      color: isSelected ? "#2563eb" : "#64748b",
                      textAlign: "center",
                    }}
                  >
                    {src.label}
                  </div>
                  <div
                    style={{
                      border: `2px solid ${isSelected ? "#2563eb" : "#cbd5e1"}`,
                      borderRadius: 10,
                      minHeight: 110,
                      height: 110,
                      width: "calc(100% - 2px)",
                      background: bg
                        ? `url('${bg}') center/cover no-repeat`
                        : "#f8fafc",
                      cursor: "pointer",
                      transition: "border 0.2s",
                      boxShadow: isSelected
                        ? "0 2px 8px rgba(37,99,235,0.08)"
                        : "none",
                      outline: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      filter: !isSelected && bg ? "grayscale(1)" : undefined,
                    }}
                    onClick={() => onToggle(src.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") onToggle(src.id);
                    }}
                    tabIndex={0}
                    role="button"
                    aria-pressed={isSelected}
                  />
                </div>
              );
            })}
            {/* Placeholder sections */}
            {PLACEHOLDER_SECTIONS.map((section) => (
              <div key={section.title}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 15,
                    marginBottom: 4,
                    color: "#64748b",
                    textAlign: "center",
                  }}
                >
                  {section.title}
                </div>
                <div
                  style={{
                    border: "2px solid #cbd5e1",
                    borderRadius: 10,
                    minHeight: 110,
                    height: 110,
                    width: "calc(100% - 2px)",
                    background: `url('/protected.jpg') center/cover no-repeat`,
                    transition: "border 0.2s",
                    outline: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    filter: "grayscale(1)",
                  }}
                />
              </div>
            ))}
          </div>
        </>
      )}
      {selectedMenu === "filters" && (
        <div
          style={{
            width: "100%",
            paddingLeft: 8,
            paddingRight: 8,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h4 style={{ marginBottom: 8, textAlign: "left" }}>AMP Categories</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {AMP_CATEGORIES.map((cat) => (
              <li key={cat.value ?? "other"} style={{ marginBottom: 8 }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedAmpCategories.includes(cat.value)}
                    onChange={() => onToggleAmpCategory(cat.value)}
                    style={{ marginRight: 8 }}
                  />
                  {cat.label}
                </label>
              </li>
            ))}
          </ul>
          <h4 style={{ marginBottom: 8, marginTop: 32, textAlign: "left" }}>
            Protected Area Region
          </h4>
          {regions.length === 0 ? (
            <div
              style={{
                color: "#888",
                fontSize: 14,
                textAlign: "left",
              }}
            >
              No regions available
            </div>
          ) : (
            <select
              value={selectedRegion || ""}
              onChange={(e) => onSelectRegion(e.target.value)}
              style={{
                width: 200,
                padding: 6,
                fontSize: 14,
                borderRadius: 6,
                border: "1px solid #ccc",
                margin: 0,
                display: "block",
              }}
            >
              <option value="">All Regions</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          )}
        </div>
      )}
      {selectedMenu === "legend" && (
        <div
          style={{
            width: "100%",
            paddingLeft: 8,
            paddingRight: 8,
            color: "#888",
            fontSize: 15,
            textAlign: "center",
            marginTop: 40,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          Legend coming soon...
        </div>
      )}
      {selectedMenu === "measure" && (
        <div
          style={{
            width: "100%",
            paddingLeft: 8,
            paddingRight: 8,
            color: "#888",
            fontSize: 15,
            textAlign: "center",
            marginTop: 40,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          Measure tool coming soon...
        </div>
      )}
    </div>
  );
};

export default SidePanel;
