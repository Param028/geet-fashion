
export enum Category {
  BLOUSE = 'Blouse',
  SHORT_ONE_PIECE = 'Short One-Piece',
  LONG_ONE_PIECE = 'Long One-Piece',
  DRESS = 'Dress',
  KURTIS = 'Kurtis',
  JARI_ARI_WORK = 'Jari Ari Work',
  GONDE = 'Gonde'
}

export interface Design {
  id: string;
  name: string;
  category: Category;
  description: string;
  image: string; // base64
  createdAt: string;
}

export interface Measurement {
  // Lengths
  blouseLength: string; // Blouse Total Height
  dressLength: string;  // Dress Total Height
  
  // Torso
  chest: string;
  waistRound: string;
  waistHeight: string;
  seatRound: string;
  tuksPoint: string;
  
  // Limbs & Shoulders
  sleeveLength: string; // Sleeves Height
  armRound: string;
  armhole: string;
  shoulder: string;
  
  // Neck
  frontNeck: string;
  backNeck: string;
  
  // Meta
  notes: string;
  dateSaved: string;
  dueDate?: string; // Target submission/delivery date
  isSubmitted?: boolean; // Track if the order has been completed/delivered
  isPaymentDone?: boolean; // Track if the payment has been settled
}

export interface PreferredDesign {
  id: string;
  image: string;
  category: Category;
  notes: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  measurements?: Measurement;
  preferredDesigns: PreferredDesign[];
}

export interface AdminAuth {
  isLoggedIn: boolean;
  adminId: string;
}