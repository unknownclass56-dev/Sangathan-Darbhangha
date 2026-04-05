import React from "react";
import { Smile, Rocket, Users, Globe2 } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      icon: <Smile className="w-8 h-8 text-white mx-auto mb-4 opacity-80" />,
      value: "240",
      label: "खुश दाताओं"
    },
    {
      icon: <Rocket className="w-8 h-8 text-white mx-auto mb-4 opacity-80" />,
      value: "370",
      label: "सफल मिशन"
    },
    {
      icon: <Users className="w-8 h-8 text-white mx-auto mb-4 opacity-80" />,
      value: "38,421",
      label: "स्वयंसेवक संख्या पहुंचे"
    },
    {
      icon: <Globe2 className="w-8 h-8 text-white mx-auto mb-4 opacity-80" />,
      value: "32",
      label: "वैश्वीकरण कार्य"
    }
  ];

  return (
    <section 
      className="relative py-20 bg-cover bg-center bg-fixed bg-gray-900" 
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center">
              {stat.icon}
              <div className="text-5xl font-bold text-[#f26522] mb-2">{stat.value}</div>
              <div className="text-sm font-hindi">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
