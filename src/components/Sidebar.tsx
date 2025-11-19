import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListUl, faPlus, faUsersGear, faSignOutAlt, faUser, faCrown, faDragon, faPersonRifle } from "@fortawesome/free-solid-svg-icons";
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

    const canManagemembers = ["leader", "lieutenant"].includes(user.role);
    const canAddGuide = ["leader", "lieutenant"].includes(user.role);


    const getRoleColor = (role: string) => {
        if (role === "leader") return "bg-yellow-500";
        if (role === "lieutenant") return "bg-red-500";
        if (role === "member") return "bg-green-500";
        return "bg-gray-600";
    }

    const getRoleIcon = (role: string) => {
        if (role === "leader") return faCrown;
        if (role === "lieutenant") return faDragon;
        if (role === "member") return faPersonRifle;
        return faUser;
    }

    const getRoleIconColor = (role: string) => {
        if (role === "leader") return "text-yellow-300";
        if (role === "lieutenant") return "text-red-300";
        if (role === "member") return "text-green-300";
        return "text-gray-500";
    }
    
    
    return (
        <div className={`w-64 bg-white shadow-lg shadow-gray-300 h-[calc(100vh-64px)] p-4 ${isDesktop ? "block" : "hidden"}`}>
            <div className="flex flex-col h-full">
                <div className="flex-1">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">
                            {user.name}
                        </h2>
                        <div className="flex flex-row items-center gap-2 rounded-md ">
                            <div className={`w-5 h-5 rounded-full ${getRoleColor(user.role)} flex items-center justify-center`}>
                                <FontAwesomeIcon icon={getRoleIcon(user.role)} className={`${getRoleIconColor(user.role)} w-3 h-3`} />
                            </div>
                            <p className="text-sm text-gray-500">
                                {user.role}
                            </p>
                        </div>
                        
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
                            {canManagemembers && (
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
                        </ul>
                    </nav>
                </div>
                <hr className="my-2 border-gray-200" />
                <div className="mt-auto">
                    <button
                        onClick={handleLogout} 
                        className="text-red-600 flex hover:bg-gray-100 p-2 rounded-md flex-row items-center gap-2 w-full text-left"
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
}