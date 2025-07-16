import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faTrash, faDragon, faCrown, faPersonRifle } from '@fortawesome/free-solid-svg-icons';
import CountMember from './CountMember';

interface Member {
  id: number;
  name: string;
  code: string;
  role: 'Member' | 'Lieutenant' | 'Leader';
}

interface User {
  id: number;
  name: string;
  role: string;
}

interface ListMembersProps {
  members: Member[];
  error: string | null;
  loading: boolean;
  user: User | null;
  onCopyCode: (code: string) => void;
  onDeleteMember: (id: number, name: string) => void;
}

export default function ListMembers({ 
  members, 
  error, 
  loading, 
  user, 
  onCopyCode, 
  onDeleteMember 
}: ListMembersProps) {
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
          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-200 text-green-800">
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

  if (loading) {
    return <div className="text-black p-6 rounded-lg shadow">Loading members...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-6 rounded-lg shadow">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow flex flex-col gap-4">
      
      {/* Statistics Section */}
      <CountMember members={members} />

      {members.length === 0 ? (
        <div className="text-black p-6 rounded-lg shadow">No members found.</div>
      ) : (
        members.map((member) => (
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
                  onClick={() => onCopyCode(member.code)}
                  className="text-blue-600 hover:text-gray-700"
                >
                  <FontAwesomeIcon icon={faCopy} />
                </button>
              )}
              {canDelete(member.role) && (
                <button
                  onClick={() => onDeleteMember(member.id, member.name)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}