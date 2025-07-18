import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import { faList, faPlus } from "@fortawesome/free-solid-svg-icons";
import ListTable from "../../../components/Guides/ListTable";
import Pagination from "../../../components/Guides/Pagination";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../../context/AuthContext'; 
import axios from 'axios';

interface Guide {
  id: number;
  title: string;
  author_id: number;
  text: string;
  created_at: string;
  authorName: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface GuidesResponse {
  guides: Guide[];
  pagination: PaginationInfo;
}

export default function ListGuidePage() {

    const { user } = useAuth();
    const [canAddGuide, setCanAddGuide] = useState(false);

    const [guides, setGuides] = useState<Guide[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user?.role === "Leader") {
            setCanAddGuide(true);
        }
        if (user?.role === "Lieutenant") {
            setCanAddGuide(true);
        }
        if (user?.role === "Member") {
            setCanAddGuide(false);
        }
    }, [user]);

    const navigate = useNavigate();

    function handleClick() {
        navigate("/guide/add");
    }

    const handleGuideClick = (id: number) => {
        navigate(`/guide/view/${id}`);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    useEffect(() => {
        const fetchGuides = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get<GuidesResponse>(`https://guildmaster-backend.onrender.com/api/guide/list?clan_id=${user?.clan_id}&page=${currentPage}`);
                setGuides(response.data.guides);
                setPagination(response.data.pagination);
            } catch (err) {
                if (axios.isAxiosError(err) && err.response) {
                    setError(err.response.data.message || "Failed to fetch guides.");
                } else {
                    setError("An unexpected error occurred while fetching guides.");
                }
                console.error("Error fetching guides:", err);
            } finally {
                setLoading(false);
            }
        };
        
        if (user?.clan_id) {
            fetchGuides();
        }
    }, [user?.clan_id, currentPage]);

    if (!user) {
        navigate("/login");
        return null;
    }

    

    return (
        <div className="flex flex-col h-screen w-full">
            <Header />
            <div className="flex flex-row h-screen w-full">
                <div className="hidden xl:block">
                    <Sidebar />
                </div>
                <main className={`flex-1 w-full p-2 xl:p-8 max-w-screen-lg mx-auto w-[90%]`}>
                    <div className={`flex flex-row xl:flex-row justify-between items-center mb-4 gap-4`}>
                        <h2 className={`text-2xl font-bold flex items-center gap-2 w-full`}>
                            <FontAwesomeIcon icon={faList} className="text-blue-600" />
                            <span>List of Guides</span>
                        </h2>
                        {canAddGuide && (
                        
                        <div className="flex items-center gap-2 w-full justify-end mt-2 xl:mt-0">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out flex items-center gap-2 w-auto" onClick={handleClick}>
                                <FontAwesomeIcon icon={faPlus} />
                                <span>Add guide</span>
                            </button>
                        </div>
                    )}
                    </div>
                    <div className="w-full mt-4">
                        <ListTable
                            guides={guides}
                            error={error}
                            loading={loading}
                            onGuideClick={handleGuideClick}
                        />
                        <Pagination
                            pagination={pagination}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </main>
            </div>
        </div>
    )
}