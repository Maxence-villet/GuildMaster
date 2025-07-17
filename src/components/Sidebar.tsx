import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListUl, faPlus, faUsersGear, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isDesktop, setIsDesktop] = useState(windowWidth > 1279);
    const { user, logout } = useAuth(); 
    const navigate = useNavigate();

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
        setIsDesktop(window.innerWidth > 1279);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (!user) {
        navigate("/login");
        return null;
    }

    const canManageMembers = ["Leader", "Lieutenant"].includes(user.role);
    const canAddGuide = ["Leader", "Lieutenant"].includes(user.role);
    
    return (
        <div className={`w-64 bg-white shadow-lg shadow-gray-300 h-[calc(100vh-64px)] p-4 ${isDesktop ? "block" : "hidden"}`}>
            <div className="flex flex-col space-x-3 mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        {user.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                        {user.role}
                    </p>
                </div>
                <nav className="mt-8">
                    <ul className="space-y-2 flex flex-col">
                        <li>
                            <div 
                                onClick={() => navigate('/guide/list')} 
                                className="text-blue-600 flex hover:bg-gray-100 p-2 rounded-md flex-row items-center gap-2 cursor-pointer"
                            >
                                <FontAwesomeIcon icon={faListUl} />
                                <span>All guides</span>
                            </div>
                        </li>
                        {canAddGuide && (
                            <li>
                                <div 
                                    onClick={() => navigate('/guide/add')} 
                                    className="text-blue-600 flex hover:bg-gray-100 p-2 rounded-md flex-row items-center gap-2 cursor-pointer"
                                >
                                    <FontAwesomeIcon icon={faPlus} />
                                    <span>Add guide</span>
                                </div>
                            </li>
                        )}
                        {canManageMembers && (
                            <li>
                                <div 
                                    onClick={() => navigate('/member/list')} 
                                    className="text-blue-600 flex hover:bg-gray-100 p-2 rounded-md flex-row items-center gap-2 cursor-pointer"
                                >
                                    <FontAwesomeIcon icon={faUsersGear} />
                                    <span>Manage member</span>
                                </div>
                            </li>
                        )}
                        <li>
                            <button 
                                onClick={handleLogout} 
                                className="text-red-600 flex hover:bg-gray-100 p-2 rounded-md flex-row items-center gap-2 w-full text-left"
                            >
                                <FontAwesomeIcon icon={faSignOutAlt} />
                                <span>Logout</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}