import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import { faList, faPlus } from "@fortawesome/free-solid-svg-icons";
import ListMembers from "../../../components/Members/List";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

interface Member {
  id: number;
  name: string;
  code: string;
  role: 'Member' | 'Lieutenant' | 'Leader';
}

export default function ListMembersPage() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isDesktop, setIsDesktop] = useState(windowWidth > 1279);
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { user } = useAuth();
    const navigate = useNavigate();
    const API_BASE_URL = 'http://localhost:3001/api/member';

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
        setIsDesktop(window.innerWidth > 1279);
    };

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
    }, [user, navigate]);

    const fetchMembers = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/list`);
            setMembers(response.data);
        } catch (err) {
            setError("Failed to fetch members. Please try again later.");
            console.error("Error fetching members:", err);
            toast.error("Failed to fetch members.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code).then(() => {
            toast.success("Code copied to clipboard!");
        }).catch(err => {
            console.error("Failed to copy text: ", err);
            toast.error("Failed to copy code.");
        });
    };

    const handleDeleteMember = async (memberId: number, memberName: string) => {
        if (!window.confirm(`Are you sure you want to delete ${memberName}?`)) {
            return;
        }

        try {
            await axios.delete(`${API_BASE_URL}/delete/${memberId}`);
            toast.success(`Member ${memberName} deleted successfully!`);
            fetchMembers();
        } catch (err: any) {
            console.error(`Error deleting member ${memberName}:`, err);
            toast.error(`Failed to delete member ${memberName}: ${err.message}`);
        }
    };

    function handleClick() {
        navigate("/member/add");
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex flex-col h-screen w-full">
            <Header />
            <div className="flex flex-row h-screen w-full">
                <div className="hidden xl:block">
                    <Sidebar />
                </div>
                <main className={`flex-1 w-full p-2 xl:p-8 max-w-screen-lg mx-auto ${isDesktop ? "w-full" : "w-[90%]"}`}>
                    <div className={`flex flex-row xl:flex-row justify-between items-center mb-4 gap-4`}>
                        <h2 className={`text-2xl font-bold flex items-center gap-2 w-full`}>
                            <FontAwesomeIcon icon={faList} className="text-blue-600" />
                            <span>List of Members</span>
                        </h2>
                        <div className="flex items-center gap-2 w-full justify-end mt-2 xl:mt-0">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out flex items-center gap-2 w-auto" onClick={handleClick}>
                                <FontAwesomeIcon icon={faPlus} />
                                <span>Add member</span>
                            </button>
                        </div>
                    </div>
                    <div className="w-full mt-4">
                        <Toaster />
                        <ListMembers
                            members={members}
                            error={error}
                            loading={loading}
                            user={user}
                            onCopyCode={handleCopyCode}
                            onDeleteMember={handleDeleteMember}
                        />
                    </div>
                </main>
            </div>
        </div>
    )
}