
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Edit3, Save, Plus, Trash2, Move, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContentSection {
  id: string;
  page_id: string;
  section_type: string;
  section_order: number;
  title: string | null;
  content: any;
  styles: any;
  is_visible: boolean;
}

const VisualEditor = () => {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [editingSection, setEditingSection] = useState<ContentSection | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const { data, error } = await supabase
        .from('page_sections')
        .select('*')
        .order('section_order', { ascending: true });

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Sektionen konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSection = async (section: ContentSection) => {
    try {
      const { error } = await supabase
        .from('page_sections')
        .upsert(section)
        .select();

      if (error) throw error;

      // Log the change for live updates - convert to JSON-serializable format
      const sectionForLog = {
        id: section.id,
        page_id: section.page_id,
        section_type: section.section_type,
        section_order: section.section_order,
        title: section.title,
        content: section.content,
        styles: section.styles,
        is_visible: section.is_visible
      };

      await supabase
        .from('live_changes')
        .insert({
          change_type: 'content',
          target_type: 'page_section',
          target_id: section.id,
          new_value: sectionForLog as any
        });

      toast({
        title: "Erfolg",
        description: "Sektion erfolgreich gespeichert",
      });

      setEditingSection(null);
      fetchSections();
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Sektion konnte nicht gespeichert werden",
        variant: "destructive",
      });
    }
  };

  const addNewSection = () => {
    const newSection: ContentSection = {
      id: crypto.randomUUID(),
      page_id: 'home',
      section_type: 'custom',
      section_order: sections.length + 1,
      title: 'Neue Sektion',
      content: { text: 'Neuer Inhalt hier...' },
      styles: { padding: '40px 0', textAlign: 'center' },
      is_visible: true
    };
    setEditingSection(newSection);
  };

  const deleteSection = async (id: string) => {
    if (!confirm('Sind Sie sicher, dass Sie diese Sektion löschen möchten?')) return;

    try {
      const { error } = await supabase
        .from('page_sections')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Erfolg",
        description: "Sektion erfolgreich gelöscht",
      });
      fetchSections();
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Sektion konnte nicht gelöscht werden",
        variant: "destructive",
      });
    }
  };

  const toggleVisibility = async (section: ContentSection) => {
    const updatedSection = { ...section, is_visible: !section.is_visible };
    await saveSection(updatedSection);
  };

  if (loading) {
    return <div className="text-white">Lade visuellen Editor...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Visueller Content-Editor</h2>
          <p className="text-gray-400">Bearbeiten Sie Ihre Website-Inhalte visuell und in Echtzeit</p>
        </div>
        <Button onClick={addNewSection} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus size={16} className="mr-2" />
          Neue Sektion
        </Button>
      </div>

      {editingSection && (
        <Card className="bg-gray-900/95 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Sektion bearbeiten</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-gray-300">Titel</Label>
                <Input
                  id="title"
                  value={editingSection.title || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="section_type" className="text-gray-300">Typ</Label>
                <select
                  id="section_type"
                  value={editingSection.section_type}
                  onChange={(e) => setEditingSection({ ...editingSection, section_type: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 focus:border-blue-500"
                >
                  <option value="hero">Hero</option>
                  <option value="projects">Projekte</option>
                  <option value="skills">Skills</option>
                  <option value="services">Services</option>
                  <option value="custom">Benutzerdefiniert</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="content" className="text-gray-300">Inhalt (JSON)</Label>
              <Textarea
                id="content"
                value={JSON.stringify(editingSection.content, null, 2)}
                onChange={(e) => {
                  try {
                    const content = JSON.parse(e.target.value);
                    setEditingSection({ ...editingSection, content });
                  } catch {}
                }}
                className="bg-gray-800 border-gray-700 text-white min-h-[120px] focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <Label htmlFor="styles" className="text-gray-300">Styles (JSON)</Label>
              <Textarea
                id="styles"
                value={JSON.stringify(editingSection.styles, null, 2)}
                onChange={(e) => {
                  try {
                    const styles = JSON.parse(e.target.value);
                    setEditingSection({ ...editingSection, styles });
                  } catch {}
                }}
                className="bg-gray-800 border-gray-700 text-white min-h-[80px] focus:border-blue-500 font-mono"
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={() => saveSection(editingSection)} className="bg-gradient-to-r from-green-600 to-green-700">
                <Save size={16} className="mr-2" />
                Speichern
              </Button>
              <Button onClick={() => setEditingSection(null)} variant="outline" className="border-gray-700 text-gray-300">
                Abbrechen
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {sections.map((section) => (
          <Card key={section.id} className={`bg-gray-900/95 border-gray-800 backdrop-blur-sm hover:border-gray-700 transition-colors ${!section.is_visible ? 'opacity-50' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <Move className="text-gray-500 cursor-move" size={16} />
                  <div>
                    <CardTitle className="text-white text-sm">{section.title || 'Unbenannte Sektion'}</CardTitle>
                    <p className="text-gray-400 text-xs">{section.section_type} - Order: {section.section_order}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleVisibility(section)}
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 px-2"
                  >
                    <Eye size={14} className={!section.is_visible ? 'opacity-50' : ''} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingSection(section)}
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 px-2"
                  >
                    <Edit3 size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteSection(section.id)}
                    className="px-2"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="bg-gray-800/50 p-3 rounded border border-gray-700">
                <pre className="text-gray-300 text-xs overflow-x-auto">
                  {JSON.stringify(section.content, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VisualEditor;
