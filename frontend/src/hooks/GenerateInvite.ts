import { supabase } from '@/lib/supabase';

export async function generateInvite(propertyId: string,id:string) {
  const token = crypto.randomUUID();
  const url = import.meta.env.VITE_PUBLIC_APP_URL;

  const expiresAt = new Date(
    Date.now() + 10 * 60 * 1000
  ).toISOString();

  const { error } = await supabase
    .from('property_invites')
    .insert({
      property_id: propertyId,
      token,
      owner_id:id,
      expires_at: expiresAt
    });

  if (error) throw error;

  // return `http://localhost:8080/setPassword?token=${token}&propId=${propertyId}`;
  return `${url}/setPassword?token=${token}&propId=${propertyId}`;
}



export async function validateInvite(token: string) {
  const { data, error } = await supabase
    .from('property_invites')
    .select('*')
    .eq('token', token)
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error || !data) {
    throw new Error('Invalid or expired invite');
  }

  return data;
}
