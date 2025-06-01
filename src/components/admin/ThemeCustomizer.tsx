
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Palette, Type, Layout, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ThemeSetting {
  id: string;
  category: string;
  setting_key: string;
  setting_value: any;
}

const ThemeCustomizer = () => {
  const [themeSettings, setThemeSettings] = useState<ThemeSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchThemeSettings();
  }, []);

  const fetchThemeSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('theme_settings')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setThemeSettings(data || []);
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Theme-Einstellungen konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateThemeSetting = async (category: string, key: string, value: any) => {
    try {
      const { error } = await supabase
        .from('theme_settings')
        .upsert({
          category,
          setting_key: key,
          setting_value: value
        })
        .select();

      if (error) throw error;

      // Log the change for live updates
      await supabase
        .from('live_changes')
        .insert({
          change_type: 'style',
          target_type: 'theme',
          target_id: `${category}.${key}`,
          new_value: value
        });

      toast({
        title: "Erfolg",
        description: "Theme-Einstellung aktualisiert",
      });

      fetchThemeSettings();
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Theme-Einstellung konnte nicht gespeichert werden",
        variant: "destructive",
      });
    }
  };

  const getSettingsByCategory = (category: string) => {
    return themeSettings.filter(setting => setting.category === category);
  };

  const ColorPicker = ({ color, onChange }: { color: string; onChange: (color: string) => void }) => (
    <div className="flex items-center space-x-2">
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-8 rounded border border-gray-700 bg-gray-800"
      />
      <Input
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-800 border-gray-700 text-white focus:border-blue-500 font-mono"
        placeholder="#000000"
      />
    </div>
  );

  if (loading) {
    return <div className="text-white">Lade Theme-Customizer...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Theme-Customizer</h2>
        <p className="text-gray-400">Passen Sie das Design Ihrer Website in Echtzeit an</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Farben */}
        <Card className="bg-gray-900/95 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Palette className="mr-2" size={20} />
              Farben
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {getSettingsByCategory('colors').map((setting) => (
              <div key={setting.id} className="space-y-3">
                <Label className="text-gray-300 capitalize">{setting.setting_key}</Label>
                <div className="space-y-2">
                  {Object.entries(setting.setting_value).map(([shade, color]) => (
                    <div key={shade} className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm capitalize">{shade}</span>
                      <ColorPicker
                        color={color as string}
                        onChange={(newColor) => {
                          const newValue = { ...setting.setting_value, [shade]: newColor };
                          updateThemeSetting('colors', setting.setting_key, newValue);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Typografie */}
        <Card className="bg-gray-900/95 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Type className="mr-2" size={20} />
              Typografie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {getSettingsByCategory('typography').map((setting) => (
              <div key={setting.id} className="space-y-3">
                <Label className="text-gray-300 capitalize">{setting.setting_key}</Label>
                <div className="space-y-2">
                  {Object.entries(setting.setting_value).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <Label className="text-gray-400 text-sm capitalize">{key}</Label>
                      <Input
                        value={value as string}
                        onChange={(e) => {
                          const newValue = { ...setting.setting_value, [key]: e.target.value };
                          updateThemeSetting('typography', setting.setting_key, newValue);
                        }}
                        className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Layout */}
        <Card className="bg-gray-900/95 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Layout className="mr-2" size={20} />
              Layout
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {getSettingsByCategory('layout').map((setting) => (
              <div key={setting.id} className="space-y-3">
                <Label className="text-gray-300 capitalize">{setting.setting_key}</Label>
                <div className="space-y-2">
                  {Object.entries(setting.setting_value).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <Label className="text-gray-400 text-sm capitalize">{key}</Label>
                      <Input
                        value={value as string}
                        onChange={(e) => {
                          const newValue = { ...setting.setting_value, [key]: e.target.value };
                          updateThemeSetting('layout', setting.setting_key, newValue);
                        }}
                        className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Live Preview CSS */}
      <Card className="bg-gray-900/95 border-gray-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Live CSS Output</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-800/50 p-4 rounded border border-gray-700">
            <pre className="text-gray-300 text-sm overflow-x-auto">
              {`:root {\n${themeSettings.map(setting => 
                Object.entries(setting.setting_value).map(([key, value]) => 
                  `  --${setting.category}-${setting.setting_key}-${key}: ${value};`
                ).join('\n')
              ).join('\n')}\n}`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeCustomizer;
