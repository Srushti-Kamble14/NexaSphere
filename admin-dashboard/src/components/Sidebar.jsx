import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AdminIcon } from "./AdminIcon";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: "Dashboard" },
  { to: "/dashboard/events", label: "Events", icon: "Calendar" },
  {
    to: "/dashboard/activity-events",
    label: "Activity Events",
    icon: "Target",
  },
  { to: "/dashboard/core-team", label: "Core Team", icon: "Users" },
  { to: "/dashboard/membership", label: "Membership", icon: "FileText" },
  { to: "/dashboard/certificates", label: "Certificates", icon: "Award" },
];

export function Sidebar() {
  const { email, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <>
      {/* ── Mobile hamburger button ── */}
      <button
        className="sidebar-hamburger"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={`ham-line${open ? " open" : ""}`} />
        <span className={`ham-line${open ? " open" : ""}`} />
        <span className={`ham-line${open ? " open" : ""}`} />
      </button>

      {/* ── Backdrop (mobile only) ── */}
      {open && (
        <div className="sidebar-backdrop" onClick={close} aria-hidden="true" />
      )}

      <aside className={`sidebar${open ? " sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <span className="brand-dot" />
          <span>NexaSphere Admin</span>
        </div>
        <nav className="sidebar-nav">
          {links.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/dashboard"}
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
              onClick={close}
            >
              <AdminIcon name={icon} size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className="sidebar-email">{email}</span>
          <button className="btn-logout" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
