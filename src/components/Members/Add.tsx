// src/components/members//Add.tsx
import React from 'react';
import CountMember from './CountMember';

interface member {
  id: number;
  name: string;
  code: string;
  role: 'member' | 'lieutenant' | 'leader';
  created_at: string;
}

interface AddmemberProps {
  memberName: string;
  memberRole: string;
  availableRoles: string[];
  members: member[];
  loading: boolean;
  submitting?: boolean;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRoleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSubmit: () => void;
}

export default function Addmember({ 
  memberName, 
  memberRole, 
  availableRoles, 
  members, 
  loading, 
  submitting = false,
  onNameChange, 
  onRoleChange, 
  onSubmit 
}: AddmemberProps) {
  return (
    <div className="w-full bg-white p-6 rounded-lg shadow flex flex-col gap-4">
      
      {/* Form Section */}
      <div className="flex flex-col gap-2 mb-2">
        <input
          type="text"
          placeholder="Name..."
          className="flex-1 p-2 border rounded bg-white text-black"
          value={memberName}
          onChange={onNameChange}
          disabled={loading}
        />
        <div className='flex items-center gap-2'>
          <select
            className="flex-1 p-2 border rounded bg-white text-black py-2"
            value={memberRole}
            onChange={onRoleChange}
            disabled={availableRoles.length === 0 || loading}
          >
            {availableRoles.length === 0 ? (
              <option value="">No slots available</option>
            ) : (
              availableRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))
            )}
          </select>
          <button
            className="ml-auto w-[150] px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={onSubmit}
                      disabled={availableRoles.length === 0 || submitting}
        >
          {submitting ? 'Adding...' : 'Add member'}
          </button>
        </div>
      </div>

      {/* Statistics Section */}
      {!loading && <CountMember members={members} />}
    </div>
  );
}