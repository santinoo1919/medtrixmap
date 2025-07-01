import React from "react";

interface ProtectedAreaPopupProps {
  properties: Record<string, unknown>;
}

// Mapping of property keys to friendly labels (order matters for columns)
const PROPERTY_LABELS: Record<string, string> = {
  country_iso3namefr: "Country (FR)",
  subloc_name: "Sub-location",
  des_desigtype: "Designation Type",
  mpa_status: "Status",
  mpa_datebegin: "Designation Date",
  mpa_calcarea: "Area (ha)",
  iucn_idiucn: "IUCN Category",
  mpa_url: "Official URL",
};

export default function ProtectedAreaPopup({
  properties,
}: ProtectedAreaPopupProps) {
  // Extract name fields
  const name = properties.mpa_name as string | undefined;
  const originalName = properties.mpa_oriname as string | undefined;
  const designation = properties.des_desigfr as string | undefined;

  // Prepare other fields for display (country above sub-location)
  const otherFields = Object.entries(PROPERTY_LABELS)
    .filter(([key]) => properties[key] !== undefined)
    .map(([key, label]) => ({
      key,
      label,
      value: properties[key],
    }));

  // Split into two columns
  const mid = Math.ceil(otherFields.length / 2);
  const col1 = otherFields.slice(0, mid);
  const col2 = otherFields.slice(mid);

  return (
    <div className="protected-area-popup">
      {/* Header section */}
      <div className="popup-header">
        {name && <div>{name}</div>}
        {originalName && <div>{originalName}</div>}
        {designation && <div className="popup-designation">{designation}</div>}
      </div>
      {/* Two columns of label/value pairs */}
      <div className="popup-columns">
        <div className="popup-col">
          {col1.map((field) => (
            <div key={field.key}>
              <div className="popup-label">{field.label}</div>
              <div className="popup-value">{String(field.value)}</div>
            </div>
          ))}
        </div>
        <div className="popup-col">
          {col2.map((field) => (
            <div key={field.key}>
              <div className="popup-label">{field.label}</div>
              <div className="popup-value">{String(field.value)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
