
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ContentRevision {
  id: string;
  target_type: string;
  target_id: string;
  revision_data: any;
  revision_comment: string | null;
  created_by: string | null;
  created_at: string;
}

export const useContentRevisions = (targetType: string, targetId: string) => {
  const [revisions, setRevisions] = useState<ContentRevision[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRevisions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('content_revisions')
        .select('*')
        .eq('target_type', targetType)
        .eq('target_id', targetId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setRevisions(data || []);
    } catch (error) {
      console.error('Error fetching revisions:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveRevision = async (data: any, comment?: string) => {
    try {
      const { error } = await supabase
        .from('content_revisions')
        .insert({
          target_type: targetType,
          target_id: targetId,
          revision_data: data,
          revision_comment: comment,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
      fetchRevisions();
    } catch (error) {
      console.error('Error saving revision:', error);
    }
  };

  useEffect(() => {
    if (targetId) {
      fetchRevisions();
    }
  }, [targetType, targetId]);

  return { revisions, loading, saveRevision, fetchRevisions };
};
