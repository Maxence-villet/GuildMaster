import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved } from '@fortawesome/free-solid-svg-icons';

export default function AddClan() {
    const [clanName, setClanName] = useState('');
    const [leaderName, setLeaderName] = useState('');
    const [leaderCode, setLeaderCode] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCreateClan = async () => {
        if (!clanName.trim()) {
            toast.error('Clan name is required.');
            return;
        }
        if (!leaderName.trim()) {
            toast.error('Leader name is required.');
            return;
        }
        if (!leaderCode.trim()) {
            toast.error('Leader code is required.');
            return;
        }

        setLoading(true);

        try {
   
            const response = await axios.post(
            'https://guildmaster-backend-fastapi.onrender.com/clans/create',
            null, 
            {
                params: {
                    clan_name: clanName.trim(),
                    leader_name: leaderName.trim(),
                    leader_code: leaderCode.trim(),
                },
            }
        );


            const clan = response.data;
            toast.success(`Clan "${clan.name}" created successfully! Welcome, Leader ${leaderName}!`);

            // Reset form
            setClanName('');
            setLeaderName('');
            setLeaderCode('');

            // Redirect to login page
            navigate('/login');
        } catch (error: any) {
            console.error('Error creating clan:', error);

            if (error.response?.data?.detail) {
                const msg = error.response.data.detail;

                if (msg.includes('clan')) {
                    toast.error('A clan with this name already exists.');
                } else if (msg.includes('membre') || msg.includes('member')) {
                    toast.error('This leader name is already taken.');
                } else if (msg.includes('code')) {
                    toast.error('This code is already in use.');
                } else {
                    toast.error(msg);
                }
            } else {
                toast.error('Failed to create clan. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-xl sm:text-2xl font-bold text-blue-600 mb-6 text-center flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faShieldHalved} />
                <span>Create Clan</span>
            </h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Clan Name</label>
                    <input
                        type="text"
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-150 ease-in-out"
                        placeholder="Enter clan name..."
                        value={clanName}
                        onChange={(e) => setClanName(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Leader Name</label>
                    <input
                        type="text"
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-150 ease-in-out"
                        placeholder="Enter your leader name..."
                        value={leaderName}
                        onChange={(e) => setLeaderName(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Leader Code</label>
                    <input
                        type="password"
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-150 ease-in-out"
                        placeholder="Choose a secret code..."
                        value={leaderCode}
                        onChange={(e) => setLeaderCode(e.target.value)}
                        disabled={loading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        You will use this code to log in later.
                    </p>
                </div>
            </div>

            <button
                className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out mt-5 disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleCreateClan}
                disabled={loading}
            >
                {loading ? 'Creating Clan...' : 'Create Clan'}
            </button>

            <ToastContainer
                position="bottom-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
}