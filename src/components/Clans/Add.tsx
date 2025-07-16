import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faShieldHalved } from '@fortawesome/free-solid-svg-icons';

interface Clan {
    id: number;
    name: string;
    created_at: string;
}

interface Member {
    id: number;
    name: string;
    code: string;
    role: string;
    clan_id: number;
}

export default function AddClan() {
    const [clanName, setClanName] = useState('');
    const [memberName, setMemberName] = useState('');
    const [memberCode, setMemberCode] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const checkExistingClan = async (name: string): Promise<boolean> => {
        try {
            const response = await axios.get(`http://localhost:3001/api/clan/check?name=${encodeURIComponent(name)}`);
            return response.data.exists;
        } catch (error) {
            console.error('Error checking clan existence:', error);
            return false;
        }
    };

    const checkExistingMember = async (code: string): Promise<boolean> => {
        try {
            const response = await axios.get(`http://localhost:3001/api/member/check?code=${encodeURIComponent(code)}`);
            return response.data.exists;
        } catch (error) {
            console.error('Error checking member existence:', error);
            return false;
        }
    };

    const handleCreateClan = async () => {
        if (!clanName.trim()) {
            toast.error('Clan name is required.');
            return;
        }

        if (!memberName.trim()) {
            toast.error('Member name is required.');
            return;
        }

        if (!memberCode.trim()) {
            toast.error('Member code is required.');
            return;
        }

        setLoading(true);
        try {
            // Check if clan already exists
            const clanExists = await checkExistingClan(clanName.trim());
            if (clanExists) {
                toast.error('A clan with this name already exists.');
                setLoading(false);
                return;
            }

            // Check if member code already exists
            const memberExists = await checkExistingMember(memberCode.trim());
            if (memberExists) {
                toast.error('A member with this code already exists.');
                setLoading(false);
                return;
            }

            // First, create the clan
            const clanResponse = await axios.post<{ message: string; clan: Clan }>('http://localhost:3001/api/clan/add', { 
                name: clanName.trim() 
            });
            
            const clan = clanResponse.data.clan;
            toast.success(`Clan "${clan.name}" created successfully!`);

            // Then, create the first member as Leader
            const memberResponse = await axios.post<{ message: string; member: Member }>('http://localhost:3001/api/member/add', {
                name: memberName.trim(),
                role: 'Leader',
                clan_id: clan.id,
                code: memberCode.trim()
            });

            const member = memberResponse.data.member;
            toast.success(`Leader "${member.name}" added to clan "${clan.name}"!`);

            // Reset form
            setClanName('');
            setMemberName('');
            setMemberCode('');

            // Navigate to login page
            navigate('/login');
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to create clan. Please try again.');
            }
            console.error('Error creating clan:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-xl sm:text-2xl font-bold text-blue-600 mb-6 text-center flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faShieldHalved} />
                <p>Create Clan</p>
            </h2>
            <div className="space-y-6">
                <div>
                    <p className="block text-sm font-medium text-gray-700">Clan Name</p>
                    <input
                        type="text"
                        name="clanName"
                        id="clanName"
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-150 ease-in-out"
                        placeholder="Enter clan name..."
                        required
                        value={clanName}
                        onChange={(e) => setClanName(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div>
                    <p className="block text-sm font-medium text-gray-700">Leader Name</p>
                    <input
                        type="text"
                        name="memberName"
                        id="memberName"
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-150 ease-in-out"
                        placeholder="Enter leader name..."
                        required
                        value={memberName}
                        onChange={(e) => setMemberName(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div>
                    <p className="block text-sm font-medium text-gray-700">Leader Code</p>
                    <input
                        type="password"
                        name="memberCode"
                        id="memberCode"
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-150 ease-in-out"
                        placeholder="Enter leader code..."
                        required
                        value={memberCode}
                        onChange={(e) => setMemberCode(e.target.value)}
                        disabled={loading}
                    />
                </div>
            </div>
            <button
                className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out mt-5 disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleCreateClan}
                disabled={loading}
            >
                {loading ? 'Creating Clan...' : 'Create Clan'}
            </button>
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
}