
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Save, Eye, Code, Palette, Layout, Undo, Redo, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useContentRevisions } from '@/hooks/useContentRevisions';
import InlineEditor from './InlineEditor';

interface ContentSection {
  id: string;
  page_id: string;
  section_type: string;
  section_order: number;
  title: string | null;
  content: any;
  styles: any;
  is_visible: boolean;
  meta_data: any;
  template_type: string | null;
}

const AdvancedVisualEditor = () => {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [editingSection, setEditingSection] = useState<ContentSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSections();
    
    // Real-time updates
    const channel = supabase
      .channel('sections-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'page_sections'
        },
        () => {
          fetchSections();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
        .upsert({
          ...section,
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;

      // Log für Live-Updates
      await supabase
        .from('live_changes')
        .insert({
          change_type: 'content_update',
          target_type: 'page_section',
          target_id: section.id,
          new_value: {
            id: section.id,
            page_id: section.page_id,
            section_type: section.section_type,
            section_order: section.section_order,
            title: section.title,
            content: section.content,
            styles: section.styles,
            is_visible: section.is_visible,
            meta_data: section.meta_data,
            template_type: section.template_type
          }
        });

      toast({
        title: "Erfolgreich gespeichert",
        description: "Sektion wurde erfolgreich aktualisiert",
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

  const duplicateSection = async (section: ContentSection) => {
    const newSection: ContentSection = {
      ...section,
      id: crypto.randomUUID(),
      section_order: sections.length + 1,
      title: `${section.title} (Kopie)`
    };
    await saveSection(newSection);
  };

  const moveSection = async (sectionId: string, direction: 'up' | 'down') => {
    const currentIndex = sections.findIndex(s => s.id === sectionId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const updatedSections = [...sections];
    [updatedSections[currentIndex], updatedSections[newIndex]] = [updatedSections[newIndex], updatedSections[currentIndex]];

    // Update section orders
    for (let i = 0; i < updatedSections.length; i++) {
      updatedSections[i].section_order = i + 1;
      await supabase
        .from('page_sections')
        .update({ section_order: i + 1 })
        .eq('id', updatedSections[i].id);
    }

    fetchSections();
  };

  const addNewSection = () => {
    const newSection: ContentSection = {
      id: crypto.randomUUID(),
      page_id: 'home',
      section_type: 'custom',
      section_order: sections.length + 1,
      title: 'Neue Sektion',
      content: { 
        text: 'Neuer Inhalt hier...',
        buttons: [],
        images: []
      },
      styles: { 
        padding: '60px 0',
        textAlign: 'center',
        backgroundColor: 'transparent',
        color: '#ffffff'
      },
      is_visible: true,
      meta_data: {},
      template_type: 'standard'
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
        title: "Erfolgreich gelöscht",
        description: "Sektion wurde erfolgreich entfernt",
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

  if (loading) {
    return <div className="text-white">Lade erweiterten Visual Editor...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Professioneller Visual Editor</h2>
          <p className="text-gray-400">Erstellen und bearbeiten Sie Ihre Website-Inhalte visuell und in Echtzeit</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => setPreviewMode(!previewMode)}
            variant="outline"
            className="border-gray-700 text-gray-300"
          >
            <Eye size={16} className="mr-2" />
            {previewMode ? 'Bearbeiten' : 'Vorschau'}
          </Button>
          <Button onClick={addNewSection} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus size={16} className="mr-2" />
            Neue Sektion
          </Button>
        </div>
      </div>

      {editingSection && (
        <Card className="bg-gray-900/95 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Sektion bearbeiten: {editingSection.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="content" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                <TabsTrigger value="content" className="data-[state=active]:bg-blue-600">
                  <Layout size={16} className="mr-2" />
                  Inhalt
                </TabsTrigger>
                <TabsTrigger value="styling" className="data-[state=active]:bg-blue-600">
                  <Palette size={16} className="mr-2" />
                  Design
                </TabsTrigger>
                <TabsTrigger value="advanced" className="data-[state=active]:bg-blue-600">
                  <Code size={16} className="mr-2" />
                  Erweitert
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-blue-600">
                  <Eye size={16} className="mr-2" />
                  Einstellungen
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
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
                      <option value="about">Über mich</option>
                      <option value="projects">Projekte</option>
                      <option value="skills">Skills</option>
                      <option value="services">Services</option>
                      <option value="contact">Kontakt</option>
                      <option value="custom">Benutzerdefiniert</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300">Haupttext</Label>
                  <Textarea
                    value={editingSection.content?.text || ''}
                    onChange={(e) => setEditingSection({ 
                      ...editingSection, 
                      content: { ...editingSection.content, text: e.target.value }
                    })}
                    className="bg-gray-800 border-gray-700 text-white min-h-[120px] focus:border-blue-500"
                    placeholder="Hauptinhalt der Sektion..."
                  />
                </div>
              </TabsContent>

              <TabsContent value="styling" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Hintergrundfarbe</Label>
                    <Input
                      type="color"
                      value={editingSection.styles?.backgroundColor || '#000000'}
                      onChange={(e) => setEditingSection({
                        ...editingSection,
                        styles: { ...editingSection.styles, backgroundColor: e.target.value }
                      })}
                      className="bg-gray-800 border-gray-700 h-12"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Textfarbe</Label>
                    <Input
                      type="color"
                      value={editingSection.styles?.color || '#ffffff'}
                      onChange={(e) => setEditingSection({
                        ...editingSection,
                        styles: { ...editingSection.styles, color: e.target.value }
                      })}
                      className="bg-gray-800 border-gray-700 h-12"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300">Innenabstand (Padding)</Label>
                  <Input
                    value={editingSection.styles?.padding || '60px 0'}
                    onChange={(e) => setEditingSection({
                      ...editingSection,
                      styles: { ...editingSection.styles, padding: e.target.value }
                    })}
                    className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                    placeholder="z.B. 60px 0"
                  />
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                <div>
                  <Label className="text-gray-300">JSON Content</Label>
                  <Textarea
                    value={JSON.stringify(editingSection.content, null, 2)}
                    onChange={(e) => {
                      try {
                        const content = JSON.parse(e.target.value);
                        setEditingSection({ ...editingSection, content });
                      } catch {}
                    }}
                    className="bg-gray-800 border-gray-700 text-white min-h-[200px] focus:border-blue-500 font-mono text-sm"
                  />
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_visible"
                    checked={editingSection.is_visible}
                    onChange={(e) => setEditingSection({ ...editingSection, is_visible: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="is_visible" className="text-gray-300">Sektion sichtbar</Label>
                </div>

                <div>
                  <Label className="text-gray-300">Template-Typ</Label>
                  <select
                    value={editingSection.template_type || 'standard'}
                    onChange={(e) => setEditingSection({ ...editingSection, template_type: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 focus:border-blue-500"
                  >
                    <option value="standard">Standard</option>
                    <option value="fullwidth">Vollbreite</option>
                    <option value="centered">Zentriert</option>
                    <option value="split">Geteilt</option>
                  </select>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex space-x-2 mt-6">
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

      <div className="space-y-4">
        {sections.map((section, index) => (
          <Card key={section.id} className={`bg-gray-900/95 border-gray-800 backdrop-blur-sm hover:border-gray-700 transition-colors ${!section.is_visible ? 'opacity-50' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col space-y-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveSection(section.id, 'up')}
                      disabled={index === 0}
                      className="border-gray-700 text-gray-300 hover:bg-gray-800 h-6 w-6 p-0"
                    >
                      <ArrowUp size={10} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveSection(section.id, 'down')}
                      disabled={index === sections.length - 1}
                      className="border-gray-700 text-gray-300 hover:bg-gray-800 h-6 w-6 p-0"
                    >
                      <ArrowDown size={10} />
                    </Button>
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">{section.title || 'Unbenannte Sektion'}</CardTitle>
                    <p className="text-gray-400 text-sm">{section.section_type} • Reihenfolge: {section.section_order} • Template: {section.template_type}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => duplicateSection(section)}
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    Duplizieren
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setEditingSection(section)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Bearbeiten
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteSection(section.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-800/50 p-4 rounded border border-gray-700">
                <div className="text-gray-300 text-sm space-y-2">
                  <div><strong>Inhalt:</strong> {section.content?.text || 'Kein Text vorhanden'}</div>
                  {section.content?.buttons && section.content.buttons.length > 0 && (
                    <div><strong>Buttons:</strong> {section.content.buttons.length} Button(s)</div>
                  )}
                  <div><strong>Styles:</strong> {JSON.stringify(section.styles, null, 1)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdvancedVisualEditor;
