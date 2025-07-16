import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDragon, faCrown, faUsers } from '@fortawesome/free-solid-svg-icons';

interface Member {
  id: number;
  name: string;
  code: string;
  role: 'Member' | 'Lieutenant' | 'Leader';
}

interface CountMemberProps {
  members: Member[];
}

export default function CountMember({ members }: CountMemberProps) {
  // Calculate role statistics
  const getRoleStats = () => {
    const leaderCount = members.filter(member => member.role === 'Leader').length;
    const lieutenantCount = members.filter(member => member.role === 'Lieutenant').length;
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
      {/* Leader Stats */}
      <div className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
        <FontAwesomeIcon icon={faCrown} className="mr-2" />
        Leader: {roleStats.leader.current}/{roleStats.leader.max}
      </div>
      
      {/* Lieutenant Stats */}
      <div className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-red-100 text-red-800">
        <FontAwesomeIcon icon={faDragon} className="mr-2" />
        Lieutenant: {roleStats.lieutenant.current}/{roleStats.lieutenant.max}
      </div>
      
      {/* Total Members Stats */}
      <div className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
        <FontAwesomeIcon icon={faUsers} className="mr-2" />
        Total: {roleStats.total.current}/{roleStats.total.max}
      </div>
    </div>
  );
} 