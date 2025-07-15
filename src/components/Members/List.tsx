import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faTrash, faDragon, faCrown, faPersonRifle } from '@fortawesome/free-solid-svg-icons';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Member {
  id: number;
  name: string;
  code: string;
  role: 'Member' | 'Lieutenant' | 'Leader';
}

export default function ListMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const API_BASE_URL = 'http://localhost:3001/api/member';

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/list`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Member[] = await response.json();
      setMembers(data);
    } catch (err) {
      setError("Failed to fetch members. Please try again later.");
      console.error("Error fetching members:", err);
      toast.error("Failed to fetch members.");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success("Code copied to clipboard!");
    }).catch(err => {
      console.error("Failed to copy text: ", err);
      toast.error("Failed to copy code.");
    });
  };

  const handleDeleteMember = async (memberId: number, memberName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${memberName}?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/delete/${memberId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      toast.success(`Member ${memberName} deleted successfully!`);
      fetchMembers();
    } catch (err: any) {
      console.error(`Error deleting member ${memberName}:`, err);
      toast.error(`Failed to delete member ${memberName}: ${err.message}`);
    }
  };

  const getRoleTag = (role: string) => {
    switch (role) {
      case 'Lieutenant':
        return (
          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <FontAwesomeIcon icon={faDragon} className="mr-1" />
            Lieutenant
          </span>
        );
      case 'Leader':
        return (
          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <FontAwesomeIcon icon={faCrown} className="mr-1" />
            Leader
          </span>
        );
      case 'Member':
        return (
          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-blue-200 text-blue-800">
            <FontAwesomeIcon icon={faPersonRifle} className="mr-1" />
            Member
          </span>
        );
      default:
        return null;
    }
  };

  // Determine if buttons should be shown based on user role and member role
  const canCopy = (memberRole: string) => {
    if (user?.role === 'Leader') {
      return memberRole === 'Lieutenant' || memberRole === 'Member';
    }
    if (user?.role === 'Lieutenant') {
      return memberRole === 'Member';
    }
    return false;
  };

  const canDelete = (memberRole: string) => {
    if (user?.role === 'Leader') {
      return memberRole === 'Lieutenant' || memberRole === 'Member';
    }
    if (user?.role === 'Lieutenant') {
      return memberRole === 'Member';
    }
    return false;
  };

  if (error) {
    return <div className="text-red-500 p-6 rounded-lg shadow">{error}</div>;
  }

  if (members.length === 0) {
    return <div className="text-black p-6 rounded-lg shadow">No members found.</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow flex flex-col gap-2">
      <Toaster />
      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-center justify-between bg-gray-100 p-2 mb-2 rounded shadow"
        >
          <div className="flex items-center">
            <span className="text-black">{member.name}</span>
            {getRoleTag(member.role)}
          </div>
          <div className="flex space-x-2">
            {canCopy(member.role) && (
              <button
                onClick={() => handleCopyCode(member.code)}
                className="text-blue-600 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faCopy} />
              </button>
            )}
            {canDelete(member.role) && (
              <button
                onClick={() => handleDeleteMember(member.id, member.name)}
                className="text-red-500 hover:text-red-700"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}