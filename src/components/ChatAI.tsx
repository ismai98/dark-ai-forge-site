
import { useState } from 'react';
import { Send, X, MessageCircle, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const ChatAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      content: 'Hallo! Ich bin dein KI-Assistent für IT-Fragen. Wie kann ich dir bei Infrastructure, Automation oder DevOps helfen?' 
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    
    // Simulate AI response (OpenPipe Integration wird hier später implementiert)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: 'Danke für deine Frage! Diese Funktionalität wird mit OpenPipe integriert.' 
      }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110"
        size="lg"
      >
        <MessageCircle size={24} />
      </Button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md h-[500px] bg-gray-900 border-gray-700 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center">
                <Bot className="text-blue-400 mr-2" size={20} />
                <h3 className="font-semibold text-white">AI Assistant</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <X size={20} />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 border border-gray-700 text-gray-100'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Frage zur IT-Infrastructure..."
                  className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button
                  onClick={handleSend}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default ChatAI;
