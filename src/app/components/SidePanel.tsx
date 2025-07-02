import React from "react";
import AmpCategoryIcon from "./AmpCategoryIcon";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import SideMenu from "./SideMenu";

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
  onSelectMenu: (key: string) => void;
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
  onSelectMenu,
}) => {
  console.log("SidePanel rendered");
  return (
    <div
      style={{
        position: "fixed",
        top: 8,
        right: 8,
        bottom: 8,
        display: "flex",
        flexDirection: "row",
        gap: 0,
        zIndex: 2000,
        width: 392,
      }}
    >
      <div
        style={{
          width: 320,
          background: "#fff",
          color: "black",
          padding: 20,
          overflowY: "auto",
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          height: "100%",
        }}
      >
        {selectedMenu === "layers" && (
          <>
            <h3
              style={{
                marginBottom: 12,
                textAlign: "left",
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              Data Sources
            </h3>
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
                        border: `2px solid ${
                          isSelected ? "#2563eb" : "#cbd5e1"
                        }`,
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
                        if (e.key === "Enter" || e.key === " ")
                          onToggle(src.id);
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
            <h4 style={{ marginBottom: 8, textAlign: "left" }}>
              AMP Categories
            </h4>
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
                    <Checkbox.Root
                      checked={selectedAmpCategories.includes(cat.value)}
                      onCheckedChange={() => onToggleAmpCategory(cat.value)}
                      id={`amp-cat-${cat.value}`}
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 4,
                        border: `2px solid ${
                          selectedAmpCategories.includes(cat.value)
                            ? "#2563eb"
                            : "#cbd5e1"
                        }`,
                        background: selectedAmpCategories.includes(cat.value)
                          ? "#fff"
                          : "#f8fafc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 8,
                        transition: "border 0.2s, background 0.2s",
                        cursor: "pointer",
                      }}
                    >
                      <Checkbox.Indicator asChild>
                        <CheckIcon
                          style={{ color: "#2563eb", width: 18, height: 18 }}
                        />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    {cat.label}
                    <AmpCategoryIcon
                      category={cat.value}
                      size={20}
                      style={{ marginLeft: 8, verticalAlign: "middle" }}
                    />
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
      <SideMenu
        selected={selectedMenu}
        onSelect={onSelectMenu}
        style={{
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderTopRightRadius: 8,
          borderBottomRightRadius: 8,
          borderLeft: "1px solid #f1f5f9",
          boxShadow: "none",
          height: "100%",
          width: 64,
          background: "#fff",
        }}
      />
    </div>
  );
};

export default SidePanel;
