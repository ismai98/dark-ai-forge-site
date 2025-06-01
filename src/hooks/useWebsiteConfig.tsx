
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WebsiteConfig {
  [key: string]: any;
}

export const useWebsiteConfig = () => {
  const [config, setConfig] = useState<WebsiteConfig>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchConfig();
    
    // Real-time updates für Website-Konfiguration
    const channel = supabase
      .channel('website-config-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'website_config'
        },
        () => {
          fetchConfig();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('website_config')
        .select('*');

      if (error) throw error;

      const configObj: WebsiteConfig = {};
      data?.forEach(item => {
        configObj[item.config_key] = item.config_value;
      });
      
      setConfig(configObj);
    } catch (error) {
      console.error('Error fetching website config:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (key: string, value: any) => {
    try {
      const { error } = await supabase
        .from('website_config')
        .upsert({
          config_key: key,
          config_value: value,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Erfolgreich aktualisiert",
        description: `${key} wurde erfolgreich gespeichert.`,
      });

      fetchConfig();
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Konfiguration konnte nicht gespeichert werden.",
        variant: "destructive",
      });
    }
  };

  return { config, loading, updateConfig, fetchConfig };
};
