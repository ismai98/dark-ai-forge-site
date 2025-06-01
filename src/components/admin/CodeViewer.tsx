
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText, Code, Save, FolderOpen } from 'lucide-react';

const CodeViewer = () => {
  const [selectedFile, setSelectedFile] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const commonFiles = [
    'src/App.tsx',
    'src/components/Hero.tsx',
    'src/components/Navigation.tsx',
    'src/components/Projects.tsx',
    'src/components/Skills.tsx',
    'src/pages/Index.tsx',
    'package.json',
    'tailwind.config.ts'
  ];

  const handleFileSelect = (fileName: string) => {
    setSelectedFile(fileName);
    // In einer echten Implementierung würden Sie hier den Dateiinhalt laden
    setFileContent(`// Inhalt von ${fileName}\n// Diese Funktion ist derzeit ein Demo-Platzhalter\n// In der Vollversion könnten Sie hier Code anzeigen und bearbeiten`);
    setIsEditing(false);
  };

  const handleSaveFile = () => {
    // In einer echten Implementierung würden Sie hier den Code speichern
    alert('Speichern würde in der Vollversion implementiert werden');
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Code Viewer</h2>
        <p className="text-gray-400">Betrachten und bearbeiten Sie den Website-Code</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Datei-Explorer */}
        <Card className="bg-gray-900/95 border-gray-800 backdrop-blur-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <FolderOpen size={20} className="mr-2" />
              Dateien
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {commonFiles.map((file) => (
                <Button
                  key={file}
                  onClick={() => handleFileSelect(file)}
                  variant={selectedFile === file ? "default" : "ghost"}
                  className={`w-full justify-start text-left font-mono text-sm ${
                    selectedFile === file 
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <FileText size={16} className="mr-2" />
                  {file}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Code Editor */}
        <Card className="bg-gray-900/95 border-gray-800 backdrop-blur-sm lg:col-span-3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white flex items-center">
                <Code size={20} className="mr-2" />
                {selectedFile || 'Keine Datei ausgewählt'}
              </CardTitle>
              {selectedFile && (
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    {isEditing ? 'Ansicht' : 'Bearbeiten'}
                  </Button>
                  {isEditing && (
                    <Button
                      onClick={handleSaveFile}
                      size="sm"
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    >
                      <Save size={16} className="mr-2" />
                      Speichern
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedFile ? (
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300">Dateipfad</Label>
                  <Input
                    value={selectedFile}
                    readOnly
                    className="bg-gray-800 border-gray-700 text-gray-400 font-mono"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Code</Label>
                  <Textarea
                    value={fileContent}
                    onChange={(e) => setFileContent(e.target.value)}
                    readOnly={!isEditing}
                    className={`bg-gray-800 border-gray-700 text-white font-mono min-h-[400px] text-sm leading-6 ${
                      isEditing ? 'focus:border-blue-500' : 'cursor-default'
                    }`}
                    placeholder="Wählen Sie eine Datei aus dem Explorer aus..."
                  />
                </div>
                {isEditing && (
                  <div className="bg-yellow-900/20 border border-yellow-800 p-3 rounded-lg">
                    <p className="text-yellow-400 text-sm">
                      <strong>Hinweis:</strong> Diese Code-Editor-Funktion ist ein Demo-Platzhalter. 
                      In einer Vollversion würde hier eine echte Code-Bearbeitung mit Syntax-Highlighting implementiert werden.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 text-gray-500">
                <div className="text-center">
                  <Code size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Wählen Sie eine Datei aus dem Explorer aus, um sie anzuzeigen</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-blue-900/20 border-blue-800 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div>
              <h3 className="text-blue-400 font-medium mb-1">Code Viewer Information</h3>
              <p className="text-blue-300 text-sm">
                Diese Code-Viewer-Funktion ist derzeit ein Demo-Platzhalter für das Admin-Dashboard. 
                In einer vollständigen Implementierung würde hier ein echter Code-Editor mit Features wie 
                Syntax-Highlighting, Auto-Completion und direkter Datei-Bearbeitung integriert werden.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeViewer;
