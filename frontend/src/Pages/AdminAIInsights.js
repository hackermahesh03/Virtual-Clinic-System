import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "../Components/AdminHeader";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { FaSearch, FaLungs, FaChartPie } from "react-icons/fa";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#0ea5e9", "#8b5cf6", "#14b8a6"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "white", padding: "12px 16px", borderRadius: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #e5e7eb" }}>
        <p style={{ margin: 0, fontWeight: "700", color: "#111827", fontSize: "0.9rem" }}>{payload[0].name}</p>
        <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "0.85rem" }}>{payload[0].value} predictions ({((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}%)</p>
      </div>
    );
  }
  return null;
};

const AdminAIInsights = () => {
  const [predictionStats, setPredictionStats] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, historyRes] = await Promise.all([
          axios.get("/api/v1/admin/prediction-stats"),
          axios.get("/api/v1/admin/prediction-history"),
        ]);
        if (statsRes.data.success) {
          const total = statsRes.data.stats.reduce((sum, s) => sum + s.value, 0);
          setPredictionStats(statsRes.data.stats.map((s) => ({ ...s, total })));
        }
        if (historyRes.data.success) setPredictions(historyRes.data.predictions);
      } catch (err) {
        console.error("Error fetching AI insights:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = async () => {
    try {
      const { data } = await axios.get(`/api/v1/admin/prediction-history?search=${search}`);
      if (data.success) setPredictions(data.predictions);
    } catch (err) {
      console.error("Error searching predictions:", err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const predictionColors = {
    Normal: { bg: "#d1fae5", color: "#065f46" },
    "COVID-19": { bg: "#fee2e2", color: "#991b1b" },
    Pneumonia: { bg: "#fef3c7", color: "#92400e" },
    "Lung Opacity": { bg: "#e0e7ff", color: "#3730a3" },
    "Viral Pneumonia": { bg: "#fce7f3", color: "#9d174d" },
  };

  return (
    <>
      <AdminHeader />
      <div style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #e8ecf4 100%)", minHeight: "calc(100vh - 64px)", padding: "32px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#111827", marginBottom: "8px" }}>AI & ML Insights</h1>
          <p style={{ color: "#6b7280", marginBottom: "28px", fontSize: "0.95rem" }}>Disease trends and prediction history from lung X-ray analysis</p>

          {/* Pie Chart Section */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "28px" }}>
            <div style={{ background: "white", borderRadius: "20px", padding: "28px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaChartPie style={{ color: "#6366f1" }} /> Disease Distribution
              </h2>
              {predictionStats.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={predictionStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={120}
                      paddingAngle={4}
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={800}
                    >
                      {predictionStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => <span style={{ color: "#374151", fontWeight: "600", fontSize: "0.85rem" }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: "320px", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
                  <div style={{ textAlign: "center" }}>
                    <FaChartPie style={{ fontSize: "3rem", opacity: 0.2, marginBottom: "12px" }} />
                    <p style={{ fontWeight: "600" }}>No prediction data yet</p>
                    <p style={{ fontSize: "0.8rem" }}>Data will appear after X-ray scans are performed</p>
                  </div>
                </div>
              )}
            </div>

            {/* Stats Summary */}
            <div style={{ background: "white", borderRadius: "20px", padding: "28px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaLungs style={{ color: "#ec4899" }} /> Breakdown by Condition
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {predictionStats.length > 0 ? (
                  predictionStats.map((stat, index) => {
                    const percentage = stat.total > 0 ? ((stat.value / stat.total) * 100).toFixed(1) : 0;
                    return (
                      <div key={stat.name} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "14px", height: "14px", borderRadius: "4px", background: COLORS[index % COLORS.length], flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                            <span style={{ fontWeight: "700", color: "#111827", fontSize: "0.9rem" }}>{stat.name}</span>
                            <span style={{ fontWeight: "600", color: "#6b7280", fontSize: "0.85rem" }}>{stat.value} ({percentage}%)</span>
                          </div>
                          <div style={{ width: "100%", height: "8px", background: "#f3f4f6", borderRadius: "4px", overflow: "hidden" }}>
                            <div style={{ width: `${percentage}%`, height: "100%", background: COLORS[index % COLORS.length], borderRadius: "4px", transition: "width 0.5s ease" }} />
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>
                    <p style={{ fontWeight: "600" }}>No data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Prediction History Table */}
          <div style={{ background: "white", borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <div style={{ padding: "20px 28px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", margin: 0 }}>Prediction History Log</h2>
              <div style={{ position: "relative", minWidth: "250px" }}>
                <FaSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                <input
                  type="text"
                  placeholder="Search by condition..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 12px 9px 36px",
                    borderRadius: "10px",
                    border: "2px solid #e5e7eb",
                    fontSize: "0.85rem",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
            </div>
            {loading ? (
              <div style={{ padding: "60px", textAlign: "center", color: "#9ca3af" }}>Loading predictions...</div>
            ) : predictions.length === 0 ? (
              <div style={{ padding: "60px", textAlign: "center", color: "#9ca3af" }}>
                <FaLungs style={{ fontSize: "2rem", marginBottom: "12px", opacity: 0.3 }} />
                <p style={{ fontWeight: "600" }}>No predictions found</p>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
                    {["#", "Prediction", "Confidence", "Date", "Time"].map((h) => (
                      <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: "0.78rem", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((pred, idx) => {
                    const pc = predictionColors[pred.prediction] || { bg: "#f3f4f6", color: "#374151" };
                    return (
                      <tr key={pred._id} style={{ borderBottom: "1px solid #f3f4f6", transition: "background 0.15s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#fafbfc")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <td style={{ padding: "12px 20px", color: "#9ca3af", fontWeight: "600", fontSize: "0.85rem" }}>{idx + 1}</td>
                        <td style={{ padding: "12px 20px" }}>
                          <span style={{ background: pc.bg, color: pc.color, padding: "4px 14px", borderRadius: "8px", fontSize: "0.8rem", fontWeight: "700" }}>{pred.prediction}</span>
                        </td>
                        <td style={{ padding: "12px 20px", fontWeight: "700", color: "#111827", fontSize: "0.9rem" }}>{pred.confidence}</td>
                        <td style={{ padding: "12px 20px", color: "#4b5563", fontSize: "0.85rem" }}>{new Date(pred.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: "12px 20px", color: "#4b5563", fontSize: "0.85rem" }}>{new Date(pred.createdAt).toLocaleTimeString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          <div style={{ textAlign: "center", padding: "16px", color: "#9ca3af", fontSize: "0.85rem" }}>
            Showing {predictions.length} predictions
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminAIInsights;
