
import { Zap, Clock, TrendingUp, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Automation = () => {
  const solutions = [
    {
      icon: Zap,
      title: "Infrastructure Deployment",
      description: "Automatisierte Server-Provisionierung mit Infrastructure-as-Code",
      metrics: "95% schnellere Deployments",
      benefits: ["Zero-Downtime", "Konsistente Umgebungen", "Rollback-Fähigkeit"],
      color: "blue"
    },
    {
      icon: Clock,
      title: "Backup & Recovery",
      description: "Automatisierte Backup-Strategien mit Disaster Recovery",
      metrics: "99.9% Uptime Garantie",
      benefits: ["Automatische Backups", "Schnelle Recovery", "Compliance-Ready"],
      color: "emerald"
    },
    {
      icon: TrendingUp,
      title: "Performance Monitoring",
      description: "Real-time System-Überwachung mit intelligenten Alerts",
      metrics: "50% Performance-Steigerung",
      benefits: ["Proaktive Alerts", "Auto-Scaling", "Resource Optimization"],
      color: "purple"
    },
    {
      icon: CheckCircle,
      title: "Quality Assurance",
      description: "Automatisierte Test-Pipelines mit Security-Scans",
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
    <div className="min-h-screen bg-gray-950 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Automation Solutions
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Effiziente Automatisierungslösungen für IT-Prozesse
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 animate-slide-up">
          {solutions.map((solution, index) => {
            const IconComponent = solution.icon;
            const colorClasses = getColorClasses(solution.color);
            
            return (
              <Card 
                key={index}
                className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 hover:scale-105 hover:-translate-y-2 shadow-xl rounded-3xl group"
              >
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className={`p-4 rounded-2xl border ${colorClasses}`}>
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
        <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-3xl shadow-xl animate-slide-up">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            Automation Workflow
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: 'Analyse', desc: 'Requirements Assessment' },
              { step: 'Design', desc: 'Solution Planning' },
              { step: 'Implementation', desc: 'Development & Testing' },
              { step: 'Monitoring', desc: 'Performance & Maintenance' }
            ].map((phase, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/20 border-2 border-blue-500/30 flex items-center justify-center text-blue-400 font-bold group-hover:bg-blue-500/30 transition-all duration-300 hover:scale-110">
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
    </div>
  );
};

export default Automation;
