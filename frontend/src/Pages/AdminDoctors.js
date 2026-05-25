import React, { useEffect, useState } from "react";
import AdminHeader from "../Components/AdminHeader";
import axios from "axios";
import { FaLock, FaLockOpen, FaCheckCircle, FaHourglassHalf, FaBan } from "react-icons/fa";

const statusBadge = (status) => {
  const map = {
    approved: { bg: "#d1fae5", color: "#065f46", icon: <FaCheckCircle />, label: "Approved" },
    pending: { bg: "#fef3c7", color: "#92400e", icon: <FaHourglassHalf />, label: "Pending" },
    blocked: { bg: "#fee2e2", color: "#991b1b", icon: <FaBan />, label: "Blocked" },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{ background: s.bg, color: s.color, padding: "4px 12px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "4px" }}>
      {s.icon} {s.label}
    </span>
  );
};

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [totalDoc, setTotalDocs] = useState(0);
  const [actionLoading, setActionLoading] = useState(null);

  const getDocs = async () => {
    try {
      const { data } = await axios.get("/api/v1/doctors/allDoctors");
      if (data?.success) {
        setDoctors(data?.doctors);
        setTotalDocs(data?.totalDoctors);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDocs();
  }, []);

  const handleBlock = async (id) => {
    if (!window.confirm("Are you sure you want to block this doctor?")) return;
    setActionLoading(id);
    try {
      await axios.put(`/api/v1/admin/block-doctor/${id}`);
      getDocs();
    } catch (err) {
      console.error("Error blocking doctor:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblock = async (id) => {
    setActionLoading(id);
    try {
      await axios.put(`/api/v1/admin/unblock-doctor/${id}`);
      getDocs();
    } catch (err) {
      console.error("Error unblocking doctor:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await axios.put(`/api/v1/admin/approve-doctor/${id}`);
      getDocs();
    } catch (err) {
      console.error("Error approving doctor:", err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      <AdminHeader />
      <div style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #e8ecf4 100%)", minHeight: "calc(100vh - 64px)", padding: "32px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ background: "white", borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <div style={{ background: "linear-gradient(135deg, #1e1b4b, #312e81)", color: "white", padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h1 style={{ fontSize: "1.4rem", fontWeight: "800", margin: 0 }}>Manage Doctors</h1>
              <span style={{ background: "rgba(255,255,255,0.15)", padding: "6px 16px", borderRadius: "9999px", fontSize: "0.85rem", fontWeight: "700" }}>Total: {totalDoc}</span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
                    {["Image", "Name", "Email", "Speciality", "Appointments", "Reports", "Status", "Joined", "Actions"].map((h) => (
                      <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: "0.76rem", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor) => (
                    <tr key={doctor._id} style={{ borderBottom: "1px solid #f3f4f6", transition: "background 0.15s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#fafbfc")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "12px 16px" }}>
                        <img src={doctor.image} alt={doctor.name} style={{ width: "40px", height: "40px", borderRadius: "12px", objectFit: "cover", border: "2px solid #e5e7eb" }} />
                      </td>
                      <td style={{ padding: "12px 16px", fontWeight: "700", color: "#111827", fontSize: "0.9rem" }}>{doctor.name}</td>
                      <td style={{ padding: "12px 16px", color: "#6b7280", fontSize: "0.85rem" }}>{doctor.email}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ background: "#ede9fe", color: "#5b21b6", padding: "3px 10px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "700" }}>{doctor.speciality}</span>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "center", fontWeight: "700", color: "#374151" }}>{doctor.appointments?.length || 0}</td>
                      <td style={{ padding: "12px 16px", textAlign: "center", fontWeight: "700", color: "#374151" }}>{doctor.reports?.length || 0}</td>
                      <td style={{ padding: "12px 16px" }}>{statusBadge(doctor.accountStatus)}</td>
                      <td style={{ padding: "12px 16px", color: "#9ca3af", fontSize: "0.8rem" }}>
                        {doctor.createdAt ? new Date(doctor.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", gap: "6px" }}>
                          {doctor.accountStatus === "pending" && (
                            <button
                              onClick={() => handleApprove(doctor._id)}
                              disabled={actionLoading === doctor._id}
                              style={{ background: "#10b981", color: "white", border: "none", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px", opacity: actionLoading === doctor._id ? 0.6 : 1 }}
                            >
                              <FaCheckCircle /> Approve
                            </button>
                          )}
                          {doctor.accountStatus === "blocked" ? (
                            <button
                              onClick={() => handleUnblock(doctor._id)}
                              disabled={actionLoading === doctor._id}
                              style={{ background: "#0ea5e9", color: "white", border: "none", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px", opacity: actionLoading === doctor._id ? 0.6 : 1 }}
                            >
                              <FaLockOpen /> Unblock
                            </button>
                          ) : doctor.accountStatus === "approved" ? (
                            <button
                              onClick={() => handleBlock(doctor._id)}
                              disabled={actionLoading === doctor._id}
                              style={{ background: "#ef4444", color: "white", border: "none", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px", opacity: actionLoading === doctor._id ? 0.6 : 1 }}
                            >
                              <FaLock /> Block
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDoctors;
