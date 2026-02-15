import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useAppMode() {
  const { data: settings = [] } = useQuery({
    queryKey: ['app-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('app_settings').select('*');
      if (error) throw error;
      return data || [];
    },
  });

  const mode = settings.find((s: any) => s.key === 'qontak_mode')?.value || 'dummy';
  return { isLive: mode === 'live', mode };
}
