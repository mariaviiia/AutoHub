// User Types
export type UserRole = 'buyer' | 'dealer' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  created_at: Date;
}

// Dealer Types
export type DealerStatus = 'pending' | 'active' | 'suspended';

export interface Dealer {
  id: number;
  name: string;
  license_number: string;
  address: string;
  city: string;
  country: string;
  status: DealerStatus;
  plan_type?: 'basic' | 'premium';
  created_at: Date;
}

// Vehicle Types
export type VehicleCondition = 'used' | 'certified';
export type VehicleStatus = 'active' | 'sold' | 'archived';

export interface Vehicle {
  id: number;
  dealer_id: number;
  vin: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage_km: number;
  fuel_type: string;
  transmission: string;
  color: string;
  condition: VehicleCondition;
  status: VehicleStatus;
  published_at: Date;
  images: VehicleImage[];
  dealer?: Dealer;
}

export interface VehicleImage {
  id: number;
  vehicle_id: number;
  url: string;
  order: number;
  is_primary: boolean;
}

// Lead Types
export type LeadStatus = 'new' | 'contacted' | 'closed' | 'lost';

export interface Lead {
  id: number;
  user_id: number;
  vehicle_id: number;
  dealer_id: number;
  message: string;
  status: LeadStatus;
  created_at: Date;
  contacted_at?: Date;
  user?: User;
  vehicle?: Vehicle;
  dealer?: Dealer;
}

// Test Drive Types
export type TestDriveStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface TestDrive {
  id: number;
  user_id: number;
  vehicle_id: number;
  dealer_id: number;
  scheduled_at: Date;
  status: TestDriveStatus;
  location: string;
  user?: User;
  vehicle?: Vehicle;
  dealer?: Dealer;
}

// Financing Request Types
export type FinancingStatus = 'pending' | 'approved' | 'rejected';

export interface FinancingRequest {
  id: number;
  user_id: number;
  vehicle_id: number;
  amount: number;
  term_months: number;
  employment_status: string;
  annual_income: number;
  status: FinancingStatus;
  created_at: Date;
  user?: User;
  vehicle?: Vehicle;
}

// Favorite Types
export interface Favorite {
  id: number;
  user_id: number;
  vehicle_id: number;
  created_at: Date;
  vehicle?: Vehicle;
}

// Search Filter Types
export interface SearchFilters {
  make?: string;
  model?: string;
  year_min?: number;
  year_max?: number;
  price_min?: number;
  price_max?: number;
  mileage_km_min?: number;
  mileage_km_max?: number;
  fuel_type?: string;
  transmission?: string;
  city?: string;
  country?: string;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
