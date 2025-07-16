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

export default function AddGuidePage() {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();
    const API_URL = 'http://localhost:3001/api/guide/add';

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
            await axios.post(API_URL, { title, author_id: user.id, text });
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
        <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-row h-screen">
                <Sidebar />
                <main className="flex-1 p-8">
                    <div className="w-[90%] mx-auto">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <FontAwesomeIcon icon={faPlus} className="text-blue-600" />
                            <span>Add Guide</span>
                        </h2>
                    </div>
                    <div className="w-[90%] mx-auto">
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