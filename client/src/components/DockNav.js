import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  VscAccount,
  VscAdd,
  VscHome,
  VscOrganization,
  VscSignOut
} from "react-icons/vsc";
import { AuthContext } from "../context/AuthContext";
import Dock from "./Dock";

export default function DockNav() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.body.classList.add("dock-safe-root");
    return () => {
      document.body.classList.remove("dock-safe-root");
    };
  }, []);

  const publicItems = [
    { label: "Home", path: "/", icon: <VscHome size={18} /> },
  ];

  const privateItems = [
    { label: "Home", path: "/", icon: <VscHome size={18} /> },
    { label: "Community", path: "/community", icon: <VscOrganization size={18} /> },
    { label: "Create", path: "/create", icon: <VscAdd size={18} /> },
    { label: "Profile", path: "/profile", icon: <VscAccount size={18} /> },
];

  const coreItems = (user ? privateItems : publicItems).map((item) => ({
    icon: item.icon,
    label: item.label,
    className: location.pathname === item.path ? "dock-item-active" : "",
    onClick: () => navigate(item.path),
  }));

  const items = user
    ? [
        ...coreItems,
        {
          icon: <VscSignOut size={18} />,
          label: "Logout",
          onClick: () => {
            logout();
            window.location.replace("/");
          },
        },
      ]
    : coreItems;

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