// src/utils/memberRoles.ts

export interface Member {
  id: number;
  name: string;
  code: string;
  role: 'Member' | 'Lieutenant' | 'Leader';
  created_at?: string;
}

export function getAvailableRoles(members: Member[]): string[] {
  const leaderCount = members.filter(member => member.role === 'Leader').length;
  const lieutenantCount = members.filter(member => member.role === 'Lieutenant').length;
  const totalCount = members.length;

  const availableRoles = [];

  if (leaderCount < 1) {
    availableRoles.push('Leader');
  }
  if (lieutenantCount < 4) {
    availableRoles.push('Lieutenant');
  }
  if (totalCount < 50) {
    availableRoles.push('Member');
  }

  return availableRoles;
} 