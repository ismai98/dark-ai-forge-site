
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Image, File, Trash2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MediaAsset {
  id: string;
  filename: string;
  file_path: string;
  file_type: string;
  file_size: number | null;
  alt_text: string | null;
  caption: string | null;
  created_at: string;
}

const MediaManager = () => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const { data, error } = await supabase
        .from('media_assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssets(data || []);
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Medien konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Hier würde normalerweise der Upload zu Supabase Storage erfolgen
      // Für jetzt simulieren wir es
      const filePath = `uploads/${Date.now()}_${file.name}`;
      
      const { error } = await supabase
        .from('media_assets')
        .insert({
          filename: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          alt_text: '',
          caption: ''
        });

      if (error) throw error;

      toast({
        title: "Erfolg",
        description: "Datei erfolgreich hochgeladen",
      });

      fetchAssets();
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Datei konnte nicht hochgeladen werden",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteAsset = async (id: string) => {
    try {
      const { error } = await supabase
        .from('media_assets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Erfolg",
        description: "Datei erfolgreich gelöscht",
      });

      fetchAssets();
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Datei konnte nicht gelöscht werden",
        variant: "destructive",
      });
    }
  };

  const copyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    toast({
      title: "Kopiert",
      description: "Dateipfad in die Zwischenablage kopiert",
    });
  };

  if (loading) {
    return <div className="text-white">Lade Medien...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Medien-Verwaltung</h2>
          <p className="text-gray-400">Verwalten Sie Bilder und Dateien für Ihre Website</p>
        </div>
        <div>
          <Label htmlFor="file-upload" className="cursor-pointer">
            <Button asChild disabled={uploading} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <span>
                <Upload size={16} className="mr-2" />
                {uploading ? 'Wird hochgeladen...' : 'Datei hochladen'}
              </span>
            </Button>
          </Label>
          <Input
            id="file-upload"
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {assets.map((asset) => (
          <Card key={asset.id} className="bg-gray-900/95 border-gray-800 backdrop-blur-sm hover:border-gray-700 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {asset.file_type.startsWith('image/') ? (
                    <Image size={16} className="text-blue-400" />
                  ) : (
                    <File size={16} className="text-gray-400" />
                  )}
                  <CardTitle className="text-white text-sm truncate">{asset.filename}</CardTitle>
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyPath(asset.file_path)}
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 h-6 w-6 p-0"
                  >
                    <Copy size={12} />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteAsset(asset.id)}
                    className="h-6 w-6 p-0"
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {asset.file_type.startsWith('image/') && (
                <div className="aspect-video bg-gray-800 rounded mb-2 flex items-center justify-center">
                  <Image size={24} className="text-gray-500" />
                </div>
              )}
              <div className="text-xs text-gray-400 space-y-1">
                <p>Typ: {asset.file_type}</p>
                <p>Größe: {asset.file_size ? `${(asset.file_size / 1024).toFixed(1)} KB` : 'Unbekannt'}</p>
                <p>Pfad: <code className="bg-gray-800 px-1 rounded">{asset.file_path}</code></p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MediaManager;
