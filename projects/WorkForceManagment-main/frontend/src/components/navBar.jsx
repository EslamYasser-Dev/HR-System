import { Link, useLocation, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { Badge } from "@tremor/react";
import {
  RiHomeLine,
  RiUserLine,
  RiDashboardLine,
  RiUserStarLine,
  RiCameraLine,
  RiMenuLine,
  RiCloseLine,
} from "@remixicon/react";
import { useSocketDataContext } from '../context/SocketDataContext';

const NAV_LINKS = [
  {
    to: "/",
    icon: RiHomeLine,
    label: "Home",
    activeColor: "text-blue-500",
    inactiveColor: "text-gray-600",
  },
  {
    to: "/cameras",
    icon: RiCameraLine,
    label: "Cameras",
    activeColor: "text-purple-500",
    inactiveColor: "text-gray-600",
  },
  {
    to: "/employees",
    icon: RiUserLine,
    label: "Employees",
    activeColor: "text-green-500",
    inactiveColor: "text-gray-600",
  },
  {
    to: "/attendance",
    icon: RiUserStarLine,
    label: "Outs Histrory",
    activeColor: "text-red-500",
    inactiveColor: "text-gray-600",

  },
  {
    to: "/Monitoring",
    icon: RiDashboardLine,
    label: "Monitoring",
    activeColor: "text-orange-500",
    inactiveColor: "text-gray-600",
  },

];

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="fixed top-0 left-0 w-screen shadow-md bg-white dark:bg-gray-900 z-50 backdrop-blur-sm">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-1">
        <Link to="/">
          <img src="/logo.webp" alt="Greenmea" className="w-24" />
        </Link>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls={isMenuOpen ? "navbar-default" : ""}
          aria-expanded={isMenuOpen ? "true" : "false"}
        >
          <span className="sr-only">Open main menu</span>
          {isMenuOpen ? <RiCloseLine className="w-5 h-5" /> : <RiMenuLine className="w-5 h-5" />}
        </button>

        <div className={`w-full md:block md:w-auto ${isMenuOpen ? "block" : "hidden"}`} id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {NAV_LINKS.map(({ to, icon: Icon, label, activeColor, inactiveColor }, index) => (
              <li key={index}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center py-2 px-3 ${isActive ? activeColor : inactiveColor} hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent`}
                  aria-current={pathname === to ? "page" : undefined}
                >
                  <Icon className={`mr-2 ${pathname === to ? activeColor : inactiveColor}`} />
                  {label}
                </NavLink>
              </li>
            ))}
            {/* {outs !== 0 && <Badge color="red">{outs}</Badge>} */}

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
