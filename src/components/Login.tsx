import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

interface Clan {
    id: number;
    name: string;
    created_at: string;
}

export default function Login() {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!name.trim() || !code.trim()) {
            toast.error('Name and code are required.');
            return;
        }

        setLoading(true);
        try {
            // First, authenticate the member
            const memberResponse = await axios.post('http://localhost:3001/api/member', { name, code });
            const userData = memberResponse.data;
            
            // Validate that clan_id is present in the response
            if (!userData.clan_id) {
                toast.error('Invalid user data: clan_id is missing');
                return;
            }
            
            // Then, fetch the clan name
            const clanResponse = await axios.get<Clan>(`http://localhost:3001/api/clan/${userData.clan_id}`);
            const clanName = clanResponse.data.name;
            
            // Combine user data with clan name
            const completeUserData = {
                ...userData,
                clan_name: clanName
            };
            
            login(completeUserData);
            toast.success(`Welcome, ${userData.name}!`);
            navigate('/guide/list');
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-xl sm:text-2xl font-bold text-blue-600 mb-6 text-center flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faRightToBracket} />
                <p>Login</p>
            </h2>
            <div className="space-y-6">
                <div>
                    <p className="block text-sm font-medium text-gray-700">Username</p>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-150 ease-in-out"
                        placeholder="Enter your username..."
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div>
                    <p className="block text-sm font-medium text-gray-700">Code</p>
                    <input
                        type="password"
                        name="code"
                        id="code"
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-150 ease-in-out"
                        placeholder="Enter your code..."
                        required
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        disabled={loading}
                    />
                </div>
            </div>
            <button
                className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out mt-5 disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleLogin}
                disabled={loading}
            >
                {loading ? 'Logging in...' : 'Login'}
            </button>
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
}