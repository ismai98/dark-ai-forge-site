
import { ExternalLink, Github } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Projects = () => {
  const projects = [
    {
      title: "Infrastructure Automation",
      description: "Automatisierte Deployment-Pipeline für skalierbare Microservices",
      tech: ["Docker", "Kubernetes", "Terraform"],
      status: "Production",
      color: "blue"
    },
    {
      title: "Monitoring Dashboard",
      description: "System-Monitoring mit Real-time Alerts und Performance-Metriken",
      tech: ["Grafana", "Prometheus", "React"],
      status: "Completed",
      color: "emerald"
    },
    {
      title: "CI/CD Pipeline",
      description: "Automatisierte Integration und Deployment-Workflows",
      tech: ["Jenkins", "GitHub Actions", "Ansible"],
      status: "Active",
      color: "purple"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Production': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Active': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Meine Projekte
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Innovative IT-Lösungen für moderne Infrastructure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
          {projects.map((project, index) => (
            <Card 
              key={index} 
              className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 hover:scale-105 hover:-translate-y-2 shadow-xl rounded-3xl group"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-white group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </CardTitle>
                  <div className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(project.status)}`}>
                    {project.status}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech, techIndex) => (
                    <span 
                      key={techIndex}
                      className="px-3 py-1 bg-gray-800/50 text-gray-300 rounded-full text-xs border border-gray-700/50 code-font"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white rounded-full">
                    <Github size={14} className="mr-1" />
                    Code
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white rounded-full">
                    <ExternalLink size={14} className="mr-1" />
                    Live
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
