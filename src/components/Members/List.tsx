import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faTrash, faDragon, faCrown, faPersonRifle } from '@fortawesome/free-solid-svg-icons';
import CountMember from './CountMember';

interface member {
  id: number;
  name: string;
  code: string;
  role: 'member' | 'lieutenant' | 'leader';
}

interface User {
  id: number;
  name: string;
  role: string;
}

interface ListmembersProps {
  members: member[];
  error: string | null;
  loading: boolean;
  user: User | null;
  onCopyCode: (code: string) => void;
  onDeletemember: (id: number, name: string) => void;
}

export default function Listmembers({ 
  members, 
  error, 
  loading, 
  user, 
  onCopyCode, 
  onDeletemember 
}: ListmembersProps) {
  const getRoleTag = (role: string) => {
    switch (role) {
      case 'lieutenant':
        return (
          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <FontAwesomeIcon icon={faDragon} className="mr-1" />
            lieutenant
          </span>
        );
      case 'leader':
        return (
          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <FontAwesomeIcon icon={faCrown} className="mr-1" />
            leader
          </span>
        );
      case 'member':
        return (
          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-200 text-green-800">
            <FontAwesomeIcon icon={faPersonRifle} className="mr-1" />
            member
          </span>
        );
      default:
        return null;
    }
  };

  // Determine if buttons should be shown based on user role and member role
  const canCopy = (memberRole: string) => {
    if (user?.role === 'leader') {
      return memberRole === 'lieutenant' || memberRole === 'member';
    }
    if (user?.role === 'lieutenant') {
      return memberRole === 'member';
    }
    return false;
  };

  const canDelete = (memberRole: string) => {
    if (user?.role === 'leader') {
      return memberRole === 'lieutenant' || memberRole === 'member';
    }
    if (user?.role === 'lieutenant') {
      return memberRole === 'member';
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
        <div className="max-h-96 overflow-y-auto flex flex-col gap-1">
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
                    onClick={() => onCopyCode(member.code)}
                    className="text-blue-600 hover:text-gray-700"
                  >
                    <FontAwesomeIcon icon={faCopy} />
                  </button>
                )}
                {canDelete(member.role) && (
                  <button
                    onClick={() => onDeletemember(member.id, member.name)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}