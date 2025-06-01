
import { useState } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Chat = () => {
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
    
    // Simulate AI response (OpenPipe Integration später)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: 'Danke für deine Frage! Diese Funktionalität wird mit OpenPipe integriert.' 
      }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-blue-500/20 border-2 border-blue-500/30 flex items-center justify-center">
            <Sparkles className="text-blue-400" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Chat with AI
          </h1>
          <p className="text-gray-400 text-lg">
            Dein KI-Assistent für IT-Fragen und Automatisierung
          </p>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-3xl shadow-xl overflow-hidden animate-slide-up">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-xs ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-blue-500/20 border border-blue-500/30' 
                      : 'bg-gray-800 border border-gray-700'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="text-blue-400" size={18} />
                    ) : (
                      <Bot className="text-gray-400" size={18} />
                    )}
                  </div>
                  <div
                    className={`p-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 border border-gray-700 text-gray-100'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-6 border-t border-gray-800">
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Frage zur IT-Infrastructure..."
                className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 rounded-2xl"
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button
                onClick={handleSend}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6"
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
