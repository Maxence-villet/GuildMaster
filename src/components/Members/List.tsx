import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faTrash } from '@fortawesome/free-solid-svg-icons';
import toast, { Toaster } from 'react-hot-toast'; // Import toast and Toaster

interface Member {
  id: number;
  name: string;
  code: string;
}

export default function ListMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = 'http://localhost:3001/api/member'; // Base URL for member API

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
      // Refresh the list after successful deletion
      fetchMembers();
    } catch (err: any) {
      console.error(`Error deleting member ${memberName}:`, err);
      toast.error(`Failed to delete member ${memberName}: ${err.message}`);
    }
  };

  if (error) {
    return <div className="text-red-500 p-6 rounded-lg shadow">{error}</div>;
  }

  if (members.length === 0) {
    return <div className="text-black p-6 rounded-lg shadow">No members found.</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow flex flex-col gap-2">
      <Toaster /> {/* Toaster component to display notifications */}
      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-center justify-between bg-gray-100 p-2 mb-2 rounded shadow"
        >
          <span className="text-black">{member.name}</span>
          <div className="flex space-x-2">
            <button
              onClick={() => handleCopyCode(member.code)}
              className="text-blue-600 hover:text-gray-700"
            >
              <FontAwesomeIcon icon={faCopy} />
            </button>
            <button
              onClick={() => handleDeleteMember(member.id, member.name)}
              className="text-red-500 hover:text-red-700"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}