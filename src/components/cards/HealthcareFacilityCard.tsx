import React from 'react';
import { Building2, Navigation, Phone, Clock, MapPin, Star } from 'lucide-react';
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
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'hospital': return { label: '🏥 Hospital', variant: 'danger' as const };
      case 'pharmacy': return { label: '💊 Pharmacy', variant: 'success' as const };
      case 'lab': return { label: '🧪 Clinical Lab', variant: 'info' as const };
      case 'clinic': return { label: '🩺 Clinic', variant: 'teal' as const };
      default: return { label: 'Healthcare', variant: 'neutral' as const };
    }
  };

  const badgeInfo = getTypeBadge(facility.type);

  return (
    <Card hoverable className="flex flex-col justify-between h-full transition-all group border-slate-200">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge variant={badgeInfo.variant} size="sm">
            {badgeInfo.label}
          </Badge>
          <div className="flex items-center gap-1.5">
            {facility.isEmergencyFacility && (
              <Badge variant="emergency" size="sm">
                🚨 Emergency Facility
              </Badge>
            )}
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg flex items-center gap-1">
              <MapPin className="w-3 h-3 text-teal-600" /> {facility.distanceKm} km
            </span>
          </div>
        </div>

        <h4 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors mt-1 leading-snug">
          {facility.name}
        </h4>

        <div className="space-y-1.5 text-xs text-slate-600 mt-3">
          <p className="flex items-start gap-2 text-slate-600 leading-relaxed">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>{facility.address}</span>
          </p>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className={facility.isOpenNow ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>
                {facility.isOpenNow ? '● Open Now' : '○ Closed'}
              </span>
              <span className="text-slate-400">({facility.hours})</span>
            </span>

            {facility.rating && (
              <span className="flex items-center gap-1 font-bold text-amber-600">
                <Star className="w-3.5 h-3.5 fill-current" /> {facility.rating}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-4 mt-4 border-t border-slate-100">
        <a
          href={`tel:${facility.phone}`}
          onClick={(e) => {
            if (onCall) {
              e.preventDefault();
              onCall(facility.phone);
            }
          }}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold transition-colors"
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
