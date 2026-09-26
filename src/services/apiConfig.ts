// Environment variable for backend REST API connection
// When backend is ready, set VITE_API_URL in .env (e.g. VITE_API_URL=https://api.healthbuddy.app/v1)
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.healthbuddy.mock/v1';

export const IS_MOCK_MODE = !import.meta.env.VITE_API_URL;

// Helper function to simulate network latency for realistic demo UX
export const simulateDelay = (ms: number = 400): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

console.log(`[HealthBuddy API] Connected to ${API_BASE_URL} (Mock Mode: ${IS_MOCK_MODE})`);
