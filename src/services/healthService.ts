import type { SymptomInput, AIAnalysisResult, ActivityLog, FirstAidGuide } from '../types';
import { simulateDelay, API_BASE_URL, IS_MOCK_MODE } from './apiConfig';

const MOCK_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act-1',
    type: 'medicine',
    title: 'Medicine Taken',
    description: 'Vitamin D3 (1000 IU) marked as taken for 8:00 PM dose',
    timestamp: 'Today at 8:05 PM',
  },
  {
    id: 'act-2',
    type: 'prescription',
    title: 'Prescription Added',
    description: 'Dr. Sharma added Amoxicillin 500mg (Post-viral recovery)',
    timestamp: 'Yesterday at 3:15 PM',
  },
  {
    id: 'act-3',
    type: 'appointment',
    title: 'Appointment Completed',
    description: 'Annual Cardio Follow-up with Dr. Rachel Vance',
    timestamp: 'Sep 22, 2026',
  },
  {
    id: 'act-4',
    type: 'record',
    title: 'Health Record Uploaded',
    description: 'Lipid Panel & Metabolic Panel Lab Report (PDF)',
    timestamp: 'Sep 18, 2026',
  },
];

const MOCK_FIRST_AID: FirstAidGuide[] = [
  {
    id: 'fa-bleeding',
    title: 'Severe Bleeding',
    icon: 'Droplet',
    category: 'Trauma',
    urgency: 'critical',
    steps: [
      'Call emergency services immediately if bleeding is rapid or continuous.',
      'Apply direct, firm pressure on the wound using a clean cloth or sterile gauze.',
      'Keep the injured person lying down and comfortable.',
      'Do not remove blood-soaked dressings; add more layers on top.',
      'Elevate the wound above heart level if no bone fractures are suspected.',
    ],
    warnings: [
      'Do not apply a tourniquet unless specially trained or instructed by emergency dispatchers.',
      'Do not probe or try to clean deep arterial wounds yourself.',
    ],
  },
  {
    id: 'fa-burns',
    title: 'Burns & Scalds',
    icon: 'Flame',
    category: 'Thermal',
    urgency: 'high',
    steps: [
      'Cool the burn immediately under cool running tap water for at least 10 to 20 minutes.',
      'Remove clothing or jewelry near the burned area unless stuck to the skin.',
      'Cover loosely with a clean, non-stick plastic wrap or sterile cloth.',
      'Take over-the-counter pain relievers if recommended by a pharmacist.',
    ],
    warnings: [
      'Do NOT apply ice, butter, oils, or toothpaste to a burn.',
      'Do NOT break blisters, as this increases infection risk.',
    ],
  },
  {
    id: 'fa-fainting',
    title: 'Fainting & Loss of Consciousness',
    icon: 'Activity',
    category: 'Neurological',
    urgency: 'medium',
    steps: [
      'Position the person on their back and elevate legs about 12 inches.',
      'Loosen tight clothing around the neck, chest, and waist.',
      'Ensure adequate ventilation and fresh airflow.',
      'Check for responsiveness and normal breathing.',
      'If not breathing normally, call emergency services and begin CPR.',
    ],
    warnings: [
      'Do not give anything to drink or eat until fully alert.',
      'If the person doesn\'t regain consciousness within 1 minute, call emergency services.',
    ],
  },
  {
    id: 'fa-choking',
    title: 'Choking (Adult)',
    icon: 'Wind',
    category: 'Airway',
    urgency: 'critical',
    steps: [
      'Encourage the person to cough forcefully if they can speak or cough.',
      'If unable to speak or breathe, stand behind them and lean them slightly forward.',
      'Give up to 5 sharp back blows between shoulder blades with heel of hand.',
      'Give up to 5 abdominal thrusts (Heimlich maneuver): place fist above navel, pull inward and upward.',
      'Alternate between 5 back blows and 5 abdominal thrusts until object dislodges or emergency arrives.',
    ],
    warnings: [
      'Call emergency services immediately if the airway remains blocked.',
      'If person loses consciousness, lower to ground and begin chest compressions.',
    ],
  },
  {
    id: 'fa-cardiac',
    title: 'Suspected Cardiac Emergency',
    icon: 'HeartPulse',
    category: 'Cardiovascular',
    urgency: 'critical',
    steps: [
      'Call emergency services IMMEDIATELY if experiencing chest crushing pressure, radiating arm/jaw pain, or severe breathlessness.',
      'Have the person sit down, stay calm, and rest comfortably.',
      'Loosen any tight clothing around chest and neck.',
      'Ask if they take prescribed angina medication (e.g. Nitroglycerin).',
      'If trained and person is unresponsive without normal breathing, begin hands-only CPR.',
    ],
    warnings: [
      'Do NOT attempt to drive to the hospital yourself if severe symptoms occur.',
      'Do NOT leave the person unattended.',
    ],
  },
  {
    id: 'fa-seizure',
    title: 'Seizure Response',
    icon: 'Zap',
    category: 'Neurological',
    urgency: 'high',
    steps: [
      'Keep calm and cushion the person\'s head with something soft.',
      'Clear the surrounding area of hard or sharp objects.',
      'Loosen tight neckwear.',
      'Time the duration of the seizure.',
      'Gently turn the person onto their side (recovery position) once jerking stops to keep airway clear.',
    ],
    warnings: [
      'Do NOT hold the person down or restrain their movements.',
      'Do NOT put anything in the person\'s mouth.',
      'Call emergency services if seizure lasts longer than 5 minutes or is followed by another seizure.',
    ],
  },
];

