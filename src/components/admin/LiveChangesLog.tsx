
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Activity, RefreshCw, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LiveChange {
  id: string;
  change_type: string;
  target_type: string;
  target_id: string;
  old_value: any;
  new_value: any;
  created_at: string;
}

const LiveChangesLog = () => {
  const [changes, setChanges] = useState<LiveChange[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchChanges();
    const interval = setInterval(fetchChanges, 5000); // Aktualisiere alle 5 Sekunden
    return () => clearInterval(interval);
  }, []);

  const fetchChanges = async () => {
    try {
      const { data, error } = await supabase
        .from('live_changes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setChanges(data || []);
    } catch (error) {
      console.error('Error fetching changes:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearChanges = async () => {
    if (!confirm('Sind Sie sicher, dass Sie das Änderungsprotokoll löschen möchten?')) return;

    try {
      const { error } = await supabase
        .from('live_changes')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) throw error;
      
      toast({
        title: "Erfolg",
        description: "Änderungsprotokoll gelöscht",
      });
      
      setChanges([]);
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Änderungsprotokoll konnte nicht gelöscht werden",
        variant: "destructive",
      });
    }
  };

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case 'content': return 'bg-blue-500';
      case 'style': return 'bg-purple-500';
      case 'layout': return 'bg-green-500';
      case 'section': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getTargetTypeIcon = (type: string) => {
    switch (type) {
      case 'project': return '📁';
      case 'skill': return '⚡';
      case 'page_section': return '📄';
      case 'theme': return '🎨';
      default: return '📝';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('de-DE');
  };

  if (loading) {
    return <div className="text-white">Lade Änderungsprotokoll...</div>;
  }

  return (
    <Card className="bg-gray-900/95 border-gray-800 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center">
            <Activity className="mr-2" size={20} />
            Live-Änderungsprotokoll
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={fetchChanges}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <RefreshCw size={16} className="mr-2" />
              Aktualisieren
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={clearChanges}
              disabled={changes.length === 0}
            >
              <Trash2 size={16} className="mr-2" />
              Löschen
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {changes.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <Activity size={48} className="mx-auto mb-4 opacity-50" />
            <p>Keine Änderungen aufgezeichnet</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {changes.map((change) => (
              <div key={change.id} className="bg-gray-800/50 p-3 rounded border border-gray-700 hover:border-gray-600 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{getTargetTypeIcon(change.target_type)}</span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getChangeTypeColor(change.change_type)} text-white`}>
                          {change.change_type}
                        </Badge>
                        <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                          {change.target_type}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">
                        ID: {change.target_id.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                  <span className="text-gray-500 text-xs">
                    {formatTimestamp(change.created_at)}
                  </span>
                </div>
                
                {change.new_value && (
                  <div className="bg-gray-900/50 p-2 rounded text-xs font-mono text-gray-300 max-h-20 overflow-y-auto">
                    <pre>{JSON.stringify(change.new_value, null, 2)}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveChangesLog;
