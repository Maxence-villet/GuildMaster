import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDragon, faCrown, faUsers } from '@fortawesome/free-solid-svg-icons';

interface member {
  id: number;
  name: string;
  code: string;
  role: 'member' | 'lieutenant' | 'leader';
}

interface CountMemberProps {
  members: member[];
}

export default function CountMember({ members }: CountMemberProps) {
  // Calculate role statistics
  const getRoleStats = () => {
    const leaderCount = members.filter(member => member.role === 'leader').length;
    const lieutenantCount = members.filter(member => member.role === 'lieutenant').length;
    const totalCount = members.length;
    
    return {
      leader: { current: leaderCount, max: 1 },
      lieutenant: { current: lieutenantCount, max: 4 },
      total: { current: totalCount, max: 50 }
    };
  };

  const roleStats = getRoleStats();

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      {/* leader Stats */}
      <div className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
        <FontAwesomeIcon icon={faCrown} className="mr-2" />
        leader: {roleStats.leader.current}/{roleStats.leader.max}
      </div>
      
      {/* lieutenant Stats */}
      <div className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-red-100 text-red-800">
        <FontAwesomeIcon icon={faDragon} className="mr-2" />
        lieutenant: {roleStats.lieutenant.current}/{roleStats.lieutenant.max}
      </div>
      
      {/* Total members Stats */}
      <div className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
        <FontAwesomeIcon icon={faUsers} className="mr-2" />
        Total: {roleStats.total.current}/{roleStats.total.max}
      </div>
    </div>
  );
} 