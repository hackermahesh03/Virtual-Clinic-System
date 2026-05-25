import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "../Components/AdminHeader";
import { FaSearch, FaRobot, FaCommentMedical, FaVirus, FaStethoscope } from "react-icons/fa";

const AdminChatLogs = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedLog, setExpandedLog] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [logsRes, statsRes] = await Promise.all([
          axios.get("/api/v1/admin/chat-logs"),
          axios.get("/api/v1/admin/chat-stats"),
        ]);
        if (logsRes.data.success) setLogs(logsRes.data.logs);
        if (statsRes.data.success) setStats(statsRes.data);
      } catch (err) {
        console.error("Error fetching chat data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const { data } = await axios.get(`/api/v1/admin/chat-logs?search=${search}`);
        if (data.success) setLogs(data.logs);
      } catch (err) {
        console.error("Error searching chat logs:", err);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <>
      <AdminHeader />
      <div style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #e8ecf4 100%)", minHeight: "calc(100vh - 64px)", padding: "32px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#111827", marginBottom: "8px" }}>Chatbot Monitoring</h1>
          <p style={{ color: "#6b7280", marginBottom: "28px", fontSize: "0.95rem" }}>Conversation logs and bot performance statistics</p>

          {/* Stats Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px", marginBottom: "28px" }}>
            {/* Total Queries Card */}
            <div style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)", borderRadius: "20px", padding: "28px", color: "white" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                  <FaRobot />
                </div>
                <div>
                  <div style={{ fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.75 }}>Total Queries</div>
                  <div style={{ fontSize: "2rem", fontWeight: "800" }}>{stats?.totalQueries || 0}</div>
                </div>
              </div>
            </div>

            {/* Top Diseases */}
            <div style={{ background: "white", borderRadius: "20px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                <FaVirus style={{ color: "#ef4444" }} /> Top Diseases Diagnosed
              </h3>
              {stats?.topDiseases?.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {stats.topDiseases.slice(0, 5).map((d, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151" }}>{d.disease}</span>
                      <span style={{ background: "#eef2ff", color: "#4338ca", padding: "2px 10px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "700" }}>{d.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>No data yet</p>
              )}
            </div>

            {/* Top Symptoms */}
            <div style={{ background: "white", borderRadius: "20px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                <FaStethoscope style={{ color: "#10b981" }} /> Common Symptoms Identified
              </h3>
              {stats?.topSymptoms?.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {stats.topSymptoms.slice(0, 10).map((s, i) => (
                    <span
                      key={i}
                      style={{
                        background: "#f0fdf4",
                        color: "#166534",
                        padding: "4px 12px",
                        borderRadius: "8px",
                        fontSize: "0.78rem",
                        fontWeight: "600",
                        border: "1px solid #bbf7d0",
                      }}
                    >
                      {s.symptom} <span style={{ opacity: 0.6 }}>({s.count})</span>
                    </span>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>No data yet</p>
              )}
            </div>
          </div>

          {/* Conversation Logs */}
          <div style={{ background: "white", borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <div style={{ padding: "20px 28px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <FaCommentMedical style={{ color: "#8b5cf6" }} /> Recent Conversations
              </h2>
              <div style={{ position: "relative", minWidth: "280px" }}>
                <FaSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                <input
                  type="text"
                  placeholder="Search conversations..."
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
              <div style={{ padding: "60px", textAlign: "center", color: "#9ca3af" }}>Loading chat logs...</div>
            ) : logs.length === 0 ? (
              <div style={{ padding: "60px", textAlign: "center", color: "#9ca3af" }}>
                <FaRobot style={{ fontSize: "2rem", marginBottom: "12px", opacity: 0.3 }} />
                <p style={{ fontWeight: "600" }}>No conversations found</p>
                <p style={{ fontSize: "0.8rem" }}>Chatbot interactions will appear here</p>
              </div>
            ) : (
              <div>
                {logs.map((log) => (
                  <div
                    key={log._id}
                    style={{
                      borderBottom: "1px solid #f3f4f6",
                      padding: "16px 28px",
                      cursor: "pointer",
                      transition: "background 0.15s",
                      background: expandedLog === log._id ? "#fafbff" : "transparent",
                    }}
                    onClick={() => setExpandedLog(expandedLog === log._id ? null : log._id)}
                    onMouseEnter={(e) => { if (expandedLog !== log._id) e.currentTarget.style.background = "#fafbfc"; }}
                    onMouseLeave={(e) => { if (expandedLog !== log._id) e.currentTarget.style.background = "transparent"; }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <span style={{ fontWeight: "700", color: "#111827", fontSize: "0.9rem" }}>Patient Query:</span>
                          {log.diseaseDiagnosed && (
                            <span style={{ background: "#fef3c7", color: "#92400e", padding: "2px 10px", borderRadius: "6px", fontSize: "0.72rem", fontWeight: "700" }}>
                              {log.diseaseDiagnosed}
                            </span>
                          )}
                        </div>
                        <p style={{ color: "#4b5563", fontSize: "0.85rem", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "600px" }}>
                          {log.userPrompt}
                        </p>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#9ca3af", fontWeight: "600", whiteSpace: "nowrap", marginLeft: "16px" }}>
                        {new Date(log.createdAt).toLocaleDateString()} {new Date(log.createdAt).toLocaleTimeString()}
                      </div>
                    </div>

                    {expandedLog === log._id && (
                      <div style={{ marginTop: "12px", padding: "16px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
                        <div style={{ marginBottom: "12px" }}>
                          <span style={{ fontWeight: "700", color: "#6366f1", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Bot Response:</span>
                          <p style={{ color: "#374151", fontSize: "0.85rem", marginTop: "6px", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{log.botResponse}</p>
                        </div>
                        {log.suggestedDoctors?.length > 0 && (
                          <div>
                            <span style={{ fontWeight: "700", color: "#10b981", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Suggested Doctors:</span>
                            <div style={{ display: "flex", gap: "8px", marginTop: "6px", flexWrap: "wrap" }}>
                              {log.suggestedDoctors.map((doc, i) => (
                                <span key={i} style={{ background: "#d1fae5", color: "#065f46", padding: "4px 12px", borderRadius: "8px", fontSize: "0.78rem", fontWeight: "600" }}>
                                  {doc.name} ({doc.speciality})
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ textAlign: "center", padding: "16px", color: "#9ca3af", fontSize: "0.85rem" }}>
            Showing {logs.length} conversations
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminChatLogs;
