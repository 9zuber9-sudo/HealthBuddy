import React, { useEffect, useState } from 'react';
import {
  MapPin,
  Search,
  Building2,
  Map as MapIcon,
} from 'lucide-react';
import type { PageId, HealthcareFacility, FacilityType } from '../types';
import { HealthcareFacilityCard } from '../components/cards/HealthcareFacilityCard';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { DirectionsModal } from '../components/modals/DirectionsModal';
import { getHealthcareFacilities } from '../services/healthcareService';
import { useToast } from '../context/ToastContext';

interface FindHealthcarePageProps {
  onNavigate: (page: PageId) => void;
}

export const FindHealthcarePage: React.FC<FindHealthcarePageProps> = () => {
  const { showToast } = useToast();
  const [facilities, setFacilities] = useState<HealthcareFacility[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState<FacilityType | 'all'>('all');
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacilityForDirections, setSelectedFacilityForDirections] = useState<HealthcareFacility | null>(null);
  const [hoveredFacilityId, setHoveredFacilityId] = useState<string | null>(null);

  useEffect(() => {
    loadFacilities();
  }, [activeCategory, openNowOnly, emergencyOnly, searchQuery]);

  const loadFacilities = async () => {
    setIsLoading(true);
    try {
      const data = await getHealthcareFacilities({
        type: activeCategory,
        openNow: openNowOnly,
        emergencyOnly,
        searchQuery: searchQuery || undefined,
      });
      setFacilities(data);
    } catch (err) {
      showToast({ type: 'error', title: 'Failed to fetch nearby healthcare facilities' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCall = (phone: string) => {
    showToast({
      type: 'info',
      title: 'Connecting call',
      message: `Dialing facility phone number: ${phone}`,
    });
  };

  const categories = [
    { id: 'all', label: 'All Facilities' },
    { id: 'hospital', label: '🏥 Hospitals' },
    { id: 'pharmacy', label: '💊 Pharmacies' },
    { id: 'lab', label: '🧪 Labs' },
    { id: 'clinic', label: '🩺 Clinics' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Find Healthcare Near You</h1>
          <p className="text-sm text-slate-500 mt-1">
            Discover emergency trauma units, 24/7 pharmacies, diagnostic centers, and urgent care clinics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="teal" size="lg">
            📍 SRM University, Sonipat, HR 131023
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-700">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeCategory === cat.id
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800/70 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full">
            <Input
              placeholder="Search by hospital name, address, or zip code..."
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={openNowOnly}
                onChange={(e) => setOpenNowOnly(e.target.checked)}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
              />
              <span>Open Now</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-rose-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={emergencyOnly}
                onChange={(e) => setEmergencyOnly(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
              />
              <span>🚨 Emergency Only</span>
            </label>
          </div>
        </div>
      </div>

      <div className="relative rounded-3xl bg-slate-900 border border-slate-800 p-6 overflow-hidden text-white shadow-xl min-h-[220px] flex flex-col justify-between">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#0d9488 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <MapIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Interactive Healthcare Map View</h3>
              <p className="text-xs text-slate-400">Showing {facilities.length} verified facilities near your location</p>
            </div>
          </div>

          <span className="text-[11px] font-mono text-teal-300 bg-teal-950/80 px-3 py-1 rounded-full border border-teal-800">
            Map Engine Ready
          </span>
        </div>

        <div className="relative z-10 my-8 flex items-center justify-around flex-wrap gap-4">
          {facilities.map((fac) => {
            const isHovered = hoveredFacilityId === fac.id;
            return (
              <div
                key={fac.id}
                onMouseEnter={() => setHoveredFacilityId(fac.id)}
                onMouseLeave={() => setHoveredFacilityId(null)}
                onClick={() => setSelectedFacilityForDirections(fac)}
                className={`flex items-center gap-2 p-2.5 rounded-2xl border transition-all cursor-pointer shadow-lg ${
                  isHovered
                    ? 'bg-teal-600 text-white border-teal-300 scale-110 z-20'
                    : fac.isEmergencyFacility
                    ? 'bg-rose-950/90 border-rose-600 text-rose-100 hover:bg-rose-900'
                    : 'bg-slate-800/90 border-slate-700 text-slate-200 hover:bg-slate-750'
                }`}
              >
                <MapPin className={`w-4 h-4 shrink-0 ${fac.isEmergencyFacility ? 'text-rose-400' : 'text-teal-400'}`} />
                <div className="text-left">
                  <p className="text-xs font-bold leading-tight line-clamp-1">{fac.name}</p>
                  <p className="text-[10px] opacity-80">{fac.distanceKm} km away</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative z-10 text-[11px] text-slate-400 border-t border-slate-800 pt-3 flex items-center justify-between">
          <span>Click any map node to launch turn-by-turn route navigation.</span>
          <span>Google Maps & Mapbox API connector interface ready</span>
        </div>
      </div>

      {isLoading ? (
        <LoadingState type="skeleton" />
      ) : facilities.length === 0 ? (
        <EmptyState
          icon={<Building2 className="w-8 h-8 text-teal-600" />}
          title="No facilities found"
          description="Try adjusting your category tabs or search query to view additional hospitals and pharmacies."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((fac) => (
            <HealthcareFacilityCard
              key={fac.id}
              facility={fac}
              onCall={handleCall}
              onDirections={(f) => setSelectedFacilityForDirections(f)}
            />
          ))}
        </div>
      )}

      <DirectionsModal
        facility={selectedFacilityForDirections}
        onClose={() => setSelectedFacilityForDirections(null)}
      />
    </div>
  );
};
