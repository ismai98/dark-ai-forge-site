
import { ExternalLink, Github } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Projects = () => {
  const projects = [
    {
      title: "Infrastructure Automation",
      description: "Vollautomatisierte Deployment-Pipeline mit Docker, Kubernetes und Terraform für skalierbare Microservices-Architektur",
      tech: ["Docker", "Kubernetes", "Terraform", "Python"],
      status: "Production",
      color: "blue"
    },
    {
      title: "Monitoring Dashboard",
      description: "Umfassendes System-Monitoring mit Real-time Alerts, Performance-Metriken und automatischer Incident-Response",
      tech: ["Grafana", "Prometheus", "Node.js", "React"],
      status: "Completed",
      color: "emerald"
    },
    {
      title: "CI/CD Pipeline",
      description: "Hochperformante Continuous Integration und Deployment-Workflows mit automatisierten Tests und Security-Scans",
      tech: ["Jenkins", "GitHub Actions", "Ansible", "SonarQube"],
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
    <section id="projects" className="py-20 px-4 bg-gray-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Projekte
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Innovative IT-Lösungen für moderne Infrastructure und Automation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card 
              key={index} 
              className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-300 hover:scale-105 group"
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
                      className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs border border-gray-700 code-font"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                    <Github size={14} className="mr-1" />
                    Code
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                    <ExternalLink size={14} className="mr-1" />
                    Live
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
