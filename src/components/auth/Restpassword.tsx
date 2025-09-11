import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/integrations/supabase/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { accessToken, newPassword } = req.body;

  if (!accessToken || !newPassword) return res.status(400).json({ error: 'Missing parameters' });

  const { data, error } = await supabase.auth.updateUser(accessToken, {
    password: newPassword,
  });

  if (error) return res.status(400).json({ error: error.message });

  return res.status(200).json({ message: 'Password updated successfully' });
}
