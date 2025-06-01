
import { Server, Code2, Cog, Database, Cloud, Shield, Award } from 'lucide-react';

const Skills = () => {
  const skillCategories = [
    {
      icon: Server,
      title: "Infrastructure",
      skills: ["Linux", "Docker", "Kubernetes"],
      color: "blue"
    },
    {
      icon: Code2,
      title: "Programming",
      skills: ["Python", "JavaScript", "Bash"],
      color: "emerald"
    },
    {
      icon: Cog,
      title: "Automation",
      skills: ["Ansible", "Jenkins", "GitHub Actions"],
      color: "purple"
    },
    {
      icon: Database,
      title: "Databases",
      skills: ["PostgreSQL", "MongoDB", "Redis"],
      color: "cyan"
    },
    {
      icon: Cloud,
      title: "Cloud",
      skills: ["AWS", "Azure", "DigitalOcean"],
      color: "orange"
    },
    {
      icon: Shield,
      title: "Security",
      skills: ["SSL/TLS", "Firewall", "Monitoring"],
      color: "red"
    }
  ];

  const certificates = [
    {
      name: "AWS Cloud Practitioner",
      issuer: "Amazon Web Services",
      year: "2024",
      status: "In Progress"
    },
    {
      name: "Docker Certified Associate",
      issuer: "Docker Inc.",
      year: "2023",
      status: "Completed"
    },
    {
      name: "Linux Professional Institute",
      issuer: "LPI",
      year: "2023",
      status: "Completed"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "text-blue-400 bg-blue-500/20 border-blue-500/30",
      emerald: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30",
      purple: "text-purple-400 bg-purple-500/20 border-purple-500/30",
      cyan: "text-cyan-400 bg-cyan-500/20 border-cyan-500/30",
      orange: "text-orange-400 bg-orange-500/20 border-orange-500/30",
      red: "text-red-400 bg-red-500/20 border-red-500/30"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Technical Skills
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Expertise in modernen Technologien
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 animate-slide-up">
          {skillCategories.map((category, index) => {
            const IconComponent = category.icon;
            const colorClasses = getColorClasses(category.color);
            
            return (
              <div 
                key={index}
                className="bg-gray-900/50 border border-gray-800 p-8 rounded-3xl hover:border-gray-600 transition-all duration-300 hover:scale-105 hover:-translate-y-2 shadow-xl group"
              >
                <div className="flex items-center mb-6">
                  <div className={`p-4 rounded-2xl border ${colorClasses}`}>
                    <IconComponent size={24} />
                  </div>
                  <h3 className="ml-4 text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {category.title}
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {category.skills.map((skill, skillIndex) => (
                    <div 
                      key={skillIndex}
                      className="bg-gray-800/30 border border-gray-700/50 p-3 rounded-2xl text-gray-300 text-sm hover:bg-gray-800/50 hover:border-gray-600/50 transition-all duration-200 code-font"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Certificates Section */}
        <div className="animate-slide-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center">
              <Award className="mr-3 text-yellow-400" size={32} />
              Zertifikate
            </h2>
            <p className="text-gray-400 text-lg">
              Professionelle Zertifizierungen und Weiterbildungen
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert, index) => (
              <div 
                key={index}
                className="bg-gray-900/50 border border-gray-800 p-6 rounded-3xl hover:border-gray-600 transition-all duration-300 hover:scale-105 hover:-translate-y-2 shadow-xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center">
                    <Award className="text-yellow-400" size={20} />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    cert.status === 'Completed' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {cert.status}
                  </span>
                </div>
                
                <h3 className="font-semibold text-white mb-2">
                  {cert.name}
                </h3>
                <p className="text-gray-400 text-sm mb-1">
                  {cert.issuer}
                </p>
                <p className="text-gray-500 text-sm code-font">
                  {cert.year}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;
