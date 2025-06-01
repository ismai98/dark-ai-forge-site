
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Globe, Palette, Mail, Share2 } from 'lucide-react';
import { useWebsiteConfig } from '@/hooks/useWebsiteConfig';
import { useToast } from '@/hooks/use-toast';
import InlineEditor from './InlineEditor';

const WebsiteConfigManager = () => {
  const { config, loading, updateConfig } = useWebsiteConfig();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('general');

  const handleConfigUpdate = async (key: string, value: any) => {
    await updateConfig(key, value);
  };

  if (loading) {
    return <div className="text-white">Lade Website-Konfiguration...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Website-Konfiguration</h2>
          <p className="text-gray-400">Verwalten Sie globale Website-Einstellungen und -Inhalte</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <Card className="bg-gray-900/95 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-sm">Kategorien</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { id: 'general', label: 'Allgemein', icon: Globe },
                { id: 'branding', label: 'Branding', icon: Palette },
                { id: 'contact', label: 'Kontakt', icon: Mail },
                { id: 'social', label: 'Social Media', icon: Share2 }
              ].map(({ id, label, icon: Icon }) => (
                <Button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  variant={activeTab === id ? "default" : "ghost"}
                  className={`w-full justify-start ${activeTab === id ? 'bg-blue-600' : 'text-gray-300 hover:bg-gray-800'}`}
                >
                  <Icon size={16} className="mr-2" />
                  {label}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'general' && (
            <Card className="bg-gray-900/95 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Allgemeine Einstellungen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-gray-300 text-sm">Website-Titel</Label>
                  <InlineEditor
                    value={config.site_title || ''}
                    onSave={(value) => handleConfigUpdate('site_title', value)}
                    placeholder="Website-Titel eingeben..."
                  />
                </div>

                <div>
                  <Label className="text-gray-300 text-sm">Website-Beschreibung</Label>
                  <InlineEditor
                    value={config.site_description || ''}
                    onSave={(value) => handleConfigUpdate('site_description', value)}
                    type="textarea"
                    placeholder="Website-Beschreibung eingeben..."
                  />
                </div>

                <div>
                  <Label className="text-gray-300 text-sm">Hero-Titel</Label>
                  <InlineEditor
                    value={config.hero_title || ''}
                    onSave={(value) => handleConfigUpdate('hero_title', value)}
                    placeholder="Hero-Titel eingeben..."
                  />
                </div>

                <div>
                  <Label className="text-gray-300 text-sm">Hero-Untertitel</Label>
                  <InlineEditor
                    value={config.hero_subtitle || ''}
                    onSave={(value) => handleConfigUpdate('hero_subtitle', value)}
                    type="textarea"
                    placeholder="Hero-Untertitel eingeben..."
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'branding' && (
            <Card className="bg-gray-900/95 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Branding & Design</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300 text-sm">Primärfarbe</Label>
                    <Input
                      type="color"
                      value={config.site_branding?.colors?.primary || '#3B82F6'}
                      onChange={(e) => {
                        const branding = config.site_branding || { colors: {} };
                        branding.colors = { ...branding.colors, primary: e.target.value };
                        handleConfigUpdate('site_branding', branding);
                      }}
                      className="bg-gray-800 border-gray-700 h-12"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 text-sm">Sekundärfarbe</Label>
                    <Input
                      type="color"
                      value={config.site_branding?.colors?.secondary || '#8B5CF6'}
                      onChange={(e) => {
                        const branding = config.site_branding || { colors: {} };
                        branding.colors = { ...branding.colors, secondary: e.target.value };
                        handleConfigUpdate('site_branding', branding);
                      }}
                      className="bg-gray-800 border-gray-700 h-12"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300 text-sm">Logo URL</Label>
                  <InlineEditor
                    value={config.site_branding?.logo || ''}
                    onSave={(value) => {
                      const branding = config.site_branding || {};
                      branding.logo = value;
                      handleConfigUpdate('site_branding', branding);
                    }}
                    placeholder="Logo URL eingeben..."
                  />
                </div>

                <div>
                  <Label className="text-gray-300 text-sm">Favicon URL</Label>
                  <InlineEditor
                    value={config.site_branding?.favicon || ''}
                    onSave={(value) => {
                      const branding = config.site_branding || {};
                      branding.favicon = value;
                      handleConfigUpdate('site_branding', branding);
                    }}
                    placeholder="Favicon URL eingeben..."
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'contact' && (
            <Card className="bg-gray-900/95 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Kontaktinformationen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-gray-300 text-sm">E-Mail-Adresse</Label>
                  <InlineEditor
                    value={config.contact_email || ''}
                    onSave={(value) => handleConfigUpdate('contact_email', value)}
                    placeholder="E-Mail-Adresse eingeben..."
                  />
                </div>

                <div>
                  <Label className="text-gray-300 text-sm">Telefonnummer</Label>
                  <InlineEditor
                    value={config.contact_phone || ''}
                    onSave={(value) => handleConfigUpdate('contact_phone', value)}
                    placeholder="Telefonnummer eingeben..."
                  />
                </div>

                <div>
                  <Label className="text-gray-300 text-sm">Adresse</Label>
                  <InlineEditor
                    value={config.contact_address || ''}
                    onSave={(value) => handleConfigUpdate('contact_address', value)}
                    type="textarea"
                    placeholder="Adresse eingeben..."
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'social' && (
            <Card className="bg-gray-900/95 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Social Media Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-gray-300 text-sm">GitHub</Label>
                  <InlineEditor
                    value={config.social_links?.github || ''}
                    onSave={(value) => {
                      const socialLinks = config.social_links || {};
                      socialLinks.github = value;
                      handleConfigUpdate('social_links', socialLinks);
                    }}
                    placeholder="GitHub URL eingeben..."
                  />
                </div>

                <div>
                  <Label className="text-gray-300 text-sm">LinkedIn</Label>
                  <InlineEditor
                    value={config.social_links?.linkedin || ''}
                    onSave={(value) => {
                      const socialLinks = config.social_links || {};
                      socialLinks.linkedin = value;
                      handleConfigUpdate('social_links', socialLinks);
                    }}
                    placeholder="LinkedIn URL eingeben..."
                  />
                </div>

                <div>
                  <Label className="text-gray-300 text-sm">Twitter/X</Label>
                  <InlineEditor
                    value={config.social_links?.twitter || ''}
                    onSave={(value) => {
                      const socialLinks = config.social_links || {};
                      socialLinks.twitter = value;
                      handleConfigUpdate('social_links', socialLinks);
                    }}
                    placeholder="Twitter URL eingeben..."
                  />
                </div>

                <div>
                  <Label className="text-gray-300 text-sm">Instagram</Label>
                  <InlineEditor
                    value={config.social_links?.instagram || ''}
                    onSave={(value) => {
                      const socialLinks = config.social_links || {};
                      socialLinks.instagram = value;
                      handleConfigUpdate('social_links', socialLinks);
                    }}
                    placeholder="Instagram URL eingeben..."
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebsiteConfigManager;
