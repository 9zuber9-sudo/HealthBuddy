import React from 'react';
import { Navigation, Phone, Clock, ExternalLink } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import type { HealthcareFacility } from '../../types';

interface DirectionsModalProps {
  facility: HealthcareFacility | null;
  onClose: () => void;
}

export const DirectionsModal: React.FC<DirectionsModalProps> = ({ facility, onClose }) => {
  if (!facility) return null;

  const estimatedMinutes = Math.max(3, Math.round(facility.distanceKm * 4));

  return (
    <Modal
      isOpen={Boolean(facility)}
      onClose={onClose}
      title={`Directions to ${facility.name}`}
      subtitle={`Distance: ${facility.distanceKm} km • Est. Drive: ${estimatedMinutes} mins`}
      maxWidth="lg"
    >
      <div className="space-y-4">
        <div className="relative h-40 rounded-2xl bg-slate-900 overflow-hidden border border-slate-700 flex items-center justify-center text-white">
          <div className="absolute inset-0 bg-gradient-to-tr from-teal-900/80 to-slate-900/90" />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />
          <div className="relative z-10 text-center px-4">
            <div className="inline-flex p-3 rounded-2xl bg-teal-500/20 border border-teal-400/30 text-teal-300 mb-2">
              <Navigation className="w-8 h-8 animate-bounce" />
            </div>
            <h4 className="text-base font-bold">{facility.name}</h4>
            <p className="text-xs text-teal-200 mt-0.5">{facility.address}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-600" />
            <div>
              <span className="text-slate-400 block">Status:</span>
              <span className={facility.isOpenNow ? 'font-bold text-emerald-700' : 'font-bold text-rose-600'}>
                {facility.isOpenNow ? 'Open Now' : 'Closed'} ({facility.hours})
              </span>
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
            <Phone className="w-4 h-4 text-teal-600" />
            <div>
              <span className="text-slate-400 block">Phone:</span>
              <span className="font-bold text-slate-900">{facility.phone}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Turn-By-Turn Route Summary</h5>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                1
              </span>
              <div>
                <p className="font-semibold text-slate-800">Head North on Main Medical Blvd</p>
                <p className="text-slate-400 text-[11px]">Continue for 0.4 km</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                2
              </span>
              <div>
                <p className="font-semibold text-slate-800">Turn Right onto Healthcare Way</p>
                <p className="text-slate-400 text-[11px]">Drive for {facility.distanceKm} km toward destination</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                3
              </span>
              <div>
                <p className="font-bold text-emerald-950">Arrive at {facility.name}</p>
                <p className="text-emerald-700 text-[11px]">Destination will be on the right side</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>

          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(facility.name + ' ' + facility.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-sm transition-all"
          >
            <ExternalLink className="w-4 h-4" /> Open External GPS
          </a>
        </div>
      </div>
    </Modal>
  );
};
