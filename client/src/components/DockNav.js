import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  VscAccount,
  VscAdd,
  VscHome,
  VscOrganization,
  VscBell,
} from "react-icons/vsc";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import Dock from "./Dock";

export default function DockNav() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    document.body.classList.add("dock-safe-root");
    return () => {
      document.body.classList.remove("dock-safe-root");
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchUnread = async () => {
      try {
        const res = await API.get("/api/notifications");
        const unread = res.data.filter((n) => !n.read).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);

    return () => clearInterval(interval);
  }, [user]);

  const publicItems = [
    { label: "Home", path: "/", icon: <VscHome size={18} /> },
  ];

  const privateItems = [
    { label: "Home", path: "/", icon: <VscHome size={18} /> },
    { label: "Community", path: "/community", icon: <VscOrganization size={18} /> },
    { label: "Create", path: "/create", icon: <VscAdd size={18} /> },
    { label: "Profile", path: "/profile", icon: <VscAccount size={18} /> },
    {
      label: "Alerts",
      path: "/notifications",
      icon: (
        <div style={{ position: "relative" }}>
          <VscBell size={18} />
          {unreadCount > 0 && (
            <div
              style={{
                position: "absolute",
                top: "-6px",
                right: "-6px",
                background: "#ef4444",
                color: "#fff",
                borderRadius: "50%",
                width: "14px",
                height: "14px",
                fontSize: "9px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </div>
          )}
        </div>
      ),
    },
  ];

  const items = (user ? privateItems : publicItems).map((item) => ({
    icon: item.icon,
    label: item.label,
    className: location.pathname === item.path ? "dock-item-active" : "",
    onClick: () => navigate(item.path),
  }));

  return (
    <Dock
      items={items}
      panelHeight={75}
      baseItemSize={48}
      magnification={64}
      distance={180}
      dockHeight={260}
    />
  );
}