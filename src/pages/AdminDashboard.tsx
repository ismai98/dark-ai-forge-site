
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, Code, FileText, Users, Briefcase, Award, Zap, Mail, Shield, Eye, Palette, Layout, Activity, Globe, Image, Monitor } from 'lucide-react';
import ProjectsManager from '@/components/admin/ProjectsManager';
import SkillsManager from '@/components/admin/SkillsManager';
import CertificationsManager from '@/components/admin/CertificationsManager';
import AutomationManager from '@/components/admin/AutomationManager';
import ContactManager from '@/components/admin/ContactManager';
import AdvancedVisualEditor from '@/components/admin/AdvancedVisualEditor';
import ThemeCustomizer from '@/components/admin/ThemeCustomizer';
import LivePreview from '@/components/admin/LivePreview';
import LiveChangesLog from '@/components/admin/LiveChangesLog';
import MediaManager from '@/components/admin/MediaManager';
import LiveWebsiteSync from '@/components/admin/LiveWebsiteSync';
import WebsiteConfigManager from '@/components/admin/WebsiteConfigManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates';

const AdminDashboard = () => {
  const { user, isAdmin, signOut, loading } = useAuth();
  const [previewVisible, setPreviewVisible] = useState(true);
  const [activeTab, setActiveTab] = useState('visual-editor');
  
  // Aktiviere Realtime-Updates
  useRealtimeUpdates();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-950 to-purple-900/20"></div>
        <div className="text-white relative z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Lade professionelles Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-950 to-purple-900/20"></div>
        <Card className="bg-gray-900/95 border-gray-800 backdrop-blur-sm relative z-10">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">Zugriff verweigert</h1>
            <p className="text-gray-400 mb-4">Sie haben keine Administrator-Berechtigung.</p>
            <Button 
              onClick={signOut} 
              variant="outline" 
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Abmelden
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-gray-950 to-purple-900/10"></div>
      
      {/* Professional Header */}
      <header className="bg-gray-900/98 border-b border-gray-800 px-6 py-4 backdrop-blur-sm relative z-10 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <Settings className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Professional CMS Dashboard</h1>
              <p className="text-gray-400 text-sm">Vollprofessionelle Website-Verwaltung mit Live-Synchronisation</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setPreviewVisible(!previewVisible)}
              variant="outline"
              size="sm"
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <Eye size={16} className="mr-2" />
              {previewVisible ? 'Preview ausblenden' : 'Preview anzeigen'}
            </Button>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Administrator</p>
              <p className="text-white text-sm font-medium">{user.email}</p>
            </div>
            <Button
              onClick={signOut}
              variant="outline"
              size="sm"
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <LogOut size={16} className="mr-2" />
              Abmelden
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)] relative z-10">
        {/* Main Dashboard */}
        <div className={`${previewVisible ? 'w-2/3' : 'w-full'} p-6 overflow-y-auto transition-all duration-300`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-11 bg-gray-900/95 border border-gray-800 backdrop-blur-sm h-12">
              <TabsTrigger 
                value="visual-editor" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-xs"
              >
                <Layout size={14} className="mr-1" />
                Visual Editor
              </TabsTrigger>
              <TabsTrigger 
                value="sync" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-xs"
              >
                <Monitor size={14} className="mr-1" />
                Live Sync
              </TabsTrigger>
              <TabsTrigger 
                value="config" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-xs"
              >
                <Globe size={14} className="mr-1" />
                Website Config
              </TabsTrigger>
              <TabsTrigger 
                value="media" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-xs"
              >
                <Image size={14} className="mr-1" />
                Medien
              </TabsTrigger>
              <TabsTrigger 
                value="theme" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-xs"
              >
                <Palette size={14} className="mr-1" />
                Theme
              </TabsTrigger>
              <TabsTrigger 
                value="projects" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-xs"
              >
                <Briefcase size={14} className="mr-1" />
                Projekte
              </TabsTrigger>
              <TabsTrigger 
                value="skills" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-xs"
              >
                <Code size={14} className="mr-1" />
                Skills
              </TabsTrigger>
              <TabsTrigger 
                value="certifications" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-xs"
              >
                <Award size={14} className="mr-1" />
                Zertifikate
              </TabsTrigger>
              <TabsTrigger 
                value="automation" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-xs"
              >
                <Zap size={14} className="mr-1" />
                Automation
              </TabsTrigger>
              <TabsTrigger 
                value="contact" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-xs"
              >
                <Mail size={14} className="mr-1" />
                Kontakt
              </TabsTrigger>
              <TabsTrigger 
                value="activity" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-xs"
              >
                <Activity size={14} className="mr-1" />
                Aktivität
              </TabsTrigger>
            </TabsList>

            <TabsContent value="visual-editor">
              <AdvancedVisualEditor />
            </TabsContent>

            <TabsContent value="sync">
              <LiveWebsiteSync />
            </TabsContent>

            <TabsContent value="config">
              <WebsiteConfigManager />
            </TabsContent>

            <TabsContent value="media">
              <MediaManager />
            </TabsContent>

            <TabsContent value="theme">
              <ThemeCustomizer />
            </TabsContent>

            <TabsContent value="projects">
              <ProjectsManager />
            </TabsContent>

            <TabsContent value="skills">
              <SkillsManager />
            </TabsContent>

            <TabsContent value="certifications">
              <CertificationsManager />
            </TabsContent>

            <TabsContent value="automation">
              <AutomationManager />
            </TabsContent>

            <TabsContent value="contact">
              <ContactManager />
            </TabsContent>

            <TabsContent value="activity">
              <LiveChangesLog />
            </TabsContent>
          </Tabs>
        </div>

        {/* Live Preview Panel */}
        {previewVisible && (
          <div className="w-1/3 border-l border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <LivePreview 
              isVisible={previewVisible}
              onToggle={() => setPreviewVisible(!previewVisible)}
              previewUrl={window.location.origin}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
