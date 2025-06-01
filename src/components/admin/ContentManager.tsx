import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, Edit, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContentItem {
  id: string;
  type: 'config' | 'section';
  key: string;
  value: any;
  description?: string;
}

interface FormData {
  type: 'config' | 'section';
  key: string;
  value: any;
  description: string;
}

const ContentManager = () => {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const emptyContent: FormData = {
    type: 'config',
    key: '',
    value: '',
    description: ''
  };

  const [formData, setFormData] = useState<FormData>(emptyContent);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      // Fetch website config
      const { data: configData, error: configError } = await supabase
        .from('website_config')
        .select('*')
        .order('config_key', { ascending: true });

      if (configError) throw configError;

      // Fetch page sections
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('page_sections')
        .select('*')
        .order('page_id, section_order', { ascending: true });

      if (sectionsError) throw sectionsError;

      // Combine data
      const combinedData: ContentItem[] = [
        ...(configData || []).map(item => ({
          id: item.id,
          type: 'config' as const,
          key: item.config_key,
          value: item.config_value,
          description: item.description
        })),
        ...(sectionsData || []).map(item => ({
          id: item.id,
          type: 'section' as const,
          key: `${item.page_id}_${item.section_type}`,
          value: item.content,
          description: item.title
        }))
      ];

      setContents(combinedData);
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Website-Inhalte konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingContent) {
        if (editingContent.type === 'config') {
          const { error } = await supabase
            .from('website_config')
            .update({
              config_value: formData.value,
              description: formData.description
            })
            .eq('id', editingContent.id);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('page_sections')
            .update({
              content: formData.value,
              title: formData.description
            })
            .eq('id', editingContent.id);

          if (error) throw error;
        }

        toast({
          title: "Erfolg",
          description: "Inhalt erfolgreich aktualisiert",
        });
      } else {
        // Create new config entry
        const { error } = await supabase
          .from('website_config')
          .insert([{
            config_key: formData.key,
            config_value: formData.value,
            description: formData.description
          }]);

        if (error) throw error;
        toast({
          title: "Erfolg",
          description: "Inhalt erfolgreich erstellt",
        });
      }

      setEditingContent(null);
      setIsCreating(false);
      setFormData(emptyContent);
      fetchContents();
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Inhalt konnte nicht gespeichert werden",
        variant: "destructive",
      });
    }
  };

  const startEdit = (content: ContentItem) => {
    setEditingContent(content);
    setFormData({
      type: content.type,
      key: content.key,
      value: content.value,
      description: content.description || ''
    });
    setIsCreating(false);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingContent(null);
    setFormData(emptyContent);
  };

  const cancelEdit = () => {
    setEditingContent(null);
    setIsCreating(false);
    setFormData(emptyContent);
  };

  if (loading) {
    return <div className="text-white">Lade Website-Inhalte...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Website-Inhalte verwalten</h2>
          <p className="text-gray-400">Bearbeiten Sie Texte und Inhalte Ihrer Website</p>
        </div>
        <Button onClick={startCreate} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus size={16} className="mr-2" />
          Inhalt hinzufügen
        </Button>
      </div>

      {(isCreating || editingContent) && (
        <Card className="bg-gray-900/95 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">
              {editingContent ? 'Inhalt bearbeiten' : 'Neuen Inhalt erstellen'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="content_key" className="text-gray-300">Inhalts-Schlüssel</Label>
              <Input
                id="content_key"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                placeholder="hero_title, site_description, etc."
                disabled={!!editingContent}
              />
            </div>

            <div>
              <Label htmlFor="content_value" className="text-gray-300">Inhalt</Label>
              <Textarea
                id="content_value"
                value={typeof formData.value === 'string' ? formData.value : JSON.stringify(formData.value, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setFormData({ ...formData, value: parsed });
                  } catch {
                    setFormData({ ...formData, value: e.target.value });
                  }
                }}
                className="bg-gray-800 border-gray-700 text-white min-h-[120px] focus:border-blue-500"
                placeholder="Geben Sie den Inhalt für diesen Bereich ein..."
              />
            </div>

            <div>
              <Label htmlFor="content_description" className="text-gray-300">Beschreibung</Label>
              <Input
                id="content_description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                placeholder="Kurze Beschreibung dieses Inhalts..."
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleSave} className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                <Save size={16} className="mr-2" />
                Speichern
              </Button>
              <Button onClick={cancelEdit} variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                <X size={16} className="mr-2" />
                Abbrechen
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contents.map((content) => (
          <Card key={content.id} className="bg-gray-900/95 border-gray-800 backdrop-blur-sm hover:border-gray-700 transition-colors">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white text-sm font-mono">{content.key}</CardTitle>
                  <p className="text-gray-400 text-xs mt-1">{content.type}</p>
                  {content.description && (
                    <p className="text-gray-500 text-xs mt-1">{content.description}</p>
                  )}
                </div>
                <Button
                  onClick={() => startEdit(content)}
                  size="sm"
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  <Edit size={14} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-800/50 p-3 rounded text-gray-300 text-sm max-h-32 overflow-y-auto border border-gray-700">
                {typeof content.value === 'string' ? content.value : JSON.stringify(content.value, null, 2)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContentManager;
