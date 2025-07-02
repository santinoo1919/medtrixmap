import React from "react";
import {
  MdOutlineEmojiNature,
  MdOutlineLocalFlorist,
  MdOutlinePeople,
} from "react-icons/md";
import { FaFeatherAlt, FaFish } from "react-icons/fa";
import { IconType } from "react-icons";
import type { AmpCategory } from "./SidePanel";

// Map each category to an icon and color
const CATEGORY_ICON_MAP: Record<
  Exclude<AmpCategory, null>,
  { icon: IconType; color: string; label: string }
> = {
  1: { icon: FaFeatherAlt, color: "#60a5fa", label: "Birds" }, // blue
  2: { icon: FaFish, color: "#f59e42", label: "Marine Fauna" }, // orange
  3: {
    icon: MdOutlineLocalFlorist,
    color: "#34d399",
    label: "Habitats & Flora",
  }, // green
  4: { icon: MdOutlinePeople, color: "#f87171", label: "Human Activities" }, // red
};

const OTHER_ICON = MdOutlineEmojiNature;
const OTHER_COLOR = "#a3a3a3";
const OTHER_LABEL = "Other";

export interface AmpCategoryIconProps {
  category: AmpCategory;
  size?: number;
  className?: string;
  weight?: "regular" | "light";
  style?: React.CSSProperties;
}

const AmpCategoryIcon: React.FC<AmpCategoryIconProps> = ({
  category,
  size = 28,
  className,
  style,
}) => {
  if (category && CATEGORY_ICON_MAP[category]) {
    const { icon: Icon, color, label } = CATEGORY_ICON_MAP[category];
    return (
      <Icon
        size={size}
        color={color}
        title={label}
        aria-label={label}
        className={className}
        style={style}
      />
    );
  }
  // Fallback for null/other
  return (
    <OTHER_ICON
      size={size}
      color={OTHER_COLOR}
      title={OTHER_LABEL}
      aria-label={OTHER_LABEL}
      className={className}
      style={style}
    />
  );
};

export const AmpCategoryCircleIcon: React.FC<AmpCategoryIconProps> = ({
  category,
  size = 40,
  className,
  weight = "regular",
}) => {
  let iconEl, color, label;
  if (category && CATEGORY_ICON_MAP[category]) {
    const {
      icon: Icon,
      color: catColor,
      label: catLabel,
    } = CATEGORY_ICON_MAP[category];
    iconEl = (
      <Icon
        size={weight === "light" ? size * 0.5 : size * 0.6}
        color={"#fff"}
        title={catLabel}
        aria-label={catLabel}
        style={{ opacity: weight === "light" ? 0.7 : 1 }}
      />
    );
    color = catColor;
    label = catLabel;
  } else {
    iconEl = (
      <OTHER_ICON
        size={weight === "light" ? size * 0.5 : size * 0.6}
        color={"#fff"}
        title={OTHER_LABEL}
        aria-label={OTHER_LABEL}
        style={{ opacity: weight === "light" ? 0.7 : 1 }}
      />
    );
    color = OTHER_COLOR;
    label = OTHER_LABEL;
  }
  return (
    <div
      className={className}
      title={label}
      aria-label={label}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        border: `2px solid ${darkenColor(color, 0.18)}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
      }}
    >
      {iconEl}
    </div>
  );
};

// Helper to darken a hex color by a given amount (0-1)
function darkenColor(hex: string, amount: number) {
  // Remove # if present
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((x) => x + x)
      .join("");
  }
  const num = parseInt(hex, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.floor(r * (1 - amount)));
  g = Math.max(0, Math.floor(g * (1 - amount)));
  b = Math.max(0, Math.floor(b * (1 - amount)));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export default AmpCategoryIcon;
