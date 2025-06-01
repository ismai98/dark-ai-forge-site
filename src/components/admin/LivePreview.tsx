
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Monitor, Smartphone, Tablet } from 'lucide-react';

interface LivePreviewProps {
  isVisible: boolean;
  onToggle: () => void;
  previewUrl: string;
}

const LivePreview = ({ isVisible, onToggle, previewUrl }: LivePreviewProps) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const deviceStyles = {
    desktop: 'w-full h-full',
    tablet: 'w-[768px] h-[1024px] mx-auto',
    mobile: 'w-[375px] h-[667px] mx-auto'
  };

  return (
    <Card className="bg-gray-900/95 border-gray-800 backdrop-blur-sm h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Eye className="mr-2" size={20} />
            Live-Vorschau
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className="flex border border-gray-700 rounded-lg p-1">
              <Button
                size="sm"
                variant={device === 'desktop' ? 'default' : 'ghost'}
                onClick={() => setDevice('desktop')}
                className="px-2 py-1 h-8"
              >
                <Monitor size={16} />
              </Button>
              <Button
                size="sm"
                variant={device === 'tablet' ? 'default' : 'ghost'}
                onClick={() => setDevice('tablet')}
                className="px-2 py-1 h-8"
              >
                <Tablet size={16} />
              </Button>
              <Button
                size="sm"
                variant={device === 'mobile' ? 'default' : 'ghost'}
                onClick={() => setDevice('mobile')}
                className="px-2 py-1 h-8"
              >
                <Smartphone size={16} />
              </Button>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={onToggle}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>
        </div>
      </CardHeader>
      {isVisible && (
        <CardContent className="p-4 h-[calc(100%-80px)]">
          <div className="bg-white rounded-lg overflow-hidden h-full">
            <iframe
              src={previewUrl}
              className={`${deviceStyles[device]} border-0 rounded-lg transition-all duration-300`}
              title="Live Preview"
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default LivePreview;
