
import { Github, Mail, Linkedin, MessageCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Contact = () => {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      description: "Direkte Kommunikation für Projekte",
      link: "mailto:contact@example.com",
      handle: "contact@example.com"
    },
    {
      icon: Linkedin,
      title: "LinkedIn",
      description: "Professionelles Netzwerk",
      link: "https://linkedin.com",
      handle: "in/system-engineer"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Kontakt
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Interesse an Zusammenarbeit? Lass uns sprechen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 animate-slide-up">
          {contactMethods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <Card 
                key={index}
                className="bg-gray-900/50 border-gray-800 hover:border-gray-600 transition-all duration-300 hover:scale-105 hover:-translate-y-2 shadow-xl rounded-3xl group cursor-pointer"
                onClick={() => window.open(method.link, '_blank')}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-blue-500/20 border-2 border-blue-500/30 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <IconComponent className="text-blue-400" size={28} />
                  </div>
                  <h3 className="font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors text-xl">
                    {method.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    {method.description}
                  </p>
                  <p className="text-gray-300 text-sm code-font">
                    {method.handle}
                  </p>
                  <ExternalLink className="text-gray-500 mx-auto mt-3 group-hover:text-blue-400 transition-colors" size={18} />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* GitHub Section */}
        <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-3xl shadow-xl mb-12 animate-slide-up">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gray-800 border-2 border-gray-700 flex items-center justify-center">
              <Github className="text-gray-400" size={32} />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">
              GitHub
            </h3>
            <p className="text-gray-300 mb-6">
              Projekte & Open Source Contributions
            </p>
            <Button 
              className="bg-gray-800 hover:bg-gray-700 text-white font-medium px-6 py-3 rounded-full transition-all duration-200 hover:scale-105 border border-gray-700"
              onClick={() => window.open('https://github.com', '_blank')}
            >
              <Github className="mr-2" size={20} />
              @username
            </Button>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center animate-slide-up">
          <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-3xl shadow-xl">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Bereit für dein nächstes Projekt?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Von Infrastructure Automation bis hin zu DevOps-Pipelines - 
              lass uns innovative IT-Lösungen entwickeln.
            </p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-full transition-all duration-200 hover:scale-105 shadow-lg"
              size="lg"
            >
              <MessageCircle className="mr-2" size={20} />
              Projekt besprechen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
