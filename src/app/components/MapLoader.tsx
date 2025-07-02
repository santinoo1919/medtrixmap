export default function MapLoader() {
  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
        padding: "6px 14px 6px 8px",
        minWidth: 60,
      }}
    >
      <div
        style={{
          width: 16,
          height: 16,
          border: "3px solid #2563eb",
          borderTop: "3px solid #fff",
          borderRadius: "50%",
          marginRight: 8,
          animation: "spin 1s linear infinite",
        }}
      />
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: "#2563eb",
          letterSpacing: 0.1,
        }}
      >
        Fetching data…
      </span>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
