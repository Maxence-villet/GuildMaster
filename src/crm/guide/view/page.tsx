import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import ViewGuide from "../../../components/Guides/View";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

interface Guide {
  id: number;
  title: string;
  author_id: number;
  authorName: string;
  text: string;
  created_at: string;
}

export default function ViewGuidePage() {
    const { id } = useParams<{ id: string }>();
    const [guide, setGuide] = useState<Guide | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    const { user } = useAuth();
    const navigate = useNavigate();
    const API_BASE_URL = 'http://localhost:3001/api/guide';

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchGuide = async () => {
            if (!id) {
                setError("Guide ID is missing from URL.");
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get<Guide>(`${API_BASE_URL}/${id}`);
                setGuide(response.data);
            } catch (err) {
                if (axios.isAxiosError(err) && err.response) {
                    setError(err.response.data.message || "Failed to fetch guide.");
                } else {
                    setError("An unexpected error occurred while fetching the guide.");
                }
                console.error("Error fetching guide:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchGuide();
    }, [id, API_BASE_URL]);

    const handleDelete = async () => {
        if (!guide || !user || guide.author_id !== user.id) {
            toast.error("You are not authorized to delete this guide.");
            return;
        }

        if (window.confirm("Are you sure you want to delete this guide?")) {
            try {
                await axios.delete(`${API_BASE_URL}/delete/${guide.id}`);
                toast.success("Guide deleted successfully!");
                navigate("/guide/list"); 
            } catch (err) {
                if (axios.isAxiosError(err) && err.response) {
                    toast.error(err.response.data.message || "Failed to delete guide.");
                } else {
                    toast.error("An unexpected error occurred while deleting the guide.");
                }
                console.error("Error deleting guide:", err);
            }
        }
    };

    const canDelete = Boolean(user && guide && guide.author_id === user.id);

    return (
        <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-row h-screen">
                <Sidebar />
                <main className="flex-1 p-8">
                    <div className="w-[90%] mx-auto">
                        <Toaster />
                        <ViewGuide
                            guide={guide}
                            loading={loading}
                            error={error}
                            canDelete={canDelete}
                            onDelete={handleDelete}
                        />
                    </div>
                </main>
            </div>
        </div>
    )
}