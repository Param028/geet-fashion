import { Design, Customer, AdminAuth, Category } from '../types';
import { createClient } from '@supabase/supabase-js';

// Safely check for process.env to avoid ReferenceError in browser
const getEnv = (key: string) => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return (process.env as any)[key];
    }
  } catch (e) {
    // environment not available
  }
  return '';
};

const SUPABASE_URL = getEnv('SUPABASE_URL');
const SUPABASE_KEY = getEnv('SUPABASE_ANON_KEY');

// Initialize Supabase if keys exist
const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const KEYS = {
  DESIGNS: 'geet_designs',
  CUSTOMERS: 'geet_customers',
  AUTH: 'geet_auth',
  INITIALIZED: 'geet_initialized'
};

export const storage = {
  isCloud: () => !!supabase,

  init: async () => {
    if (!localStorage.getItem(KEYS.INITIALIZED)) {
      if (!supabase) {
        // Initialize with empty arrays for production
        localStorage.setItem(KEYS.DESIGNS, JSON.stringify([]));
        localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify([]));
      }
      localStorage.setItem(KEYS.INITIALIZED, 'true');
    }
  },

  // NEW: Upload image to Supabase Storage
  uploadImage: async (file: File): Promise<string> => {
    if (!supabase) throw new Error("Cloud storage not connected");
    
    // Create a unique file name: timestamp-sanitized_name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${fileName}`;

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
    if (supabase) {
      const { data, error } = await supabase.from('designs').select('*').order('createdAt', { ascending: false });
      if (error) {
        console.error('Supabase fetch error:', error);
        return []; 
      }
      if (data) return data as Design[];
    }
    const data = localStorage.getItem(KEYS.DESIGNS);
    try {
      const parsed = data ? JSON.parse(data) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Error parsing designs:', e);
      return [];
    }
  },

  saveDesign: async (design: Design) => {
    if (supabase) {
      const { error } = await supabase.from('designs').insert([design]);
      if (error) throw error;
    } else {
      const designs = await storage.getDesigns();
      designs.unshift(design); // Add to beginning
      localStorage.setItem(KEYS.DESIGNS, JSON.stringify(designs));
    }
  },

  deleteDesign: async (id: string) => {
    if (supabase) {
      const { error } = await supabase.from('designs').delete().eq('id', id);
      if (error) throw error;
    } else {
      const designs = await storage.getDesigns();
      const updated = designs.filter(d => String(d.id) !== String(id));
      localStorage.setItem(KEYS.DESIGNS, JSON.stringify(updated));
    }
  },

  getCustomers: async (): Promise<Customer[]> => {
    if (supabase) {
      const { data, error } = await supabase.from('customers').select('*').order('name');
      if (error) {
        console.error('Supabase customer fetch error:', error);
        return [];
      }
      if (data) return data as Customer[];
    }
    const data = localStorage.getItem(KEYS.CUSTOMERS);
    try {
      const customers = data ? JSON.parse(data) : [];
      return Array.isArray(customers) ? customers.sort((a: Customer, b: Customer) => a.name.localeCompare(b.name)) : [];
    } catch (e) {
      return [];
    }
  },

  saveCustomer: async (customer: Customer) => {
    if (supabase) {
      const { data } = await supabase.from('customers').select('id').eq('id', customer.id).single();
      if (data) {
        const { error } = await supabase.from('customers').update(customer).eq('id', customer.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('customers').insert([customer]);
        if (error) throw error;
      }
    } else {
      const customers = (await storage.getCustomers()).filter(c => String(c.id) !== String(customer.id));
      customers.push(customer);
      localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(customers));
    }
  },

  deleteCustomer: async (id: string) => {
    if (supabase) {
      const { error } = await supabase.from('customers').delete().eq('id', id);
      if (error) throw error;
    } else {
      const customers = (await storage.getCustomers()).filter(c => String(c.id) !== String(id));
      localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(customers));
    }
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