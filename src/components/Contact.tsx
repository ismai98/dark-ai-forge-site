
import { Github, Mail, Linkedin, MessageCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Contact = () => {
  const contactMethods = [
    {
      icon: Github,
      title: "GitHub",
      description: "Projekte & Open Source Contributions",
      link: "https://github.com",
      handle: "@username"
    },
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
      description: "Professionelles Netzwerk & Karriere",
      link: "https://linkedin.com",
      handle: "in/system-engineer"
    }
  ];

  return (
    <section id="contact" className="py-20 px-4 bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Kontakt
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Interesse an Zusammenarbeit? Lass uns über dein nächstes Projekt sprechen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <Card 
                key={index}
                className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105 group cursor-pointer"
                onClick={() => window.open(method.link, '_blank')}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/20 border-2 border-blue-500/30 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <IconComponent className="text-blue-400" size={24} />
                  </div>
                  <h3 className="font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {method.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    {method.description}
                  </p>
                  <p className="text-gray-300 text-sm code-font">
                    {method.handle}
                  </p>
                  <ExternalLink className="text-gray-500 mx-auto mt-2 group-hover:text-blue-400 transition-colors" size={16} />
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <div className="bg-gray-800 border border-gray-700 p-8 rounded-lg">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Bereit für dein nächstes Projekt?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Von Infrastructure Automation bis hin zu komplexen DevOps-Pipelines - 
              lass uns gemeinsam innovative IT-Lösungen entwickeln.
            </p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition-all duration-200 hover:scale-105"
              size="lg"
            >
              <MessageCircle className="mr-2" size={20} />
              Projekt besprechen
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
