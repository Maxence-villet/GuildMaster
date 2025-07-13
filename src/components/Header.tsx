import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff, faBars, faTachometerAlt, faUserGear, faPlus} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom'; // Importer useNavigate
import { useAuth } from '../context/AuthContext'; // Importer useAuth





export default function Header() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate(); // Initialiser useNavigate
  const { user, logout } = useAuth();

    useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

      useEffect(() => {
        if (!user) {
        navigate("/login");
        }
    }, [user, navigate]);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
    if (window.innerWidth >= 1279) setMenuOpen(false); // Close menu on desktop
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  const navItems = [
    { path: "/guide/list", icon: faTachometerAlt, label: "All Guides" },
  ];

  if(user.role === "Leader") {
    navItems.push({ path: "/guide/add", icon: faPlus, label: "Add Guide" });
    navItems.push({ path: "/member/list", icon: faUserGear, label: "Manage members"})
  }


  const handleLogout = () => {
    console.log("Déconnexion...");
    logout();
    navigate('/login');
  };



  return (
    <>
      {/* Desktop Header */}
      <header className={`bg-white shadow-sm p-4 flex justify-between items-center ${windowWidth > 1279 ? "block" : "hidden"}`}>
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">VA5 Family</h1>
        </div>
        <div className="flex items-center">
          {/* Utilisation d'un bouton pour la déconnexion */}
          <button 
            onClick={handleLogout} 
            className="text-red-600 flex hover:bg-gray-100 p-2 rounded-md flex-row items-center gap-2 cursor-pointer"
            aria-label="Logout"
          >
            <FontAwesomeIcon icon={faPowerOff} />
          </button>
        </div>
      </header>

      {/* Mobile Header with Burger Menu */}
      <header className={`bg-white shadow-sm p-4 flex justify-between items-center ${windowWidth < 1279 ? "block" : "hidden"} relative`}>
        <div className="flex items-center">
          <button
            className="text-2xl p-2 focus:outline-none"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Open navigation menu"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <h1 className="text-2xl font-bold ml-4">VA5 Family</h1>
        </div>
        <div className="flex items-center">
          {/* Utilisation d'un bouton pour la déconnexion */}
          <button 
            onClick={handleLogout} 
            className="text-red-600 flex hover:bg-gray-100 p-2 rounded-md flex-row items-center gap-2 cursor-pointer"
            aria-label="Logout"
          >
            <FontAwesomeIcon icon={faPowerOff} />
          </button>
        </div>
        {/* Dropdown menu */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setMenuOpen(false)}
          ></div>
        )}
        {/* Side Drawer */}
        <nav
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
            ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
          style={{ maxWidth: "80vw" }}
        >
          <div className="flex flex-col h-full p-4">
            <button
              className="self-end text-2xl mb-4 focus:outline-none"
              onClick={() => setMenuOpen(false)}
              aria-label="Fermer le menu"
            >
              ×
            </button>
            <ul className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <li key={item.path}> {/* Utilisation de 'item.path' pour la clé */}
                  {/* Utilisation d'un div cliquable pour la navigation */}
                  <div
                    onClick={() => {
                      navigate(item.path); // Naviguer vers le chemin spécifié
                      setMenuOpen(false); // Fermer le menu après la navigation
                    }}
                    className="text-blue-600 flex hover:bg-gray-100 p-2 rounded-md flex-row items-center gap-2 cursor-pointer"
                  >
                    <FontAwesomeIcon icon={item.icon} />
                    <span>{item.label}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
}