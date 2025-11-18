// src/components/Login.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

interface FirstLoginResponse {
  id: number;
  name: string;
  code: string;
  clan_id: number;
  requires_password: boolean;
}

interface FullmemberResponse {
  id: number;
  name: string;
  code: string;
  role: string;
  clan_id: number;
  created_at: string;
}

interface Clan {
  id: number;
  name: string;
}

type LoginStep = 'code' | 'set-password' | 'login-password';
type LoginMethod = 'code' | 'name-password';

export default function Login() {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('code');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [codePassword, setCodePassword] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<LoginStep>('code');
  const [currentmember, setCurrentmember] = useState<FirstLoginResponse | null>(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleCodeSubmit = async () => {
    if (!code.trim()) {
      toast.error('Please enter your member code.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post<FirstLoginResponse>('http://127.0.0.1:8000/members/login', {
        code: code.trim(),
      });

      const member = res.data;
      setCurrentmember(member);

      if (member.requires_password) {
        setStep('set-password');
      } else {
        await completeLogin(member);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Invalid code.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async () => {
    if (!codePassword || codePassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/members/set-password', {
        code: code.trim(),
        password: codePassword,
      });

      toast.success('Password created successfully!');
      setCodePassword(''); // Clear password field
      setStep('login-password');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to set password.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async () => {
    if (!currentmember?.name || !codePassword) {
      toast.error('Username and password required.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post<FullmemberResponse>('http://127.0.0.1:8000/members/login-password', {
        name: currentmember.name,
        password: codePassword,
      });

      const member = res.data;
      await completeLogin(member);
    } catch (err: any) {
      toast.error('Invalid password.');
    } finally {
      setLoading(false);
    }
  };

  const handleNamePasswordLogin = async () => {
    if (!name.trim() || !loginPassword) {
      toast.error('Name and password are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post<FullmemberResponse>('http://127.0.0.1:8000/members/login-password', {
        name: name.trim(),
        password: loginPassword,
      });

      const member = res.data;
      await completeLogin(member);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Invalid name or password.');
    } finally {
      setLoading(false);
    }
  };

  const completeLogin = async (member: FullmemberResponse | FirstLoginResponse) => {
    try {
      const clanRes = await axios.get<Clan>(`http://127.0.0.1:8000/clans/${member.clan_id}`);
      const fullUser = {
        id: member.id,
        name: member.name,
        code: member.code,
        role: 'role' in member ? member.role : 'member',
        clan_id: member.clan_id,
        created_at: 'created_at' in member ? member.created_at : new Date().toISOString(),
        clan_name: clanRes.data.name,
      };
      login(fullUser);
      toast.success(`Welcome, ${member.name}!`);
      navigate('/guide/list');
    } catch (err) {
      toast.error('Failed to load clan data.');
    }
  };

  const resetForm = (newMethod: LoginMethod) => {
    setLoginMethod(newMethod);
    setCode('');
    setName('');
    setCodePassword('');
    setLoginPassword('');
    setStep('code');
    setCurrentmember(null);
  };

  const renderLoginForm = () => {
    if (loginMethod === 'code') {
      switch (step) {
        case 'code':
          return (
            <div className="space-y-6">
              <div>
                <label htmlFor="code-input" className="block text-sm font-semibold text-gray-700 mb-2">Member Code</label>
                <input
                  id="code-input"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter the code from your leader"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-2">Your leader gave you this code when adding you to the clan.</p>
              </div>

              <button
                onClick={handleCodeSubmit}
                disabled={loading}
                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
              >
                {loading ? 'Checking...' : 'Continue'}
              </button>
            </div>
          );
        case 'set-password':
          return (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-blue-600">First Time Login</h3>
                <p className="text-gray-600 mt-2">Welcome {currentmember?.name}!</p>
                <p className="text-sm text-gray-500">Please create a password to secure your account.</p>
              </div>

              <div>
                <label htmlFor="new-password" className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                <input
                  id="new-password"
                  type="password"
                  value={codePassword}
                  onChange={(e) => setCodePassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Minimum 6 characters"
                  disabled={loading}
                />
              </div>

              <button
                onClick={handleSetPassword}
                disabled={loading}
                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
              >
                {loading ? 'Saving...' : 'Create Password'}
              </button>
            </div>
          );
        case 'login-password':
          return (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-blue-600">Login with Password</h3>
                <p className="text-gray-600 mt-2">Hello {currentmember?.name}</p>
              </div>

              <div>
                <label htmlFor="code-login-password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input
                  id="code-login-password"
                  type="password"
                  value={codePassword}
                  onChange={(e) => setCodePassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>

              <button
                onClick={handlePasswordLogin}
                disabled={loading}
                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          );
        default:
          return null;
      }
    } else { // loginMethod === 'name-password'
      return (
        <div className="space-y-6">
          <div>
            <label htmlFor="member-name" className="block text-sm font-semibold text-gray-700 mb-2">Member Name</label>
            <input
              id="member-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Enter your member name"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="member-password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              id="member-password"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          <button
            onClick={handleNamePasswordLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      );
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-xl">
      <h2 className="text-3xl font-bold text-blue-600 text-center mb-8 flex items-center justify-center gap-3">
        <FontAwesomeIcon icon={faRightToBracket} />
        Clan Login
      </h2>

      {/* Login Method Selection */}
      <div className="mb-6">
        <label htmlFor="login-method" className="block text-sm font-semibold text-gray-700 mb-2">Login Method</label>
        <select
          id="login-method"
          value={loginMethod}
          onChange={(e) => resetForm(e.target.value as LoginMethod)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          disabled={loading}
        >
          <option value="code">Login with Code</option>
          <option value="name-password">Login with Name and Password</option>
        </select>
      </div>

      {/* Render the appropriate form */}
      {renderLoginForm()}

      <ToastContainer position="bottom-right" theme="light" autoClose={4000} />
    </div>
  );
}