
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useRealtimeUpdates = () => {
  const [updates, setUpdates] = useState<any[]>([]);

  useEffect(() => {
    const channel = supabase
      .channel('live-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'page_sections'
        },
        (payload) => {
          console.log('Page section updated:', payload);
          setUpdates(prev => [...prev, { type: 'page_sections', ...payload }]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects'
        },
        (payload) => {
          console.log('Project updated:', payload);
          setUpdates(prev => [...prev, { type: 'projects', ...payload }]);
          window.dispatchEvent(new CustomEvent('projectsUpdated', { detail: payload }));
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'skills'
        },
        (payload) => {
          console.log('Skill updated:', payload);
          setUpdates(prev => [...prev, { type: 'skills', ...payload }]);
          window.dispatchEvent(new CustomEvent('skillsUpdated', { detail: payload }));
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'theme_settings'
        },
        (payload) => {
          console.log('Theme updated:', payload);
          setUpdates(prev => [...prev, { type: 'theme_settings', ...payload }]);
          window.dispatchEvent(new CustomEvent('themeUpdated', { detail: payload }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return updates;
};
