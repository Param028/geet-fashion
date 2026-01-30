import { Category } from './types';

export const ADMIN_CREDENTIALS = {
  id: 'gsj6600',
  password: '6600'
};

export const CATEGORIES = Object.values(Category);

export const THEME_COLORS = {
  babyPink: '#f6c1cc',
  softWhite: '#fff7f9',
  gold: '#c9a14a',
  darkBrown: '#4a2c2a'
};

// --- CLOUD CONFIGURATION (REQUIRED FOR MOBILE/CROSS-DEVICE) ---
// 1. Go to Supabase Dashboard (https://supabase.com/dashboard) -> Project Settings -> API
// 2. Copy "Project URL" and paste it inside the quotes below.
// 3. Copy "anon public" key and paste it inside the quotes below.
export const SUPABASE_CONFIG = {
  url: 'https://hkzijgiuytvpkyerbtxv.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhremlqZ2l1eXR2cGt5ZXJidHh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1ODc2ODIsImV4cCI6MjA4NTE2MzY4Mn0.wI4G1lZMQdz6pjuzN50QZRibxMq0XR-jAi3EYdIkoK4'
};

// INSTRUCTION: 
// To use your own logo: 
// 1. Upload a file named 'logo.png' to your project root.
// 2. Change the line below to: export const LOGO_SRC = '/logo.png';
export const LOGO_SRC = 'https://cdn-icons-png.flaticon.com/512/9373/9373467.png'; // Elegant dress icon placeholder