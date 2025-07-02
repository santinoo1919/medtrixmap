import React from "react";

const MENU_ITEMS = [
  {
    key: "layers",
    label: "Layers",
    icon: (color: string) => (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <path
          d="M12 3L2 9l10 6 10-6-10-6zm0 13.5L4.21 12.13a1 1 0 0 0-1.42 1.34l8 4.8a1 1 0 0 0 1.42 0l8-4.8a1 1 0 0 0-1.42-1.34L12 16.5z"
          fill={color}
        />
      </svg>
    ),
  },
  {
    key: "filters",
    label: "Filters",
    icon: (color: string) => (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <path
          d="M3 5h18M6 10h12M10 15h4"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    key: "legend",
    label: "Legend",
    icon: (color: string) => (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <rect
          x="4"
          y="4"
          width="16"
          height="16"
          rx="2"
          fill={color}
          fillOpacity="0.15"
        />
        <rect x="7" y="7" width="10" height="10" rx="1" fill={color} />
      </svg>
    ),
  },
  {
    key: "measure",
    label: "Measure",
    icon: (color: string) => (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <rect x="3" y="11" width="18" height="2" rx="1" fill={color} />
        <rect x="11" y="3" width="2" height="18" rx="1" fill={color} />
      </svg>
    ),
  },
];

interface SideMenuProps {
  selected: string;
  onSelect: (key: string) => void;
  style?: React.CSSProperties;
}

const SideMenu: React.FC<SideMenuProps> = ({ selected, onSelect, style }) => {
  return (
    <div
      style={{
        width: 72,
        background: "#fff",
        borderLeft: "1px solid #f1f5f9",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: 16,
        ...style,
      }}
    >
      {MENU_ITEMS.map((item) => {
        const isSelected = selected === item.key;
        const color = isSelected ? "#2563eb" : "#64748b";
        return (
          <button
            key={item.key}
            style={{
              background: isSelected ? "#e0e7ff" : "transparent",
              border: "none",
              borderRadius: 6,
              padding: isSelected ? "12px 12px 8px 12px" : "8px 0 4px 0",
              width: isSelected ? 56 : 44,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              outline: "none",
              boxShadow: isSelected ? "0 2px 8px rgba(37,99,235,0.08)" : "none",
              transition: "background 0.2s, padding 0.2s",
              marginTop: 4,
              marginLeft: "auto",
              marginRight: "auto",
            }}
            onClick={() => onSelect(item.key)}
          >
            {item.icon(color)}
            <span
              style={{
                fontSize: 11,
                color,
                fontWeight: 500,
                marginTop: 4,
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default SideMenu;
