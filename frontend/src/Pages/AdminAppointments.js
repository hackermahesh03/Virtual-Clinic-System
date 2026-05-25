import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "../Components/AdminHeader";
import { FaSearch, FaMoneyBillWave, FaCalendarCheck } from "react-icons/fa";

const statusColors = {
  Pending: { bg: "#fef3c7", color: "#92400e" },
  Confirmed: { bg: "#d1fae5", color: "#065f46" },
  Cancelled: { bg: "#fee2e2", color: "#991b1b" },
  Completed: { bg: "#dbeafe", color: "#1e40af" },
};

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [fee, setFee] = useState(500);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get("/api/v1/admin/appointments");
        if (data.success) {
          setAppointments(data.appointments);
          setFiltered(data.appointments);
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  useEffect(() => {
    let result = appointments;
    if (statusFilter !== "All") {
      result = result.filter((a) => a.status === statusFilter);
    }
    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.doctorID?.name?.toLowerCase().includes(s) ||
          a.patientID?.name?.toLowerCase().includes(s) ||
          a.date?.includes(s) ||
          a.time?.toLowerCase().includes(s)
      );
    }
    setFiltered(result);
  }, [search, statusFilter, appointments]);

  const simulatedRevenue = appointments.length * fee;

  return (
    <>
      <AdminHeader />
      <div style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #e8ecf4 100%)", minHeight: "calc(100vh - 64px)", padding: "32px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          {/* Header */}
          <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#111827", marginBottom: "8px" }}>Master Appointment View</h1>
          <p style={{ color: "#6b7280", marginBottom: "24px", fontSize: "0.95rem" }}>All bookings across the platform</p>

          {/* Revenue Card */}
          <div
            style={{
              background: "linear-gradient(135deg, #065f46 0%, #047857 50%, #10b981 100%)",
              borderRadius: "20px",
              padding: "28px 32px",
              marginBottom: "24px",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
                <FaMoneyBillWave />
              </div>
              <div>
                <div style={{ fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.75 }}>Simulated Revenue</div>
                <div style={{ fontSize: "2.2rem", fontWeight: "800" }}>₹{simulatedRevenue.toLocaleString("en-IN")}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: "600", opacity: 0.8 }}>
                {appointments.length} appointments × ₹
              </span>
              <input
                type="number"
                value={fee}
                onChange={(e) => setFee(Number(e.target.value) || 0)}
                style={{
                  width: "90px",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  border: "2px solid rgba(255,255,255,0.25)",
                  background: "rgba(255,255,255,0.12)",
                  color: "white",
                  fontSize: "1rem",
                  fontWeight: "700",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Filters */}
          <div style={{ background: "white", borderRadius: "16px", padding: "16px 20px", marginBottom: "20px", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
              <FaSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
              <input
                type="text"
                placeholder="Search by doctor, patient, date..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 36px",
                  borderRadius: "10px",
                  border: "2px solid #e5e7eb",
                  fontSize: "0.9rem",
                  outline: "none",
                  transition: "border 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>
            {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "10px",
                  border: "2px solid",
                  borderColor: statusFilter === s ? "#6366f1" : "#e5e7eb",
                  background: statusFilter === s ? "#eef2ff" : "white",
                  color: statusFilter === s ? "#4338ca" : "#6b7280",
                  fontWeight: "700",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Table */}
          <div style={{ background: "white", borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            {loading ? (
              <div style={{ padding: "60px", textAlign: "center", color: "#9ca3af" }}>Loading appointments...</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: "60px", textAlign: "center", color: "#9ca3af" }}>
                <FaCalendarCheck style={{ fontSize: "2rem", marginBottom: "12px", opacity: 0.3 }} />
                <p style={{ fontWeight: "600" }}>No appointments found</p>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
                    {["Patient", "Doctor", "Speciality", "Date", "Time", "Status"].map((h) => (
                      <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: "0.78rem", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((apt) => {
                    const sc = statusColors[apt.status] || { bg: "#f3f4f6", color: "#374151" };
                    return (
                      <tr key={apt._id} style={{ borderBottom: "1px solid #f3f4f6", transition: "background 0.15s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#fafbfc")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <td style={{ padding: "14px 20px", fontWeight: "600", color: "#111827", fontSize: "0.9rem" }}>{apt.patientID?.name || "N/A"}</td>
                        <td style={{ padding: "14px 20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            {apt.doctorID?.image && (
                              <img src={apt.doctorID.image} alt="" style={{ width: "32px", height: "32px", borderRadius: "8px", objectFit: "cover" }} />
                            )}
                            <span style={{ fontWeight: "600", color: "#111827", fontSize: "0.9rem" }}>{apt.doctorID?.name || "N/A"}</span>
                          </div>
                        </td>
                        <td style={{ padding: "14px 20px" }}>
                          <span style={{ background: "#f0e7ff", color: "#6d28d9", padding: "3px 10px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "700" }}>{apt.doctorID?.speciality || "N/A"}</span>
                        </td>
                        <td style={{ padding: "14px 20px", color: "#4b5563", fontWeight: "500", fontSize: "0.9rem" }}>{apt.date}</td>
                        <td style={{ padding: "14px 20px", color: "#4b5563", fontWeight: "500", fontSize: "0.9rem" }}>{apt.time}</td>
                        <td style={{ padding: "14px 20px" }}>
                          <span style={{ background: sc.bg, color: sc.color, padding: "4px 14px", borderRadius: "8px", fontSize: "0.78rem", fontWeight: "700" }}>{apt.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          <div style={{ textAlign: "center", padding: "16px", color: "#9ca3af", fontSize: "0.85rem" }}>
            Showing {filtered.length} of {appointments.length} appointments
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminAppointments;
