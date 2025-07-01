export type AmpCategory = 1 | 2 | 3 | 4 | null;

export interface AmpCategoryInfo {
  label: string;
  color: string;
  description: string;
}

export const AMP_CATEGORY_MAP: Record<string, AmpCategoryInfo> = {
  "1": {
    label: "Birds",
    color: "#60a5fa", // blue
    description: "Avifauna and bird-related points of interest",
  },
  "2": {
    label: "Marine Fauna",
    color: "#f59e42", // orange
    description: "Marine animals: fish, mollusks, crustaceans, etc.",
  },
  "3": {
    label: "Habitats & Flora",
    color: "#34d399", // green
    description: "Habitats, plants, algae, seagrass beds, reefs, etc.",
  },
  "4": {
    label: "Human Activities",
    color: "#f87171", // red
    description: "Awareness, conservation, regulations, human impact",
  },
  other: {
    label: "Other",
    color: "#a3a3a3", // gray
    description: "General information or unclassified",
  },
};

export function getAmpCategoryInfo(category: AmpCategory): AmpCategoryInfo {
  if (category === null || !(String(category) in AMP_CATEGORY_MAP)) {
    return AMP_CATEGORY_MAP["other"];
  }
  return AMP_CATEGORY_MAP[String(category)];
}
