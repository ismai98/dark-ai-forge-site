
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  icon?: string;
}

const SkillsManager = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const emptySkill: Omit<Skill, 'id'> = {
    name: '',
    category: '',
    level: 1,
    icon: ''
  };

  const [formData, setFormData] = useState(emptySkill);

  const categories = [
    'Infrastructure',
    'Programmierung', 
    'Automation',
    'Datenbanken',
    'Cloud',
    'Sicherheit',
    'Tools'
  ];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Skills konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingSkill) {
        const { error } = await supabase
          .from('skills')
          .update(formData)
          .eq('id', editingSkill.id);

        if (error) throw error;
        toast({
          title: "Erfolg",
          description: "Skill erfolgreich aktualisiert",
        });
      } else {
        const { error } = await supabase
          .from('skills')
          .insert([formData]);

        if (error) throw error;
        toast({
          title: "Erfolg",
          description: "Skill erfolgreich erstellt",
        });
      }

      setEditingSkill(null);
      setIsCreating(false);
      setFormData(emptySkill);
      fetchSkills();
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Skill konnte nicht gespeichert werden",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sind Sie sicher, dass Sie diesen Skill löschen möchten?')) return;

    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Erfolg",
        description: "Skill erfolgreich gelöscht",
      });
      fetchSkills();
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Skill konnte nicht gelöscht werden",
        variant: "destructive",
      });
    }
  };

  const startEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      icon: skill.icon || ''
    });
    setIsCreating(false);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingSkill(null);
    setFormData(emptySkill);
  };

  const cancelEdit = () => {
    setEditingSkill(null);
    setIsCreating(false);
    setFormData(emptySkill);
  };

  if (loading) {
    return <div className="text-white">Lade Skills...</div>;
  }

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Skills verwalten</h2>
          <p className="text-gray-400">Hinzufügen, bearbeiten und verwalten Sie Ihre Fähigkeiten</p>
        </div>
        <Button onClick={startCreate} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus size={16} className="mr-2" />
          Skill hinzufügen
        </Button>
      </div>

      {(isCreating || editingSkill) && (
        <Card className="bg-gray-900/95 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">
              {editingSkill ? 'Skill bearbeiten' : 'Neuen Skill erstellen'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-300">Skill Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                placeholder="z.B. Docker, JavaScript, AWS"
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-gray-300">Kategorie</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:border-blue-500">
                  <SelectValue placeholder="Kategorie auswählen" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="text-white hover:bg-gray-700">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="level" className="text-gray-300">Level (1-5)</Label>
              <Select value={formData.level.toString()} onValueChange={(value) => setFormData({ ...formData, level: parseInt(value) })}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:border-blue-500">
                  <SelectValue placeholder="Level auswählen" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <SelectItem key={level} value={level.toString()} className="text-white hover:bg-gray-700">
                      {level} - {level === 1 ? 'Anfänger' : level === 2 ? 'Grundlagen' : level === 3 ? 'Fortgeschritten' : level === 4 ? 'Erfahren' : 'Experte'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="icon" className="text-gray-300">Icon (optional)</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                placeholder="Icon Name oder URL"
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

      <div className="space-y-6">
        {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
          <Card key={category} className="bg-gray-900/95 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySkills.map((skill) => (
                  <div key={skill.id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-medium">{skill.name}</h3>
                      <div className="flex space-x-1">
                        <Button
                          onClick={() => startEdit(skill)}
                          size="sm"
                          variant="outline"
                          className="border-gray-700 h-8 w-8 p-0 hover:bg-gray-700"
                        >
                          <Edit size={12} />
                        </Button>
                        <Button
                          onClick={() => handleDelete(skill.id)}
                          size="sm"
                          variant="destructive"
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < skill.level ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-400 text-sm">Level {skill.level}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SkillsManager;
