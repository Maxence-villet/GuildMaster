// src/utils/memberRoles.ts

export interface member {
  id: number;
  name: string;
  code: string;
  role: 'member' | 'lieutenant' | 'leader';
  created_at?: string;
}

export function getAvailableRoles(members: member[]): string[] {
  const leaderCount = members.filter(member => member.role === 'leader').length;
  const lieutenantCount = members.filter(member => member.role === 'lieutenant').length;
  const totalCount = members.length;

  const availableRoles = [];

  if (leaderCount < 1) {
    availableRoles.push('leader');
  }
  if (lieutenantCount < 4) {
    availableRoles.push('lieutenant');
  }
  if (totalCount < 50) {
    availableRoles.push('member');
  }

  return availableRoles;
} 