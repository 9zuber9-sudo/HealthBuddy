import React, { useState } from 'react';
import {
  Sparkles,
  ShieldAlert,
  Plus,
  X,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Info,
  RefreshCw,
} from 'lucide-react';
import type { PageId, AIAnalysisResult, SymptomInput } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Badge } from '../components/common/Badge';
import { LoadingState } from '../components/common/LoadingState';
import { EmergencyBanner } from '../components/common/EmergencyBanner';
import { analyzeSymptoms } from '../services/healthService';
import { useToast } from '../context/ToastContext';

interface AIHealthGuidePageProps {
  onNavigate: (page: PageId) => void;
}

export const AIHealthGuidePage: React.FC<AIHealthGuidePageProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [symptoms, setSymptoms] = useState<string[]>(['Dry Cough', 'Mild Headache']);
  const [symptomInput, setSymptomInput] = useState('');
  const [age, setAge] = useState<number>(34);
  const [duration, setDuration] = useState('2 days');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [existingConditions, setExistingConditions] = useState('Asthma (Mild)');
  const [currentMedicines, setCurrentMedicines] = useState('Vitamin D3 1000 IU');

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);

  const commonSymptomChips = [
    'Fever',
    'Shortness of breath',
    'Chest Pain',
    'Sore Throat',
    'Fatigue',
    'Nausea',
    'Stomach Pain',
    'Skin Rash',
    'Dizziness',
    'Joint Pain',
  ];

  const handleAddSymptom = (text: string) => {
    const trimmed = text.trim();
    if (trimmed && !symptoms.includes(trimmed)) {
      setSymptoms([...symptoms, trimmed]);
      setSymptomInput('');
    }
  };

  const handleRemoveSymptom = (text: string) => {
    setSymptoms(symptoms.filter((s) => s !== text));
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (symptoms.length === 0) {
      showToast({
        type: 'warning',
        title: 'No symptoms added',
        message: 'Please enter at least one symptom to analyze.',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const inputData: SymptomInput = {
        symptoms,
        age,
        duration,
        severity,
        existingConditions: existingConditions || undefined,
        currentMedicines: currentMedicines || undefined,
      };

      const res = await analyzeSymptoms(inputData);
      setResult(res);
      showToast({
        type: 'success',
        title: 'Analysis Complete',
        message: 'Your health guidance report is ready below.',
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Analysis failed',
        message: 'Failed to complete analysis. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" /> Conversational Assessment Tool
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">AI Health Guide</h1>
        <p className="text-sm text-slate-600 mt-1">
          Tell us what you're experiencing. We'll help you understand what to do next.
        </p>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm">
        <form onSubmit={handleAnalyze} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              What symptoms are you experiencing? *
            </label>

            <div className="flex gap-2">
              <Input
                placeholder="Type a symptom and press Add or Enter..."
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSymptom(symptomInput);
                  }
                }}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleAddSymptom(symptomInput)}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {symptoms.map((symptom) => (
                <span
                  key={symptom}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold animate-in fade-in"
                >
                  <span>{symptom}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSymptom(symptom)}
                    className="p-0.5 hover:bg-teal-200/50 rounded-full text-teal-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Common Quick Select:</span>
              <div className="flex flex-wrap gap-1.5">
                {commonSymptomChips.map((chip) => {
                  const isSelected = symptoms.includes(chip);
                  return (
                    <button
                      type="button"
                      key={chip}
                      onClick={() => (isSelected ? handleRemoveSymptom(chip) : handleAddSymptom(chip))}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-teal-600 text-white border-teal-600 font-semibold'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '} {chip}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Additional Details (Optional for accuracy)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Age"
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
              />
              <Input
                label="Duration of symptoms"
                placeholder="e.g. 2 days, 3 hours"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
              <Select
                label="Perceived Severity"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                options={[
                  { value: 'mild', label: '🟢 Mild Discomfort' },
                  { value: 'moderate', label: '🟡 Moderate Symptoms' },
                  { value: 'severe', label: '🔴 Severe / Acute Pain' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Existing Medical Conditions"
                placeholder="e.g. Asthma, Diabetes, Hypertension"
                value={existingConditions}
                onChange={(e) => setExistingConditions(e.target.value)}
              />
              <Input
                label="Current Medications"
                placeholder="e.g. Paracetamol, Insulin, Blood Pressure pills"
                value={currentMedicines}
                onChange={(e) => setCurrentMedicines(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              * Non-diagnostic analysis powered by evidence-based triage protocols.
            </p>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              leftIcon={<Sparkles className="w-5 h-5 text-teal-200" />}
            >
              Analyze Symptoms
            </Button>
          </div>
        </form>
      </Card>

      {isLoading && (
        <Card className="bg-white border-slate-200">
          <LoadingState type="full" message="Analyzing reported symptoms against triage guidelines..." />
        </Card>
      )}

      {result && !isLoading && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {result.urgencyLevel === 'emergency' && (
            <EmergencyBanner
              title="Seek Emergency Medical Care Now"
              message={result.urgencyMessage}
              onOpenEmergency={() => onNavigate('emergency')}
              onFindHealthcare={() => onNavigate('healthcare')}
            />
          )}

          <Card className="bg-white border-slate-200 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                  Analysis Report • {result.timestamp}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">Symptom Assessment Result</h3>
              </div>

              <div>
                {result.urgencyLevel === 'emergency' && (
                  <Badge variant="emergency" size="lg" dot>
                    🔴 Seek emergency care
                  </Badge>
                )}
                {result.urgencyLevel === 'consult' && (
                  <Badge variant="consult" size="lg" dot>
                    🟡 Consult a healthcare professional
                  </Badge>
                )}
                {result.urgencyLevel === 'monitor' && (
                  <Badge variant="monitor" size="lg" dot>
                    🟢 Monitor at home
                  </Badge>
                )}
              </div>
            </div>

            <div className="py-4 border-b border-slate-100 space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">What you reported:</h4>
              <div className="flex flex-wrap gap-2">
                {result.symptoms.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold">
                    • {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="py-4 border-b border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">General Information:</h4>
              <p className="text-sm font-semibold text-slate-900 leading-relaxed">{result.summary}</p>
              <ul className="space-y-2 text-xs text-slate-600">
                {result.generalInfo.map((info, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>{info}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="py-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Suggested Next Steps:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.recommendations.map((rec, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs font-medium text-slate-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {result.urgencyLevel === 'emergency' && (
                  <Button
                    variant="emergency"
                    size="md"
                    onClick={() => onNavigate('emergency')}
                    leftIcon={<ShieldAlert className="w-4 h-4 fill-current" />}
                  >
                    Open Emergency Mode
                  </Button>
                )}
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => onNavigate('healthcare')}
                  leftIcon={<MapPin className="w-4 h-4" />}
                >
                  Find Nearby Healthcare
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setResult(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Start New Assessment
              </Button>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{result.disclaimer}</p>
                <p className="mt-0.5 opacity-90">
                  This tool provides educational triage information only. If symptoms persist or worsen, consult a qualified physician immediately.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
