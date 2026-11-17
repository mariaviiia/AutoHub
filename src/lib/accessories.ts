import { supabase } from './supabase';
import { Accessory } from '@/types';

export async function fetchAccessories(): Promise<Accessory[]> {
  const { data, error } = await supabase
    .from('accessories')
    .select('*')
    .eq('status', 'active')
    .order('name');

  if (error) {
    console.error('Error fetching accessories:', error);
    throw error;
  }

  return (data || []).map((a: any) => ({
    id: a.id,
    name: a.name,
    description: a.description,
    price: Number(a.price),
    currency: a.currency,
    availability: a.availability,
    compatible_vehicles: a.compatible_vehicles || [],
    image_url: a.image_url,
    status: a.status,
    created_at: new Date(a.created_at),
  }));
}
