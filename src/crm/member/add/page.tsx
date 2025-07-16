import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddMember from "../../../components/Members/Add";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

interface Member {
  id: number;
  name: string;
  code: string;
  role: 'Member' | 'Lieutenant' | 'Leader';
  created_at: string;
}

export default function AddMemberPage() {
    const [memberName, setMemberName] = useState('');
    const [memberRole, setMemberRole] = useState('Member');
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const API_URL = 'http://localhost:3001/api/member';

    // Fetch members list
    const fetchMembers = async () => {
        try {
            const response = await axios.get(`${API_URL}/list`);
            setMembers(response.data);
        } catch (error) {
            console.error('Error fetching members:', error);
            toast.error('Failed to fetch members list.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    // Calculate available roles based on current members
    const getAvailableRoles = () => {
        const leaderCount = members.filter(member => member.role === 'Leader').length;
        const lieutenantCount = members.filter(member => member.role === 'Lieutenant').length;
        const totalCount = members.length;

        const availableRoles = [];

        // Check if Leader slot is available
        if (leaderCount < 1) {
            availableRoles.push('Leader');
        }

        // Check if Lieutenant slot is available
        if (lieutenantCount < 4) {
            availableRoles.push('Lieutenant');
        }

        // Check if total member limit allows more members
        if (totalCount < 50) {
            availableRoles.push('Member');
        }

        return availableRoles;
    };

    // Update memberRole if current selection is no longer available
    useEffect(() => {
        const availableRoles = getAvailableRoles();
        if (!availableRoles.includes(memberRole as any) && availableRoles.length > 0) {
            setMemberRole(availableRoles[0]);
        }
    }, [members, memberRole]);

    const handleAddMember = async () => {
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
            await axios.post<Member>(`${API_URL}/add`, { name: memberName, role: memberRole });
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

    const availableRoles = getAvailableRoles();

    return (
        <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-row h-screen">
                <Sidebar />
                <main className="flex-1 p-8">
                    <div className="w-[90%] mx-auto">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <FontAwesomeIcon icon={faPlus} className="text-blue-600" />
                            <span>Add Member</span>
                        </h2>
                    </div>
                    <div className="w-[90%] mx-auto">
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