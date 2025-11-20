import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddGuide from "../../../components/Guides/Add";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRoleGuard } from '../../../hooks/useRoleGuard';

export default function AddGuidePage() {
    useRoleGuard();
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleAddGuide = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!user) {
            navigate("/login");
            return;
        }

        if (!title.trim() || !text.trim()) {
            toast.error('Title and text cannot be empty.');
            return;
        }

        setLoading(true);
        try {
            await axios.post(
  "https://guildmaster-backend-fastapi.onrender.com/guides/add",
  { title, author_id: user.id, text }, // body
  {
    headers: { "X-CSRF-Token": window._csrfToken! }
  }
);
            toast.success('Guide added successfully!');
            setTitle('');
            setText('');
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(`Error: ${error.response.data.message || 'Something went wrong.'}`);
            } else {
                toast.error('An unexpected error occurred.');
            }
            console.error('Error adding guide:', error);
        } finally {
            setLoading(false);
        }
    };

    

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
                        <FontAwesomeIcon icon={faPlus} className="text-blue-600" />
                        <span>Add Guide</span>
                    </h2>
                </div>
                <div className="w-full mt-4">
                        <AddGuide
                            title={title}
                            text={text}
                            onTitleChange={e => setTitle(e.target.value)}
                            onTextChange={e => setText(e.target.value)}
                            onSubmit={handleAddGuide}
                            loading={loading}
                        />
                    </div>
                </main>
            </div>
        </div>
    )
}