
import { Server, Code2, Cog, Database, Cloud, Shield } from 'lucide-react';

const Skills = () => {
  const skillCategories = [
    {
      icon: Server,
      title: "Infrastructure",
      skills: ["Linux Administration", "Docker", "Kubernetes", "Terraform"],
      color: "blue"
    },
    {
      icon: Code2,
      title: "Programming",
      skills: ["Python", "JavaScript", "Bash Scripting", "PowerShell"],
      color: "emerald"
    },
    {
      icon: Cog,
      title: "Automation",
      skills: ["Ansible", "Jenkins", "GitHub Actions", "Puppet"],
      color: "purple"
    },
    {
      icon: Database,
      title: "Databases",
      skills: ["PostgreSQL", "MongoDB", "Redis", "InfluxDB"],
      color: "cyan"
    },
    {
      icon: Cloud,
      title: "Cloud Platforms",
      skills: ["AWS", "Microsoft Azure", "Google Cloud", "DigitalOcean"],
      color: "orange"
    },
    {
      icon: Shield,
      title: "Security & Monitoring",
      skills: ["SSL/TLS", "Firewall Config", "VPN Setup", "System Monitoring"],
      color: "red"
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
    <section id="skills" className="py-20 px-4 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Technical Skills
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Expertise in modernen Technologien und Tools für System Engineering
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => {
            const IconComponent = category.icon;
            const colorClasses = getColorClasses(category.color);
            
            return (
              <div 
                key={index}
                className="bg-gray-800 border border-gray-700 p-6 rounded-lg hover:border-gray-600 transition-all duration-300 hover:scale-105 group"
              >
                <div className="flex items-center mb-6">
                  <div className={`p-3 rounded-lg border ${colorClasses}`}>
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
                      className="bg-gray-900 border border-gray-700 p-3 rounded text-gray-300 text-sm hover:bg-gray-800 hover:border-gray-600 transition-all duration-200 code-font"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
