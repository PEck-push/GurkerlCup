'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import type { GcConfig, GcScore, GcTeam } from './tournamentTypes';

/**
 * Generischer Realtime-Hook: initialer Fetch + Postgres-Changes-Subscription +
 * 20s-Fallback-Refetch + Refetch bei window focus/online (Outdoor-WLAN-robust).
 * Bei jedem Event wird neu geladen (Datenmengen sind winzig).
 */
function useGcTable<T>(table: string): { data: T[]; loading: boolean; refetch: () => void } {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    const { data: rows } = await supabase.from(table).select('*');
    if (rows) setData(rows as T[]);
    setLoading(false);
  }, [table]);

  useEffect(() => {
    refetch();
    const channel = supabase
      .channel(`rt-${table}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, () => refetch())
      .subscribe();

    const interval = setInterval(refetch, 20000);
    const onWake = () => refetch();
    window.addEventListener('focus', onWake);
    window.addEventListener('online', onWake);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
      window.removeEventListener('focus', onWake);
      window.removeEventListener('online', onWake);
    };
  }, [table, refetch]);

  return { data, loading, refetch };
}

export function useGcTeams() {
  return useGcTable<GcTeam>('gc_teams');
}

export function useGcScores() {
  return useGcTable<GcScore>('gc_scores');
}

export function useGcConfig() {
  const { data, loading, refetch } = useGcTable<GcConfig>('gc_config');
  return { config: data[0] ?? null, loading, refetch };
}
