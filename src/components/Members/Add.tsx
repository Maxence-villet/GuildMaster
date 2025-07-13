// src/components/Members/Add.tsx
import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

interface Member {
  id: number;
  name: string;
  code: string;
  role: string;
  created_at: string;
}

export default function AddMember() {
  const [memberName, setMemberName] = useState('');
  const API_URL = 'http://localhost:3001/api/member/add';

  const handleAddMember = async () => {
    if (!memberName.trim()) {
      toast.error('Member name cannot be empty.');
      return;
    }

    try {
      const response = await axios.post<Member>(API_URL, { name: memberName });
      toast.success(`Member ${memberName} added successfully!`);
      setMemberName('');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(`Error: ${error.response.data.message || 'Something went wrong.'}`);
      } else {
        toast.error('An unexpected error occurred.');
      }
      console.error('Error adding member:', error);
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow flex flex-col gap-2">
      <Toaster /> {/* Toaster component to display toasts */}
      <div className="flex flex-col gap-2 mb-2">
        <input
          type="text"
          placeholder="Name..."
          className="flex-1 p-2 border rounded bg-white text-black"
          value={memberName}
          onChange={(e) => setMemberName(e.target.value)}
        />
        <button
          className="ml-auto w-[150] px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleAddMember}
        >
          Add Member
        </button>
      </div>
    </div>
  );
}