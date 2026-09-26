import React, { useState } from 'react';
import { Building2, Navigation, Phone, Clock, MapPin, Star, Stethoscope, ChevronDown, ChevronUp, UserRound } from 'lucide-react';
import type { HealthcareFacility } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface HealthcareFacilityCardProps {
  facility: HealthcareFacility;
  onCall?: (phone: string) => void;
  onDirections?: (facility: HealthcareFacility) => void;
}

export const HealthcareFacilityCard: React.FC<HealthcareFacilityCardProps> = ({
  facility,
  onCall,
  onDirections,
}) => {
  const [showDoctors, setShowDoctors] = useState(false);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'hospital': return { label: '🏥 Hospital',       variant: 'danger'  as const };
      case 'pharmacy': return { label: '💊 Pharmacy',       variant: 'success' as const };
      case 'lab':      return { label: '🧪 Clinical Lab',   variant: 'info'    as const };
      case 'clinic':   return { label: '🩺 Clinic',         variant: 'teal'    as const };
      default:         return { label: 'Healthcare',        variant: 'neutral' as const };
    }
  };

  const badgeInfo = getTypeBadge(facility.type);
  const hasDoctors = facility.doctors && facility.doctors.length > 0;

  return (
    <Card hoverable className="flex flex-col justify-between h-full transition-all group border-slate-200 dark:border-slate-700">
      <div>
        {/* Top row — type badge + emergency + distance */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge variant={badgeInfo.variant} size="sm">
            {badgeInfo.label}
          </Badge>
          <div className="flex items-center gap-1.5">
            {facility.isEmergencyFacility && (
              <Badge variant="emergency" size="sm">
                🚨 Emergency
              </Badge>
            )}
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg flex items-center gap-1">
              <MapPin className="w-3 h-3 text-teal-600" /> {facility.distanceKm} km
            </span>
          </div>
        </div>

        {/* Facility name */}
        <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors mt-1 leading-snug">
          {facility.name}
        </h4>

        {/* Address + hours + rating */}
        <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 mt-3">
          <p className="flex items-start gap-2 leading-relaxed">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>{facility.address}</span>
          </p>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className={facility.isOpenNow ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-rose-600 dark:text-rose-400 font-bold'}>
                {facility.isOpenNow ? '● Open Now' : '○ Closed'}
              </span>
              <span className="text-slate-400 hidden sm:inline">({facility.hours})</span>
            </span>

            {facility.rating && (
              <span className="flex items-center gap-1 font-bold text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" /> {facility.rating}
              </span>
            )}
          </div>
        </div>

        {/* Doctors section — collapsible */}
        {hasDoctors && (
          <div className="mt-3 border-t border-slate-100 dark:border-slate-700 pt-3">
            <button
              onClick={() => setShowDoctors((p) => !p)}
              className="flex items-center justify-between w-full text-xs font-bold text-teal-700 dark:text-teal-400 hover:text-teal-600 transition-colors cursor-pointer group/doc"
            >
              <span className="flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5" />
                Doctors Available ({facility.doctors!.length})
              </span>
              {showDoctors
                ? <ChevronUp className="w-4 h-4 opacity-60" />
                : <ChevronDown className="w-4 h-4 opacity-60" />
              }
            </button>

            {showDoctors && (
              <ul className="mt-2 space-y-2">
                {facility.doctors!.map((doc, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/70 rounded-xl px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <UserRound className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">{doc.name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{doc.speciality}</p>
                      </div>
                    </div>
                    <a
                      href={`tel:${doc.phone}`}
                      className="flex items-center gap-1 text-[11px] font-bold text-teal-700 dark:text-teal-400 hover:text-teal-500 transition-colors"
                      title={`Call ${doc.name}`}
                    >
                      <Phone className="w-3 h-3" />
                      <span className="hidden sm:inline">{doc.phone}</span>
                      <span className="sm:hidden">Call</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-4 mt-4 border-t border-slate-100 dark:border-slate-700">
        <a
          href={`tel:${facility.phone}`}
          onClick={(e) => {
            if (onCall) {
              e.preventDefault();
              onCall(facility.phone);
            }
          }}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 dark:hover:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-xs font-bold transition-colors border border-teal-100 dark:border-teal-800"
        >
          <Phone className="w-3.5 h-3.5" /> Call Facility
        </a>

        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={() => onDirections && onDirections(facility)}
          leftIcon={<Navigation className="w-3.5 h-3.5 text-teal-600" />}
        >
          Directions
        </Button>
      </div>
    </Card>
  );
};
