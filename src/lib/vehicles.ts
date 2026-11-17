import { supabase } from './supabase';
import { Vehicle } from '@/types';

export interface FetchVehiclesOptions {
  status?: string;
  dealerId?: number;
  includeImages?: boolean;
  includeDealer?: boolean;
  orderBy?: string;
  ascending?: boolean;
  transform?: boolean;
}

export async function fetchVehicles(options: FetchVehiclesOptions = {}): Promise<any[]> {
  const {
    status,
    dealerId,
    includeImages = true,
    includeDealer = true,
    orderBy,
    ascending = false,
    transform = true,
  } = options;

  let query = supabase.from('vehicles').select(`
    *,
    ${includeDealer ? 'dealer:dealers(*)' : ''},
    ${includeImages ? 'vehicle_images(id, url, order_index, is_primary, vehicle_id)' : ''}
  `);

  if (status) {
    query = query.eq('status', status);
  }

  if (dealerId) {
    query = query.eq('dealer_id', dealerId);
  }

  if (orderBy) {
    query = query.order(orderBy, { ascending });
  }

  const { data: vehiclesData, error: vehiclesError } = await query;

  if (vehiclesError) {
    console.error('Error fetching vehicles:', vehiclesError);
    throw vehiclesError;
  }

  if (!transform) {
    return vehiclesData || [];
  }

  // Transform data to match Vehicle type
  const transformedVehicles: Vehicle[] = vehiclesData?.map((v: any) => ({
    id: v.id,
    dealer_id: v.dealer_id,
    vin: v.vin,
    make: v.make,
    model: v.model,
    year: v.year,
    price: Number(v.price),
    mileage_km: v.mileage_km,
    fuel_type: v.fuel_type,
    transmission: v.transmission,
    color: v.color,
    condition: v.condition,
    status: v.status,
    published_at: new Date(v.published_at),
    images: v.vehicle_images?.map((img: any) => ({
      id: img.id,
      vehicle_id: img.vehicle_id,
      url: img.url,
      order: img.order_index,
      is_primary: img.is_primary,
    })) || [],
    dealer: v.dealer,
  })) || [];

  return transformedVehicles;
}

export async function fetchVehicleById(id: string | number): Promise<Vehicle | null> {
  const { data: vehicleData, error: vehicleError } = await supabase
    .from('vehicles')
    .select(`
      *,
      dealer:dealers(*),
      vehicle_images(id, url, order_index, is_primary, vehicle_id)
    `)
    .eq('id', id)
    .single();

  if (vehicleError) {
    console.error('Error fetching vehicle:', vehicleError);
    return null;
  }

  if (!vehicleData) {
    return null;
  }

  // Transform data to match Vehicle type
  const transformedVehicle: Vehicle = {
    id: vehicleData.id,
    dealer_id: vehicleData.dealer_id,
    vin: vehicleData.vin,
    make: vehicleData.make,
    model: vehicleData.model,
    year: vehicleData.year,
    price: Number(vehicleData.price),
    mileage_km: vehicleData.mileage_km,
    fuel_type: vehicleData.fuel_type,
    transmission: vehicleData.transmission,
    color: vehicleData.color,
    condition: vehicleData.condition,
    status: vehicleData.status,
    published_at: new Date(vehicleData.published_at),
    images: vehicleData.vehicle_images?.map((img: any) => ({
      id: img.id,
      vehicle_id: img.vehicle_id,
      url: img.url,
      order: img.order_index,
      is_primary: img.is_primary,
    })) || [],
    dealer: vehicleData.dealer,
  };

  return transformedVehicle;
}
