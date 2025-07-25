import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddMember from "../../../components/Members/Add";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import { faList, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { getAvailableRoles } from '../../../utils/memberRoles';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Member {
  id: number;
  name: string;
  code: string;
  role: 'Member' | 'Lieutenant' | 'Leader';
  clan_id: number;
  created_at: string;
}

export default function AddMemberPage() {
    const [memberName, setMemberName] = useState('');
    const [memberRole, setMemberRole] = useState('Member');
    const [members, setMembers] = useState<Member[]>([]);
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
    const fetchMembers = async () => {
        if (!user?.clan_id) {
            toast.error('User clan not found.');
            return;
        }

        try {
            const response = await axios.get(`https://guildmaster-backend.onrender.com/api/member/list?clan_id=${user.clan_id}`);
            setMembers(response.data);
        } catch (error) {
            console.error('Error fetching members:', error);
            toast.error('Failed to fetch members list.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.clan_id) {
            fetchMembers();
        }
    }, [user?.clan_id]);

    // Update memberRole if current selection is no longer available
    useEffect(() => {
        const availableRoles = getAvailableRoles(members);
        if (!availableRoles.includes(memberRole as any) && availableRoles.length > 0) {
            setMemberRole(availableRoles[0]);
        }
    }, [members, memberRole]);

    const handleAddMember = async () => {
        if (!user?.clan_id) {
            toast.error('User clan not found.');
            return;
        }

        if (!memberName.trim()) {
            toast.error('Member name cannot be empty.');
            return;
        }
        if (!memberRole.trim()) {
            toast.error('Member role cannot be empty.');
            return;
        }

        setSubmitting(true);
        try {
            await axios.post<Member>(`https://guildmaster-backend.onrender.com/api/member/add`, { 
                name: memberName, 
                role: memberRole, 
                clan_id: user.clan_id
            });
            toast.success(`Member ${memberName} added successfully!`);
            setMemberName('');
            setMemberRole('Member');
            // Refresh the members list after adding
            fetchMembers();
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

    if(user.role == "Lieutenant") {
        availableRoles.splice(availableRoles.indexOf("Lieutenant"), 1);
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
                        <span>Add Member</span>
                    </h2>
                </div>
                <div className="w-full mt-4">
                        <Toaster />
                        <AddMember
                            memberName={memberName}
                            memberRole={memberRole}
                            availableRoles={availableRoles}
                            members={members}
                            loading={loading}
                            submitting={submitting}
                            onNameChange={(e) => setMemberName(e.target.value)}
                            onRoleChange={(e) => setMemberRole(e.target.value)}
                            onSubmit={handleAddMember}
                        />
                    </div>
                </main>
            </div>
        </div>
    )
}