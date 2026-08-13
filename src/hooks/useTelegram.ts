import { useState, useCallback, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { TelegramConnection } from '@/types';
import { toast } from 'sonner';

export function useTelegram() {
  const supabase = createClient();
  const [conn, setConn] = useState<TelegramConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchConnection = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from('telegram_connections')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setConn(data);
    } catch (err) {
      console.error('Failed to fetch Telegram connection:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchConnection();
  }, [fetchConnection]);

  const generateToken = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/telegram/connect', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setConn(data);
        toast.success('Token koneksi baru berhasil dibuat!');
      } else {
        toast.error('Gagal membuat token koneksi');
      }
    } catch {
      toast.error('Terjadi kesalahan koneksi');
    } finally {
      setGenerating(false);
    }
  };

  return {
    conn,
    loading,
    generating,
    fetchConnection,
    generateToken,
  };
}
