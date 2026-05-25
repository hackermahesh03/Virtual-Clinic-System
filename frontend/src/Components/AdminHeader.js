import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaUserDoctor,
  FaChartPie,
} from "react-icons/fa6";
import {
  MdDashboard,
  MdEventNote,
  MdSmartToy,
  MdLogout,
} from "react-icons/md";
import { FaUser } from "react-icons/fa";

const AdminHeader = () => {
  const location = useLocation();

  const navItems = [
    { to: "/admin-dashboard", icon: <MdDashboard />, label: "Dashboard" },
    { to: "/admindoc", icon: <FaUserDoctor />, label: "Doctors" },
    { to: "/adminpatient", icon: <FaUser />, label: "Patients" },
    { to: "/admin-appointments", icon: <MdEventNote />, label: "Appointments" },
    { to: "/admin-ai-insights", icon: <FaChartPie />, label: "AI Insights" },
    { to: "/admin-chat-logs", icon: <MdSmartToy />, label: "Chatbot" },
  ];

  return (
    <div className="header bg-black text-white flex justify-between items-center px-6 py-4 shadow-lg">
      <Link to="/admin-dashboard" className="font-bold text-2xl tracking-tight hover:opacity-80 transition-opacity" style={{ textDecoration: 'none', color: 'white' }}>
        AI CareNet <span style={{ fontSize: '0.7rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', padding: '2px 8px', borderRadius: '9999px', marginLeft: '8px', fontWeight: '600' }}>ADMIN</span>
      </Link>
      <div className="flex items-center gap-1" style={{ fontSize: '0.9rem' }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              style={{
                textDecoration: 'none',
                color: isActive ? '#fff' : '#9ca3af',
                background: isActive ? 'rgba(99,102,241,0.3)' : 'transparent',
                padding: '8px 14px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                fontSize: '0.85rem',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = '#9ca3af';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            color: '#f87171',
            padding: '8px 14px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: '600',
            marginLeft: '8px',
            fontSize: '0.85rem',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(248,113,113,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <MdLogout />
          Logout
        </Link>
      </div>
    </div>
  );
};

export default AdminHeader;
