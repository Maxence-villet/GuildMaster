import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListUl, faPlus, faUsersGear,  faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isDesktop, setIsDesktop] = useState(windowWidth > 1279);

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
        setIsDesktop(window.innerWidth > 1279);
    };

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className={`w-64 bg-white shadow-lg shadow-gray-300 h-screen p-4 ${isDesktop ? "block" : "hidden"}`}>
            <div className="flex flex-col space-x-3 mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        Cris
                    </h2>
                    <p className="text-sm text-gray-500">
                        Leader
                    </p>
                </div>
                <nav className="mt-8">
                    <ul className="space-y-2 flex flex-col">
                        <li>
                            <a href="/guide/list" className="text-blue-600 flex hover:bg-gray-100 p-2 rounded-md flex-row items-center gap-2">
                                <FontAwesomeIcon icon={faListUl} />
                                <span>All guides</span>
                            </a>
                        </li>
                        <li>
                            <a href="/guide/add" className="text-blue-600 flex hover:bg-gray-100 p-2 rounded-md flex-row items-center gap-2">
                                <FontAwesomeIcon icon={faPlus} />
                                <span>Add guide</span>
                            </a>
                        </li>
                        <li>
                            <a href="/member/list" className="text-blue-600 flex hover:bg-gray-100 p-2 rounded-md flex-row items-center gap-2">
                                <FontAwesomeIcon icon={faUsersGear} />
                                <span>Manage member</span>
                            </a>
                        </li>
                        <li>
                            <a href="/logout" className="text-red-600 flex hover:bg-gray-100 p-2 rounded-md flex-row items-center gap-2">
                                <FontAwesomeIcon icon={faSignOutAlt} />
                                <span>Logout</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}