'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function UpdatePassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const accessToken = searchParams.get('access_token');

  useEffect(() => {
    if (!accessToken) {
      toast({ variant: "destructive", title: "Invalid link", description: "No access token found." });
      router.push('/login');
    }
  }, [accessToken, router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password }, { accessToken });
      if (error) throw error;

      toast({ title: "Password updated!", description: "You can now sign in with your new password." });
      router.push('/login');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Update failed", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4 border rounded">
      <h1 className="text-xl font-bold mb-4">Reset Password</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border p-2 rounded"
        />
        <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 rounded">
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}

