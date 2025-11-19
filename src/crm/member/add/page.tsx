import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Addmember from "../../../components/Members/Add";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { getAvailableRoles } from '../../../utils/memberRoles';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface member {
  id: number;
  name: string;
  code: string;
  role: 'member' | 'lieutenant' | 'leader';
  clan_id: number;
  created_at: string;
}

export default function AddmemberPage() {
    const [memberName, setmemberName] = useState('');
    const [memberRole, setmemberRole] = useState('member');
    const [members, setmembers] = useState<member[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
    }, [user, navigate]);

    // Fetch members list for the user's clan
    const fetchmembers = async () => {
        if (!user?.clan_id) {
            toast.error('User clan not found.');
            return;
        }

        try {
            const response = await axios.get(`http://127.0.0.1:8000/members/list?clan_id=${user.clan_id}`);
            setmembers(response.data);
        } catch (error) {
            console.error('Error fetching members:', error);
            toast.error('Failed to fetch members list.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.clan_id) {
            fetchmembers();
        }
    }, [user?.clan_id]);

    // Update memberRole if current selection is no longer available
    useEffect(() => {
        const availableRoles = getAvailableRoles(members);
        if (!availableRoles.includes(memberRole as any) && availableRoles.length > 0) {
            setmemberRole(availableRoles[0]);
        }
    }, [members, memberRole]);

    const handleAddmember = async () => {
        if (!user?.clan_id) {
            toast.error('User clan not found.');
            return;
        }

        if (!memberName.trim()) {
            toast.error('member name cannot be empty.');
            return;
        }
        if (!memberRole.trim()) {
            toast.error('member role cannot be empty.');
            return;
        }

        setSubmitting(true);
        try {
            await axios.post<member>(`http://127.0.0.1:8000/members/add`, { 
                name: memberName, 
                role: memberRole, 
                clan_id: user.clan_id
            }, 
  {
    headers: {
      "X-CSRF-Token": window._csrfToken! 
    }
  });
            toast.success(`member ${memberName} added successfully!`);
            setmemberName('');
            setmemberRole('member');
            // Refresh the members list after adding
            fetchmembers();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(`Error: ${error.response.data.message || 'Something went wrong.'}`);
            } else {
                toast.error('An unexpected error occurred.');
            }
            console.error('Error adding member:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const availableRoles = getAvailableRoles(members);

    if (!user) {
        return null;
    }

    if(user.role === "lieutenant") {
        availableRoles.splice(availableRoles.indexOf("lieutenant"), 1);
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
                        <FontAwesomeIcon icon={faPlus} className="text-blue-600" />
                        <span>Add member</span>
                    </h2>
                </div>
                <div className="w-full mt-4">
                        <Toaster />
                        <Addmember
                            memberName={memberName}
                            memberRole={memberRole}
                            availableRoles={availableRoles}
                            members={members}
                            loading={loading}
                            submitting={submitting}
                            onNameChange={(e) => setmemberName(e.target.value)}
                            onRoleChange={(e) => setmemberRole(e.target.value)}
                            onSubmit={handleAddmember}
                        />
                    </div>
                </main>
            </div>
        </div>
    )
}