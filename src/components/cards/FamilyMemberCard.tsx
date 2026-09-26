import React from 'react';
import { Phone, ShieldAlert, Heart, ChevronRight } from 'lucide-react';
import type { FamilyMember } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface FamilyMemberCardProps {
  member: FamilyMember;
  onSelect: (member: FamilyMember) => void;
  onDelete?: (id: string) => void;
}

export const FamilyMemberCard: React.FC<FamilyMemberCardProps> = ({
  member,
  onSelect,
}) => {
  return (
    <Card hoverable className="transition-all relative overflow-hidden group">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          {member.avatarUrl ? (
            <img
              src={member.avatarUrl}
              alt={member.name}
              className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-xs"
            />
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {member.name.charAt(0)}
            </div>
          )}
          <div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
              {member.name}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="teal" size="sm">
                {member.relationship}
              </Badge>
              <span className="text-xs text-slate-500">Age {member.age}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onSelect(member)}
          className="p-2 rounded-xl bg-slate-100 group-hover:bg-teal-600 group-hover:text-white text-slate-600 transition-all shadow-2xs"
          aria-label="View member detail"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
        <div className="flex items-center gap-2 text-slate-700">
          <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span className="font-mono text-[11px] truncate">{member.emergencyContact}</span>
        </div>

        {member.knownAllergies.length > 0 && (
          <div className="flex items-start gap-2">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex flex-wrap gap-1">
              {member.knownAllergies.map((alg) => (
                <span key={alg} className="px-1.5 py-0.5 bg-rose-50 text-rose-700 rounded text-[10px] font-medium">
                  {alg}
                </span>
              ))}
            </div>
          </div>
        )}

        {member.existingConditions.length > 0 && (
          <div className="flex items-start gap-2">
            <Heart className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
            <span className="text-slate-600 line-clamp-1">{member.existingConditions.join(', ')}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <button
          onClick={() => onSelect(member)}
          className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
        >
          View Health Profile & Records &rarr;
        </button>
      </div>
    </Card>
  );
};