export const analyzeSymptoms = async (input: SymptomInput): Promise<AIAnalysisResult> => {
  await simulateDelay(1200);

  if (!IS_MOCK_MODE) {
    const res = await fetch(`${API_BASE_URL}/ai/analyze-symptoms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return await res.json();
  }

  const symptomsLower = input.symptoms.map((s) => s.toLowerCase());
  const text = symptomsLower.join(' ') + ' ' + (input.existingConditions || '');

  const emergencyKeywords = [
    'chest pain', 'shortness of breath', 'difficulty breathing', 'severe bleeding',
    'stroke', 'numbness on one side', 'slurred speech', 'unconscious', 'severe head injury',
    'crushing chest pressure', 'anaphylaxis', 'choking'
  ];

  const consultKeywords = [
    'high fever', 'fever', 'persistent cough', 'severe stomach pain', 'vomiting',
    'joint swelling', 'dizziness', 'rash', 'earache', 'burning urination',
    'blurred vision', 'infection'
  ];

  let urgency: 'monitor' | 'consult' | 'emergency' = 'monitor';
  
  if (emergencyKeywords.some(k => text.includes(k)) || input.severity === 'severe') {
    urgency = 'emergency';
  } else if (consultKeywords.some(k => text.includes(k)) || input.severity === 'moderate') {
    urgency = 'consult';
  }

  let summary = '';
  let generalInfo: string[] = [];
  let recommendations: string[] = [];
  let urgencyMessage = '';

  if (urgency === 'emergency') {
    summary = 'The symptoms you described may indicate a potential acute condition requiring urgent medical evaluation.';
    urgencyMessage = 'Seek emergency medical care now. Do not wait for symptoms to worsen.';
    generalInfo = [
      'Symptoms like chest pressure, severe shortness of breath, sudden numbness, or heavy bleeding require immediate professional emergency intervention.',
      'Emergency personnel have specialized equipment to stabilize cardiac, respiratory, and neurological events.',
      'Stay seated, refrain from physical exertion, and ensure someone is aware of your status.'
    ];
    recommendations = [
      'Call emergency services (112) immediately.',
      'Keep your location clear and accessible for responders.',
      'Notify your primary emergency contact.',
      'Avoid driving yourself to the emergency department.'
    ];
  } else if (urgency === 'consult') {
    summary = 'Your reported symptoms warrant evaluation by a qualified healthcare professional within 24 to 48 hours.';
    urgencyMessage = 'We recommend scheduling a consultation with a doctor or visiting an urgent care clinic.';
    generalInfo = [
      'Symptoms such as sustained fever, persistent coughing, moderate localized pain, or skin rashes are common signs of viral or bacterial infections that benefit from clinical assessment.',
      'Hydration, adequate rest, and monitoring body temperature can aid early management while awaiting appointment.',
      'Keeping a log of symptom onset and trigger factors will help your doctor make an accurate assessment.'
    ];
    recommendations = [
      'Book a primary care appointment or visit a nearby urgent care clinic.',
      'Monitor your body temperature twice daily.',
      'Stay well hydrated with clear liquids and rest.',
      'If symptoms escalate into difficulty breathing or confusion, transition to Emergency Mode.'
    ];
  } else {
    summary = 'Your reported symptoms appear mild and consistent with common, self-limiting discomforts.';
    urgencyMessage = 'Monitor your condition closely. Most mild symptoms improve with rest and self-care.';
    generalInfo = [
      'Mild fatigue, low-grade congestion, or minor muscle tightness often respond well to conservative home measures.',
      'Getting sufficient sleep, maintaining balanced nutrition, and drinking ample fluids support recovery.',
      'Symptoms that persist beyond 5–7 days should be discussed with a doctor.'
    ];
    recommendations = [
      'Ensure 7–9 hours of restful sleep daily.',
      'Maintain steady fluid intake (water, herbal teas).',
      'Re-evaluate symptoms in 24 to 48 hours.',
      'Consult a pharmacist before taking over-the-counter medications.'
    ];
  }

  return {
    symptoms: input.symptoms,
    summary,
    generalInfo,
    urgencyLevel: urgency,
    recommendations,
    urgencyMessage,
    disclaimer: 'This is general health information, not a medical diagnosis. HealthBuddy provides educational guidance only. If in doubt, seek professional medical care.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
};

export const getRecentActivities = async (): Promise<ActivityLog[]> => {
  await simulateDelay(200);
  const session = localStorage.getItem('healthbuddy_auth_session');
  if (!session) return [];
  try {
    const raw = localStorage.getItem(`healthbuddy_activities_${session}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const getFirstAidGuides = async (): Promise<FirstAidGuide[]> => {
  await simulateDelay(150);
  return [...MOCK_FIRST_AID];
};
