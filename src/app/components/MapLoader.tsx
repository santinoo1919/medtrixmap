export default function MapLoader() {
  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        width: 32,
        height: 32,
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255,255,255,0.85)",
        borderRadius: 16,
        boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          border: "4px solid #2563eb",
          borderTop: "4px solid #fff",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
