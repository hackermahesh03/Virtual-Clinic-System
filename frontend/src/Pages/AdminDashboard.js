import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "../Components/AdminHeader";
import { Link } from "react-router-dom";
import { FaUserDoctor } from "react-icons/fa6";
import {
  FaUser,
  FaCalendarCheck,
  FaHourglassHalf,
  FaMoneyBillWave,
  FaRobot,
  FaLungs,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const StatCard = ({ icon, label, value, color, bgGrad }) => (
  <div
    style={{
      background: bgGrad || "white",
      borderRadius: "16px",
      padding: "24px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: "default",
      border: "1px solid rgba(0,0,0,0.04)",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.1)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)";
    }}
  >
    <div
      style={{
        width: "52px",
        height: "52px",
        borderRadius: "14px",
        background: color || "#6366f1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "22px",
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div>
      <div style={{ fontSize: "0.8rem", color: "#6b7280", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
      <div style={{ fontSize: "1.75rem", fontWeight: "800", color: "#111827", lineHeight: 1.1, marginTop: "2px" }}>{value}</div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fee, setFee] = useState(500);

  const fetchData = async () => {
    try {
      const [statsRes, pendingRes] = await Promise.all([
        axios.get("/api/v1/admin/stats"),
        axios.get("/api/v1/admin/pending-doctors"),
      ]);
      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (pendingRes.data.success) setPendingDoctors(pendingRes.data.doctors);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(`/api/v1/admin/approve-doctor/${id}`);
      setPendingDoctors((prev) => prev.filter((d) => d._id !== id));
      fetchData();
    } catch (err) {
      console.error("Error approving doctor:", err);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this doctor?")) return;
    try {
      await axios.delete(`/api/v1/admin/reject-doctor/${id}`);
      setPendingDoctors((prev) => prev.filter((d) => d._id !== id));
      fetchData();
    } catch (err) {
      console.error("Error rejecting doctor:", err);
    }
  };

  if (loading) {
    return (
      <>
        <AdminHeader />
        <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9" }}>
          <div style={{ textAlign: "center" }}>
            <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}></div>
            <p style={{ marginTop: "16px", color: "#6b7280", fontWeight: "600" }}>Loading Dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  const simulatedRevenue = stats ? stats.totalAppointments * fee : 0;

  return (
    <>
      <AdminHeader />
      <div style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #e8ecf4 100%)", minHeight: "calc(100vh - 64px)", padding: "32px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: "32px" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#111827", margin: 0 }}>Admin Dashboard</h1>
            <p style={{ color: "#6b7280", marginTop: "4px", fontSize: "0.95rem" }}>Platform overview and management center</p>
          </div>

          {/* Stats Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px", marginBottom: "32px" }}>
            <StatCard icon={<FaUserDoctor />} label="Total Doctors" value={stats?.totalDoctors || 0} color="#6366f1" />
            <StatCard icon={<FaUser />} label="Total Patients" value={stats?.totalPatients || 0} color="#0ea5e9" />
            <StatCard icon={<FaCalendarCheck />} label="Appointments" value={stats?.totalAppointments || 0} color="#10b981" />
            <StatCard icon={<FaHourglassHalf />} label="Pending Approvals" value={stats?.pendingDoctors || 0} color="#f59e0b" />
            <StatCard icon={<FaRobot />} label="Chatbot Queries" value={stats?.totalChatQueries || 0} color="#8b5cf6" />
            <StatCard icon={<FaLungs />} label="AI Predictions" value={stats?.totalPredictions || 0} color="#ec4899" />
          </div>

          {/* Revenue Card */}
          <div
            style={{
              background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
              borderRadius: "20px",
              padding: "32px",
              marginBottom: "32px",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.7 }}>
                Simulated Revenue
              </div>
              <div style={{ fontSize: "2.5rem", fontWeight: "800", marginTop: "4px" }}>
                ₹{simulatedRevenue.toLocaleString("en-IN")}
              </div>
              <div style={{ fontSize: "0.85rem", opacity: 0.6, marginTop: "4px" }}>
                {stats?.totalAppointments || 0} appointments × ₹{fee}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", opacity: 0.8 }}>Fee per appointment:</label>
              <input
                type="number"
                value={fee}
                onChange={(e) => setFee(Number(e.target.value) || 0)}
                style={{
                  width: "100px",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  border: "2px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                  fontSize: "1rem",
                  fontWeight: "700",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Pending Doctors Table */}
          <div style={{ background: "white", borderRadius: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", overflow: "hidden", marginBottom: "32px" }}>
            <div
              style={{
                padding: "20px 28px",
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#111827", margin: 0 }}>
                <FaHourglassHalf style={{ marginRight: "8px", color: "#f59e0b" }} />
                Pending Doctor Approvals
              </h2>
              <span
                style={{
                  background: pendingDoctors.length > 0 ? "#fef3c7" : "#d1fae5",
                  color: pendingDoctors.length > 0 ? "#92400e" : "#065f46",
                  padding: "4px 14px",
                  borderRadius: "9999px",
                  fontSize: "0.8rem",
                  fontWeight: "700",
                }}
              >
                {pendingDoctors.length} pending
              </span>
            </div>
            {pendingDoctors.length > 0 ? (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f9fafb" }}>
                    <th style={{ padding: "14px 20px", textAlign: "left", fontSize: "0.8rem", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Doctor</th>
                    <th style={{ padding: "14px 20px", textAlign: "left", fontSize: "0.8rem", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Speciality</th>
                    <th style={{ padding: "14px 20px", textAlign: "left", fontSize: "0.8rem", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Experience</th>
                    <th style={{ padding: "14px 20px", textAlign: "left", fontSize: "0.8rem", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Degree</th>
                    <th style={{ padding: "14px 20px", textAlign: "center", fontSize: "0.8rem", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingDoctors.map((doc) => (
                    <tr key={doc._id} style={{ borderBottom: "1px solid #f3f4f6", transition: "background 0.15s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#fafbfc")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <img
                            src={doc.image}
                            alt={doc.name}
                            style={{ width: "40px", height: "40px", borderRadius: "12px", objectFit: "cover" }}
                          />
                          <div>
                            <div style={{ fontWeight: "700", color: "#111827", fontSize: "0.9rem" }}>{doc.name}</div>
                            <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{doc.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{ background: "#ede9fe", color: "#5b21b6", padding: "4px 12px", borderRadius: "8px", fontSize: "0.78rem", fontWeight: "700" }}>{doc.speciality}</span>
                      </td>
                      <td style={{ padding: "14px 20px", color: "#4b5563", fontWeight: "600", fontSize: "0.9rem" }}>{doc.experience}</td>
                      <td style={{ padding: "14px 20px", color: "#4b5563", fontSize: "0.9rem" }}>{doc.degree}</td>
                      <td style={{ padding: "14px 20px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                          <button
                            onClick={() => handleApprove(doc._id)}
                            style={{
                              background: "#10b981",
                              color: "white",
                              border: "none",
                              padding: "8px 18px",
                              borderRadius: "10px",
                              cursor: "pointer",
                              fontWeight: "700",
                              fontSize: "0.8rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              transition: "transform 0.15s, box-shadow 0.15s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.05)";
                              e.currentTarget.style.boxShadow = "0 4px 12px rgba(16,185,129,0.4)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1)";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          >
                            <FaCheckCircle /> Approve
                          </button>
                          <button
                            onClick={() => handleReject(doc._id)}
                            style={{
                              background: "#ef4444",
                              color: "white",
                              border: "none",
                              padding: "8px 18px",
                              borderRadius: "10px",
                              cursor: "pointer",
                              fontWeight: "700",
                              fontSize: "0.8rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              transition: "transform 0.15s, box-shadow 0.15s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.05)";
                              e.currentTarget.style.boxShadow = "0 4px 12px rgba(239,68,68,0.4)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1)";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          >
                            <FaTimesCircle /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: "48px", textAlign: "center", color: "#9ca3af" }}>
                <FaCheckCircle style={{ fontSize: "2rem", marginBottom: "12px", color: "#10b981" }} />
                <p style={{ fontWeight: "600" }}>All caught up! No pending approvals.</p>
              </div>
            )}
          </div>

          {/* Quick Navigation */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
            {[
              { to: "/admindoc", title: "Manage Doctors", desc: "View, block, and unblock doctor accounts", color: "#6366f1", icon: <FaUserDoctor /> },
              { to: "/adminpatient", title: "Manage Patients", desc: "View, block, and unblock patient accounts", color: "#0ea5e9", icon: <FaUser /> },
              { to: "/admin-appointments", title: "All Appointments", desc: "Master view of all bookings & revenue", color: "#10b981", icon: <FaCalendarCheck /> },
              { to: "/admin-ai-insights", title: "AI & ML Insights", desc: "Disease trends pie chart & prediction logs", color: "#ec4899", icon: <FaLungs /> },
              { to: "/admin-chat-logs", title: "Chatbot Monitor", desc: "Conversation logs and bot statistics", color: "#8b5cf6", icon: <FaRobot /> },
            ].map((card) => (
              <Link
                key={card.to}
                to={card.to}
                style={{
                  textDecoration: "none",
                  background: "white",
                  borderRadius: "16px",
                  padding: "24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  border: "1px solid rgba(0,0,0,0.04)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)";
                }}
              >
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: card.color, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "20px", flexShrink: 0 }}>
                  {card.icon}
                </div>
                <div>
                  <div style={{ fontWeight: "700", color: "#111827", fontSize: "1rem" }}>{card.title}</div>
                  <div style={{ fontSize: "0.8rem", color: "#9ca3af", marginTop: "2px" }}>{card.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
