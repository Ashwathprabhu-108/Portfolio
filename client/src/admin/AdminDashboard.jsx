import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProjectsManager from "./ProjectsManager";
import SkillsManager from "./SkillsManager";
import CertificatesManager from "./CertificatesManager";

const TABS = ["Projects", "Skills", "Certificates"];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Projects");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-wrapper">
      <header className="admin-nav">
        <div className="admin-nav-logo">
          ash<span>.</span>admin
        </div>
        <div className="admin-nav-right">
          <a href="/" target="_blank" className="btn btn-ghost btn-sm">
            View Site ↗
          </a>
          <button onClick={handleLogout} className="btn btn-outline btn-sm">
            Sign Out
          </button>
        </div>
      </header>

      <main className="admin-content">
        <div className="admin-tabs">
          {TABS.map((t) => (
            <button
              key={t}
              className={`admin-tab ${activeTab === t ? "active" : ""}`}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {activeTab === "Projects" && <ProjectsManager />}
        {activeTab === "Skills" && <SkillsManager />}
        {activeTab === "Certificates" && <CertificatesManager />}
      </main>
    </div>
  );
}
