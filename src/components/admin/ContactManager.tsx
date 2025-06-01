
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Mail, Linkedin, Github, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContactInfo {
  id: string;
  email?: string;
  linkedin_url?: string;
  github_url?: string;
  phone?: string;
  location?: string;
}

const ContactManager = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    linkedin_url: '',
    github_url: '',
    phone: '',
    location: ''
  });

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setContactInfo(data);
        setFormData({
          email: data.email || '',
          linkedin_url: data.linkedin_url || '',
          github_url: data.github_url || '',
          phone: data.phone || '',
          location: data.location || ''
        });
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Kontaktinformationen konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (contactInfo) {
        const { error } = await supabase
          .from('contact_info')
          .update(formData)
          .eq('id', contactInfo.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('contact_info')
          .insert([formData]);

        if (error) throw error;
      }

      toast({
        title: "Erfolg",
        description: "Kontaktinformationen erfolgreich gespeichert",
      });
      
      fetchContactInfo();
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Kontaktinformationen konnten nicht gespeichert werden",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-white">Lade Kontaktinformationen...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Kontaktinformationen verwalten</h2>
        <p className="text-gray-400">Bearbeiten Sie Ihre Kontaktdaten</p>
      </div>

      <Card className="bg-gray-900/95 border-gray-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Kontaktinformationen bearbeiten</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="text-gray-300 flex items-center">
                <Mail size={16} className="mr-2" />
                E-Mail
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                placeholder="ihre@email.de"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-gray-300 flex items-center">
                <Phone size={16} className="mr-2" />
                Telefon
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                placeholder="+49 123 456 7890"
              />
            </div>

            <div>
              <Label htmlFor="linkedin_url" className="text-gray-300 flex items-center">
                <Linkedin size={16} className="mr-2" />
                LinkedIn URL
              </Label>
              <Input
                id="linkedin_url"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                placeholder="https://linkedin.com/in/benutzername"
              />
            </div>

            <div>
              <Label htmlFor="github_url" className="text-gray-300 flex items-center">
                <Github size={16} className="mr-2" />
                GitHub URL
              </Label>
              <Input
                id="github_url"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                placeholder="https://github.com/benutzername"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="location" className="text-gray-300 flex items-center">
                <MapPin size={16} className="mr-2" />
                Standort
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                placeholder="Deutschland"
              />
            </div>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              <Save size={16} className="mr-2" />
              {saving ? 'Speichere...' : 'Kontaktinformationen speichern'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {contactInfo && (
        <Card className="bg-gray-900/95 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Aktuelle Kontaktinformationen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-gray-300">
                <Mail size={16} className="mr-2 text-blue-400" />
                <span>{contactInfo.email || 'Nicht gesetzt'}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone size={16} className="mr-2 text-blue-400" />
                <span>{contactInfo.phone || 'Nicht gesetzt'}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Linkedin size={16} className="mr-2 text-blue-400" />
                <span>{contactInfo.linkedin_url || 'Nicht gesetzt'}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Github size={16} className="mr-2 text-blue-400" />
                <span>{contactInfo.github_url || 'Nicht gesetzt'}</span>
              </div>
              <div className="flex items-center text-gray-300 md:col-span-2">
                <MapPin size={16} className="mr-2 text-blue-400" />
                <span>{contactInfo.location || 'Nicht gesetzt'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContactManager;
