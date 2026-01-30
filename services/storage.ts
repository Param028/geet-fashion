import { Design, Customer, AdminAuth, Category } from '../types';
import { createClient } from '@supabase/supabase-js';

// Robust environment variable retrieval
const getEnv = (key: string) => {
  let value = '';
  
  // 1. Try Modern ESM / Vite (import.meta.env)
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      value = import.meta.env[key] || import.meta.env[`VITE_${key}`];
    }
  } catch (e) {}

  // 2. Try Node / Webpack / CRA (process.env)
  if (!value) {
    try {
      if (typeof process !== 'undefined' && process.env) {
        value = (process.env as any)[key] || 
                (process.env as any)[`REACT_APP_${key}`] || 
                (process.env as any)[`VITE_${key}`];
      }
    } catch (e) {}
  }
  
  return value;
};

// Check Local Storage for manual overrides (User Settings)
const getStoredConfig = () => {
  try {
    const config = localStorage.getItem('geet_cloud_config');
    if (config) return JSON.parse(config);
  } catch(e) {}
  return null;
};

const storedConfig = getStoredConfig();
const SUPABASE_URL = storedConfig?.url || getEnv('SUPABASE_URL');
const SUPABASE_KEY = storedConfig?.key || getEnv('SUPABASE_ANON_KEY');

// Initialize Supabase if keys exist
const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const KEYS = {
  AUTH: 'geet_auth',
  CLOUD_CONFIG: 'geet_cloud_config'
};

export const storage = {
  isCloud: () => !!supabase,

  // NEW: Save Cloud Config manually
  saveCloudConfig: (url: string, key: string) => {
    localStorage.setItem(KEYS.CLOUD_CONFIG, JSON.stringify({ url, key }));
    window.location.reload(); // Reload to re-initialize supabase client
  },

  getCloudConfig: () => {
    return getStoredConfig();
  },

  init: async () => {
    // No initialization needed for online-only
  },

  // NEW: Upload image to Supabase Storage
  uploadImage: async (file: Blob | File): Promise<string> => {
    if (!supabase) throw new Error("Cloud storage not connected. Please configure Supabase in Settings.");
    
    // Create a unique file name
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    // Determine extension
    let ext = 'jpg';
    if (file instanceof File) {
        const parts = file.name.split('.');
        if (parts.length > 1) ext = parts.pop() || 'jpg';
    }
    
    const filePath = `${timestamp}-${random}.${ext}`;

    // Upload to 'designs' bucket
    const { error: uploadError } = await supabase.storage
      .from('designs')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload Error:', uploadError);
      throw uploadError;
    }

    // Get Public URL
    const { data } = supabase.storage
      .from('designs')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  getDesigns: async (): Promise<Design[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase.from('designs').select('*').order('createdAt', { ascending: false });
    if (error) {
      console.error('Supabase fetch error:', error);
      return []; 
    }
    return data as Design[];
  },

  saveDesign: async (design: Design) => {
    if (!supabase) throw new Error("Cloud connection required");
    const { error } = await supabase.from('designs').insert([design]);
    if (error) throw error;
  },

  deleteDesign: async (id: string) => {
    if (!supabase) throw new Error("Cloud connection required");
    const { error } = await supabase.from('designs').delete().eq('id', id);
    if (error) throw error;
  },

  getCustomers: async (): Promise<Customer[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase.from('customers').select('*').order('name');
    if (error) {
      console.error('Supabase customer fetch error:', error);
      return [];
    }
    return data as Customer[];
  },

  saveCustomer: async (customer: Customer) => {
    if (!supabase) throw new Error("Cloud connection required");
    const { data } = await supabase.from('customers').select('id').eq('id', customer.id).single();
    if (data) {
      const { error } = await supabase.from('customers').update(customer).eq('id', customer.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('customers').insert([customer]);
      if (error) throw error;
    }
  },

  deleteCustomer: async (id: string) => {
    if (!supabase) throw new Error("Cloud connection required");
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (error) throw error;
  },

  getAuth: (): AdminAuth | null => {
    const data = localStorage.getItem(KEYS.AUTH);
    return data ? JSON.parse(data) : null;
  },

  setAuth: (auth: AdminAuth) => {
    localStorage.setItem(KEYS.AUTH, JSON.stringify(auth));
  },

  clearAuth: () => {
    localStorage.removeItem(KEYS.AUTH);
  }
};