
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Save, X, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  date_issued: string;
  credential_url?: string;
  image_url?: string;
}

const CertificationsManager = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const emptyCert: Omit<Certification, 'id'> = {
    title: '',
    issuer: '',
    date_issued: '',
    credential_url: '',
    image_url: ''
  };

  const [formData, setFormData] = useState(emptyCert);

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .order('date_issued', { ascending: false });

      if (error) throw error;
      setCertifications(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch certifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingCert) {
        const { error } = await supabase
          .from('certifications')
          .update(formData)
          .eq('id', editingCert.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Certification updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('certifications')
          .insert([formData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Certification created successfully",
        });
      }

      setEditingCert(null);
      setIsCreating(false);
      setFormData(emptyCert);
      fetchCertifications();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save certification",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certification?')) return;

    try {
      const { error } = await supabase
        .from('certifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Certification deleted successfully",
      });
      fetchCertifications();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete certification",
        variant: "destructive",
      });
    }
  };

  const startEdit = (cert: Certification) => {
    setEditingCert(cert);
    setFormData({
      title: cert.title,
      issuer: cert.issuer,
      date_issued: cert.date_issued,
      credential_url: cert.credential_url || '',
      image_url: cert.image_url || ''
    });
    setIsCreating(false);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingCert(null);
    setFormData(emptyCert);
  };

  const cancelEdit = () => {
    setEditingCert(null);
    setIsCreating(false);
    setFormData(emptyCert);
  };

  if (loading) {
    return <div className="text-white">Loading certifications...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Certifications Management</h2>
        <Button onClick={startCreate} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={16} className="mr-2" />
          Add Certification
        </Button>
      </div>

      {(isCreating || editingCert) && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">
              {editingCert ? 'Edit Certification' : 'Create New Certification'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-gray-300">Certification Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div>
              <Label htmlFor="issuer" className="text-gray-300">Issuer</Label>
              <Input
                id="issuer"
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div>
              <Label htmlFor="date_issued" className="text-gray-300">Date Issued</Label>
              <Input
                id="date_issued"
                type="date"
                value={formData.date_issued}
                onChange={(e) => setFormData({ ...formData, date_issued: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div>
              <Label htmlFor="credential_url" className="text-gray-300">Credential URL</Label>
              <Input
                id="credential_url"
                value={formData.credential_url}
                onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert) => (
          <Card key={cert.id} className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <Award className="text-yellow-400" size={20} />
                  <CardTitle className="text-white text-sm">{cert.title}</CardTitle>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => startEdit(cert)}
                    size="sm"
                    variant="outline"
                    className="border-gray-700"
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    onClick={() => handleDelete(cert.id)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm mb-2">{cert.issuer}</p>
              <p className="text-gray-400 text-xs mb-3">
                {cert.date_issued ? new Date(cert.date_issued).toLocaleDateString() : 'No date'}
              </p>
              {cert.credential_url && (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 text-xs hover:underline"
                >
                  View Credential
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CertificationsManager;
