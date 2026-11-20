
export default function MetricCard({ title, value, unit }) {
  return (
    <div
      style={{
        backgroundColor: "#1e293b",
        color: "#f8fafc",
        padding: "24px",
        borderRadius: "12px",
        border: "1px solid #334155",
      }}
    >
      <p style={{ color: "#94a3b8", margin: 0 }}>
        {title}
      </p>

      <h2 style={{ fontSize: "30px", marginBottom: 0 }}>
        {value}
        <span style={{ fontSize: "16px", marginLeft: "5px" }}>
          {unit}
        </span>
      </h2>
    </div>
  );
}
