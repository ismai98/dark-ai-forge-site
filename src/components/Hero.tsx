
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Server, Settings, Code } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useWebsiteConfig } from '@/hooks/useWebsiteConfig';

const Hero = () => {
  const { config } = useWebsiteConfig();
  const [heroContent, setHeroContent] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeroContent();

    const channel = supabase
      .channel('hero-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'page_sections'
        },
        (payload) => {
          if (payload.new && typeof payload.new === 'object' && 'section_type' in payload.new && payload.new.section_type === 'hero') {
            fetchHeroContent();
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'website_config'
        },
        () => {
          fetchHeroContent();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchHeroContent = async () => {
    try {
      const { data, error } = await supabase
        .from('page_sections')
        .select('*')
        .eq('section_type', 'hero')
        .eq('page_id', 'home')
        .eq('is_visible', true)
        .order('section_order', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setHeroContent(data.content || {});
      } else {
        setHeroContent({
          title: "System Engineer & Automation Specialist",
          subtitle: "Trainee für moderne IT-Lösungen und Infrastructure Automation",
          buttons: [
            {
              text: "Projekte ansehen",
              link: "/projects",
              style: "primary"
            },
            {
              text: "Kontakt",
              link: "/contact",
              style: "secondary"
            }
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching hero content:', error);
      setHeroContent({
        title: "System Engineer & Automation Specialist",
        subtitle: "Trainee für moderne IT-Lösungen und Infrastructure Automation",
        buttons: [
          {
            text: "Projekte ansehen",
            link: "/projects",
            style: "primary"
          },
          {
            text: "Kontakt",
            link: "/contact",
            style: "secondary"
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-950 to-purple-900/20"></div>
        <div className="text-white relative z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Lade Inhalte...</p>
        </div>
      </section>
    );
  }

  const services = [
    {
      icon: Server,
      title: "Infrastructure",
      subtitle: "Server-Lösungen",
      color: "from-blue-600 to-blue-700"
    },
    {
      icon: Settings,
      title: "Automation",
      subtitle: "Effiziente Prozesse",
      color: "from-purple-600 to-purple-700"
    },
    {
      icon: Code,
      title: "Development",
      subtitle: "Software-Lösungen",
      color: "from-teal-600 to-teal-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-950 to-purple-900/20"></div>
        
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-30"></div>
          <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-40 delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse opacity-35 delay-2000"></div>
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="space-y-12">
            <div className="space-y-8">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
                {heroContent.title || "System Engineer & Automation Specialist"}
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-300 font-light max-w-3xl mx-auto leading-relaxed">
                {heroContent.subtitle || "Trainee für moderne IT-Lösungen und Infrastructure Automation"}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
              {heroContent.buttons?.map((button: any, index: number) => (
                <Button
                  key={index}
                  size="lg"
                  className={`group px-8 py-4 text-lg font-medium rounded-full transition-all duration-300 transform hover:scale-105 ${
                    button.style === 'primary'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl shadow-blue-500/25 text-white border-0'
                      : 'bg-transparent border-2 border-gray-600 text-white hover:border-white hover:bg-white hover:text-gray-900 rounded-full'
                  }`}
                  asChild
                >
                  <a href={button.link}>
                    {button.text}
                    <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 hover:border-gray-700 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon size={32} className="text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold bg-gradient-to-r ${service.color} bg-clip-text text-transparent`}>
                    {service.title}
                  </h3>
                  <p className="text-gray-400 text-lg">
                    {service.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
