
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AutomationContent {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  benefits: string[];
  image_url?: string;
}

interface AutomationFormData {
  title: string;
  description: string;
  technologies: string[] | string;
  benefits: string[] | string;
  image_url: string;
}

const AutomationManager = () => {
  const [automations, setAutomations] = useState<AutomationContent[]>([]);
  const [editingAutomation, setEditingAutomation] = useState<AutomationContent | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const emptyAutomation: AutomationFormData = {
    title: '',
    description: '',
    technologies: [],
    benefits: [],
    image_url: ''
  };

  const [formData, setFormData] = useState<AutomationFormData>(emptyAutomation);

  useEffect(() => {
    fetchAutomations();
  }, []);

  const fetchAutomations = async () => {
    try {
      const { data, error } = await supabase
        .from('automation_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAutomations(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch automation content",
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

      const benefitsArray = Array.isArray(formData.benefits) 
        ? formData.benefits
        : formData.benefits.split(',').map(b => b.trim()).filter(Boolean);

      const automationData = {
        title: formData.title,
        description: formData.description,
        technologies: techArray,
        benefits: benefitsArray,
        image_url: formData.image_url
      };

      if (editingAutomation) {
        const { error } = await supabase
          .from('automation_content')
          .update(automationData)
          .eq('id', editingAutomation.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Automation content updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('automation_content')
          .insert([automationData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Automation content created successfully",
        });
      }

      setEditingAutomation(null);
      setIsCreating(false);
      setFormData(emptyAutomation);
      fetchAutomations();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save automation content",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this automation content?')) return;

    try {
      const { error } = await supabase
        .from('automation_content')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Automation content deleted successfully",
      });
      fetchAutomations();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete automation content",
        variant: "destructive",
      });
    }
  };

  const startEdit = (automation: AutomationContent) => {
    setEditingAutomation(automation);
    setFormData({
      title: automation.title,
      description: automation.description,
      technologies: automation.technologies,
      benefits: automation.benefits,
      image_url: automation.image_url || ''
    });
    setIsCreating(false);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingAutomation(null);
    setFormData(emptyAutomation);
  };

  const cancelEdit = () => {
    setEditingAutomation(null);
    setIsCreating(false);
    setFormData(emptyAutomation);
  };

  if (loading) {
    return <div className="text-white">Loading automation content...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Automation Content Management</h2>
        <Button onClick={startCreate} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={16} className="mr-2" />
          Add Automation Content
        </Button>
      </div>

      {(isCreating || editingAutomation) && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">
              {editingAutomation ? 'Edit Automation Content' : 'Create New Automation Content'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-gray-300">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-gray-300">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div>
              <Label htmlFor="technologies" className="text-gray-300">Technologies (comma-separated)</Label>
              <Input
                id="technologies"
                value={Array.isArray(formData.technologies) ? formData.technologies.join(', ') : formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Docker, Kubernetes, Terraform"
              />
            </div>

            <div>
              <Label htmlFor="benefits" className="text-gray-300">Benefits (comma-separated)</Label>
              <Input
                id="benefits"
                value={Array.isArray(formData.benefits) ? formData.benefits.join(', ') : formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Zero-Downtime, Consistent Environments, Rollback Capability"
              />
            </div>

            <div>
              <Label htmlFor="image_url" className="text-gray-300">Image URL</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save size={16} className="mr-2" />
                Save
              </Button>
              <Button onClick={cancelEdit} variant="outline" className="border-gray-700">
                <X size={16} className="mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {automations.map((automation) => (
          <Card key={automation.id} className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <Zap className="text-purple-400" size={20} />
                  <CardTitle className="text-white">{automation.title}</CardTitle>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => startEdit(automation)}
                    size="sm"
                    variant="outline"
                    className="border-gray-700"
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    onClick={() => handleDelete(automation.id)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm mb-3">{automation.description}</p>
              
              <div className="mb-3">
                <h4 className="text-gray-400 text-xs mb-2">Technologies:</h4>
                <div className="flex flex-wrap gap-1">
                  {automation.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="bg-gray-800 text-gray-300 text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-gray-400 text-xs mb-2">Benefits:</h4>
                <div className="flex flex-wrap gap-1">
                  {automation.benefits.map((benefit, index) => (
                    <Badge key={index} variant="outline" className="border-blue-600 text-blue-400 text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AutomationManager;
