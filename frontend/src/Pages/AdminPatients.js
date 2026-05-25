import React, { useEffect, useState } from "react";
import AdminHeader from "../Components/AdminHeader";
import axios from "axios";
import { FaUser, FaLock, FaLockOpen, FaCheckCircle, FaBan } from "react-icons/fa";

const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);

  const getPatients = async () => {
    try {
      const { data } = await axios.get("/api/v1/patients/getAllPatient");
      if (data?.success) {
        setPatients(data?.patients);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPatients();
  }, []);

  const handleBlock = async (id) => {
    if (!window.confirm("Are you sure you want to block this patient?")) return;
    setActionLoading(id);
    try {
      await axios.put(`/api/v1/admin/block-patient/${id}`);
      getPatients();
    } catch (err) {
      console.error("Error blocking patient:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblock = async (id) => {
    setActionLoading(id);
    try {
      await axios.put(`/api/v1/admin/unblock-patient/${id}`);
      getPatients();
    } catch (err) {
      console.error("Error unblocking patient:", err);
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
            <div style={{ background: "linear-gradient(135deg, #0c4a6e, #0369a1)", color: "white", padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h1 style={{ fontSize: "1.4rem", fontWeight: "800", margin: 0 }}>Manage Patients</h1>
              <span style={{ background: "rgba(255,255,255,0.15)", padding: "6px 16px", borderRadius: "9999px", fontSize: "0.85rem", fontWeight: "700" }}>Total: {patients.length}</span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
                    {["", "Name", "Email", "Status", "Joined", "Actions"].map((h) => (
                      <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: "0.78rem", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => {
                    const isBlocked = patient.accountStatus === "blocked";
                    return (
                      <tr key={patient._id} style={{ borderBottom: "1px solid #f3f4f6", transition: "background 0.15s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#fafbfc")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <td style={{ padding: "12px 20px" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: isBlocked ? "#fee2e2" : "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", color: isBlocked ? "#ef4444" : "#3b82f6" }}>
                            <FaUser />
                          </div>
                        </td>
                        <td style={{ padding: "12px 20px", fontWeight: "700", color: "#111827", fontSize: "0.9rem" }}>{patient.name}</td>
                        <td style={{ padding: "12px 20px", color: "#6b7280", fontSize: "0.85rem" }}>{patient.email}</td>
                        <td style={{ padding: "12px 20px" }}>
                          {isBlocked ? (
                            <span style={{ background: "#fee2e2", color: "#991b1b", padding: "4px 12px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                              <FaBan /> Blocked
                            </span>
                          ) : (
                            <span style={{ background: "#d1fae5", color: "#065f46", padding: "4px 12px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                              <FaCheckCircle /> Active
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "12px 20px", color: "#9ca3af", fontSize: "0.8rem" }}>
                          {patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : "N/A"}
                        </td>
                        <td style={{ padding: "12px 20px" }}>
                          {isBlocked ? (
                            <button
                              onClick={() => handleUnblock(patient._id)}
                              disabled={actionLoading === patient._id}
                              style={{
                                background: "#0ea5e9", color: "white", border: "none", padding: "7px 16px",
                                borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "0.78rem",
                                display: "flex", alignItems: "center", gap: "4px",
                                opacity: actionLoading === patient._id ? 0.6 : 1,
                                transition: "transform 0.15s",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            >
                              <FaLockOpen /> Unblock
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBlock(patient._id)}
                              disabled={actionLoading === patient._id}
                              style={{
                                background: "#ef4444", color: "white", border: "none", padding: "7px 16px",
                                borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "0.78rem",
                                display: "flex", alignItems: "center", gap: "4px",
                                opacity: actionLoading === patient._id ? 0.6 : 1,
                                transition: "transform 0.15s",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            >
                              <FaLock /> Block
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPatients;
