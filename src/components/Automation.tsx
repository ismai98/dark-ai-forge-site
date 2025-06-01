
import { Zap, Clock, TrendingUp, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Automation = () => {
  const solutions = [
    {
      icon: Zap,
      title: "Infrastructure Deployment",
      description: "Vollautomatisierte Server-Provisionierung und Konfiguration mit Infrastructure-as-Code",
      metrics: "95% schnellere Deployments",
      benefits: ["Zero-Downtime", "Konsistente Umgebungen", "Rollback-Fähigkeit"],
      color: "blue"
    },
    {
      icon: Clock,
      title: "Backup & Recovery",
      description: "Automatisierte Backup-Strategien mit Disaster Recovery und Point-in-Time Restoration",
      metrics: "99.9% Uptime Garantie",
      benefits: ["Automatische Backups", "Schnelle Recovery", "Compliance-Ready"],
      color: "emerald"
    },
    {
      icon: TrendingUp,
      title: "Performance Monitoring",
      description: "Real-time System-Überwachung mit intelligenten Alerts und automatischer Skalierung",
      metrics: "50% Performance-Steigerung",
      benefits: ["Proaktive Alerts", "Auto-Scaling", "Resource Optimization"],
      color: "purple"
    },
    {
      icon: CheckCircle,
      title: "Quality Assurance",
      description: "Automatisierte Test-Pipelines mit Code-Quality-Checks und Security-Scans",
      metrics: "Zero-Bug Deployments",
      benefits: ["Automated Testing", "Security Scans", "Code Quality Gates"],
      color: "cyan"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "text-blue-400 bg-blue-500/20 border-blue-500/30",
      emerald: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30",
      purple: "text-purple-400 bg-purple-500/20 border-purple-500/30",
      cyan: "text-cyan-400 bg-cyan-500/20 border-cyan-500/30"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section id="automation" className="py-20 px-4 bg-gray-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Automation Solutions
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Effiziente Automatisierungslösungen für komplexe IT-Prozesse und Infrastructure Management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {solutions.map((solution, index) => {
            const IconComponent = solution.icon;
            const colorClasses = getColorClasses(solution.color);
            
            return (
              <Card 
                key={index}
                className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-300 hover:scale-105 group"
              >
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg border ${colorClasses}`}>
                      <IconComponent size={24} />
                    </div>
                    <CardTitle className="ml-4 text-white group-hover:text-blue-400 transition-colors">
                      {solution.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {solution.description}
                  </p>
                  
                  <div className={`inline-block px-4 py-2 rounded-full text-sm border mb-4 ${colorClasses}`}>
                    {solution.metrics}
                  </div>

                  <div className="space-y-2">
                    {solution.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center text-sm text-gray-400">
                        <CheckCircle size={16} className="text-emerald-400 mr-2 flex-shrink-0" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Process Timeline */}
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-lg">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            Automation Workflow
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: 'Analyse', desc: 'Requirements & Current State Assessment' },
              { step: 'Design', desc: 'Architecture & Solution Planning' },
              { step: 'Implementation', desc: 'Development & Testing' },
              { step: 'Monitoring', desc: 'Performance & Maintenance' }
            ].map((phase, index) => (
              <div key={index} className="text-center group">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-500/20 border-2 border-blue-500/30 flex items-center justify-center text-blue-400 font-bold group-hover:bg-blue-500/30 transition-colors">
                  {index + 1}
                </div>
                <h4 className="font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {phase.step}
                </h4>
                <p className="text-gray-400 text-sm">
                  {phase.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Automation;
