
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  status: string;
  github_url?: string;
  live_url?: string;
  image_url?: string;
}

interface ProjectFormData {
  title: string;
  description: string;
  technologies: string[] | string;
  status: string;
  github_url: string;
  live_url: string;
  image_url: string;
}

const ProjectsManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const emptyProject: ProjectFormData = {
    title: '',
    description: '',
    technologies: [],
    status: 'Aktiv',
    github_url: '',
    live_url: '',
    image_url: ''
  };

  const [formData, setFormData] = useState<ProjectFormData>(emptyProject);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Projekte konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const techArray = Array.isArray(formData.technologies) 
        ? formData.technologies
        : formData.technologies.split(',').map(t => t.trim()).filter(Boolean);

      const projectData = {
        title: formData.title,
        description: formData.description,
        technologies: techArray,
        status: formData.status,
        github_url: formData.github_url,
        live_url: formData.live_url,
        image_url: formData.image_url
      };

      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id);

        if (error) throw error;
        toast({
          title: "Erfolg",
          description: "Projekt erfolgreich aktualisiert",
        });
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);

        if (error) throw error;
        toast({
          title: "Erfolg",
          description: "Projekt erfolgreich erstellt",
        });
      }

      setEditingProject(null);
      setIsCreating(false);
      setFormData(emptyProject);
      fetchProjects();
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Projekt konnte nicht gespeichert werden",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sind Sie sicher, dass Sie dieses Projekt löschen möchten?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Erfolg",
        description: "Projekt erfolgreich gelöscht",
      });
      fetchProjects();
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Projekt konnte nicht gelöscht werden",
        variant: "destructive",
      });
    }
  };

  const startEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies,
      status: project.status,
      github_url: project.github_url || '',
      live_url: project.live_url || '',
      image_url: project.image_url || ''
    });
    setIsCreating(false);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingProject(null);
    setFormData(emptyProject);
  };

  const cancelEdit = () => {
    setEditingProject(null);
    setIsCreating(false);
    setFormData(emptyProject);
  };

  if (loading) {
    return <div className="text-white">Lade Projekte...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Projekte verwalten</h2>
          <p className="text-gray-400">Hinzufügen, bearbeiten und verwalten Sie Ihre Projekte</p>
        </div>
        <Button onClick={startCreate} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus size={16} className="mr-2" />
          Projekt hinzufügen
        </Button>
      </div>

      {(isCreating || editingProject) && (
        <Card className="bg-gray-900/95 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">
              {editingProject ? 'Projekt bearbeiten' : 'Neues Projekt erstellen'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-gray-300">Titel</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                placeholder="Projektname"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-gray-300">Beschreibung</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                placeholder="Projektbeschreibung"
              />
            </div>

            <div>
              <Label htmlFor="technologies" className="text-gray-300">Technologien (durch Komma getrennt)</Label>
              <Input
                id="technologies"
                value={Array.isArray(formData.technologies) ? formData.technologies.join(', ') : formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                placeholder="React, TypeScript, Node.js"
              />
            </div>

            <div>
              <Label htmlFor="status" className="text-gray-300">Status</Label>
              <Input
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                placeholder="Aktiv, Abgeschlossen, In Entwicklung"
              />
            </div>

            <div>
              <Label htmlFor="github_url" className="text-gray-300">GitHub URL</Label>
              <Input
                id="github_url"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                placeholder="https://github.com/username/repo"
              />
            </div>

            <div>
              <Label htmlFor="live_url" className="text-gray-300">Live URL</Label>
              <Input
                id="live_url"
                value={formData.live_url}
                onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                placeholder="https://projekt.beispiel.de"
              />
            </div>

            <div>
              <Label htmlFor="image_url" className="text-gray-300">Bild URL</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                placeholder="https://beispiel.de/bild.jpg"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="bg-gray-900/95 border-gray-800 backdrop-blur-sm hover:border-gray-700 transition-colors">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-white">{project.title}</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => startEdit(project)}
                    size="sm"
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    onClick={() => handleDelete(project.id)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {project.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="bg-gray-800 text-gray-300">
                    {tech}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600">{project.status}</Badge>
                <div className="text-xs text-gray-500">
                  {project.github_url && 'GitHub'} {project.live_url && 'Live'}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectsManager;
