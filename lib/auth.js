import { supabase } from '@/lib/supabase';

/**
 * Get user from authorization header
 * Securely verifies and decrypts the JWT provided inside the API routes with Supabase auth mechanism. 
 * @param {Request} req 
 */
export const getUserFromRequest = async (req) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  
  // Directly passes token into Supabase to verify decoding without exposed Secrets
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) return null;
  return user;
};
