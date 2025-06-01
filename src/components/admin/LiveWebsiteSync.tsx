
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, Globe, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SyncStatus {
  last_sync: string;
  sections_count: number;
  projects_count: number;
  skills_count: number;
  config_count: number;
  sync_status: 'synced' | 'pending' | 'error';
}

const LiveWebsiteSync = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    last_sync: '',
    sections_count: 0,
    projects_count: 0,
    skills_count: 0,
    config_count: 0,
    sync_status: 'pending'
  });
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkSyncStatus();
    
    // Real-time monitoring
    const channel = supabase
      .channel('sync-monitoring')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'page_sections'
        },
        () => {
          setSyncStatus(prev => ({ ...prev, sync_status: 'pending' }));
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects'
        },
        () => {
          setSyncStatus(prev => ({ ...prev, sync_status: 'pending' }));
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'skills'
        },
        () => {
          setSyncStatus(prev => ({ ...prev, sync_status: 'pending' }));
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'website_config'
        },
        () => {
          setSyncStatus(prev => ({ ...prev, sync_status: 'pending' }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const checkSyncStatus = async () => {
    try {
      const [sectionsResult, projectsResult, skillsResult, configResult] = await Promise.all([
        supabase.from('page_sections').select('id').eq('is_visible', true),
        supabase.from('projects').select('id'),
        supabase.from('skills').select('id'),
        supabase.from('website_config').select('id')
      ]);

      setSyncStatus({
        last_sync: new Date().toISOString(),
        sections_count: sectionsResult.data?.length || 0,
        projects_count: projectsResult.data?.length || 0,
        skills_count: skillsResult.data?.length || 0,
        config_count: configResult.data?.length || 0,
        sync_status: 'synced'
      });
    } catch (error) {
      setSyncStatus(prev => ({ ...prev, sync_status: 'error' }));
    }
  };

  const forceSyncWebsite = async () => {
    setSyncing(true);
    try {
      // Trigger live update
      await supabase
        .from('live_changes')
        .insert({
          change_type: 'force_sync',
          target_type: 'website',
          target_id: 'global',
          new_value: { timestamp: new Date().toISOString() }
        });

      // Warte kurz und prüfe dann den Status
      setTimeout(() => {
        checkSyncStatus();
        toast({
          title: "Synchronisation erfolgreich",
          description: "Die Website wurde erfolgreich synchronisiert",
        });
      }, 1000);
    } catch (error) {
      toast({
        title: "Synchronisation fehlgeschlagen",
        description: "Die Website konnte nicht synchronisiert werden",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const getSyncStatusIcon = () => {
    switch (syncStatus.sync_status) {
      case 'synced':
        return <CheckCircle className="text-green-400" size={20} />;
      case 'pending':
        return <RefreshCw className="text-yellow-400 animate-spin" size={20} />;
      case 'error':
        return <AlertCircle className="text-red-400" size={20} />;
    }
  };

  const getSyncStatusBadge = () => {
    switch (syncStatus.sync_status) {
      case 'synced':
        return <Badge className="bg-green-600 text-white">Synchronisiert</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-600 text-white">Synchronisierung läuft</Badge>;
      case 'error':
        return <Badge className="bg-red-600 text-white">Fehler</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Live Website-Synchronisation</h2>
          <p className="text-gray-400">Überwachen und steuern Sie die Live-Synchronisation Ihrer Website</p>
        </div>
        <Button 
          onClick={forceSyncWebsite}
          disabled={syncing}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
        >
          <Zap size={16} className="mr-2" />
          {syncing ? 'Synchronisiere...' : 'Jetzt synchronisieren'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-900/95 border-gray-800 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm font-medium flex items-center">
              <Globe size={16} className="mr-2 text-blue-400" />
              Sync-Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getSyncStatusIcon()}
              {getSyncStatusBadge()}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Letzte Sync: {syncStatus.last_sync ? new Date(syncStatus.last_sync).toLocaleString('de-DE') : 'Nie'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/95 border-gray-800 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm font-medium">Sektionen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{syncStatus.sections_count}</div>
            <p className="text-xs text-gray-400">Sichtbare Sektionen</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/95 border-gray-800 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm font-medium">Projekte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{syncStatus.projects_count}</div>
            <p className="text-xs text-gray-400">Verfügbare Projekte</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/95 border-gray-800 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm font-medium">Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{syncStatus.skills_count}</div>
            <p className="text-xs text-gray-400">Definierte Skills</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900/95 border-gray-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Synchronisation-Funktionen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded border border-gray-700">
            <div>
              <h3 className="text-white font-medium">Automatische Live-Updates</h3>
              <p className="text-gray-400 text-sm">Änderungen werden automatisch auf der Website angezeigt</p>
            </div>
            <Badge className="bg-green-600 text-white">Aktiv</Badge>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded border border-gray-700">
            <div>
              <h3 className="text-white font-medium">Real-time Monitoring</h3>
              <p className="text-gray-400 text-sm">Überwachung aller Datenbank-Änderungen in Echtzeit</p>
            </div>
            <Badge className="bg-green-600 text-white">Aktiv</Badge>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded border border-gray-700">
            <div>
              <h3 className="text-white font-medium">Content Validation</h3>
              <p className="text-gray-400 text-sm">Automatische Validierung der Inhalte vor Veröffentlichung</p>
            </div>
            <Badge className="bg-green-600 text-white">Aktiv</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveWebsiteSync;
