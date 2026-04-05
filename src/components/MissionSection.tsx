import React from "react";

const goals = [
  {
    icon: "🐄",
    title: "गौ माता - राष्ट्र माता",
    description: "गाय हमारी माता है। गौ सेवा ही राष्ट्र सेवा है। हम गौ वंश की रक्षा और संवर्धन के लिए प्रतिबद्ध हैं।",
    color: "from-orange-500 to-amber-500",
  },
  {
    icon: "🚫",
    title: "गौ हत्या बंद हो",
    description: "गौ हत्या पर पूर्ण प्रतिबंध हमारा प्रमुख उद्देश्य है। हम इसके लिए जन-जागरण और कानूनी लड़ाई दोनों में सक्रिय हैं।",
    color: "from-red-500 to-rose-500",
  },
  {
    icon: "🏥",
    title: "निःशुल्क चिकित्सा सेवा",
    description: "गरीब और जरूरतमंद लोगों के लिए निःशुल्क चिकित्सा शिविर आयोजित करना और स्वास्थ्य सेवाएँ प्रदान करना।",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: "📚",
    title: "शिक्षा प्रसार",
    description: "समाज के वंचित वर्गों के बच्चों को शिक्षा प्रदान करना। निःशुल्क कोचिंग और छात्रवृत्ति उपलब्ध कराना।",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: "🌾",
    title: "किसान कल्याण",
    description: "किसान भाइयों की समस्याओं का समाधान करना, उन्हें सरकारी योजनाओं की जानकारी देना और आर्थिक सहायता दिलाना।",
    color: "from-yellow-500 to-lime-500",
  },
  {
    icon: "🛕",
    title: "हिन्दू धर्म रक्षा",
    description: "सनातन धर्म, संस्कृति और परंपराओं की रक्षा करना। धार्मिक स्थलों की सुरक्षा और हिन्दू एकता को मजबूत करना।",
    color: "from-purple-500 to-violet-500",
  },
];

const MissionSection = () => {
  return (
    <section className="py-16 bg-gray-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#f26522] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Heading */}
        <div className="text-center mb-12">
          <span className="inline-block bg-[#f26522]/20 text-[#f26522] text-sm font-hindi px-5 py-1.5 rounded-full mb-4 border border-[#f26522]/30">
            🎯 संगठन का उद्देश्य
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-hindi text-white mb-3">
            हमारा लक्ष्य
          </h2>
          <p className="text-gray-400 font-hindi max-w-2xl mx-auto text-sm leading-relaxed">
            पंचा महाबली संगठन — गौ रक्षा, राष्ट्र सेवा और हिन्दू एकता के लिए सतत प्रयासरत
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-[#f26522] to-orange-300 mx-auto mt-4 rounded-full" />
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal, idx) => (
            <div
              key={idx}
              className="group bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-[#f26522]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#f26522]/10 hover:-translate-y-1"
            >
              {/* Icon with gradient circle */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${goal.color} flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {goal.icon}
              </div>

              <h3 className="text-lg font-bold font-hindi text-white mb-2 group-hover:text-[#f26522] transition-colors">
                {goal.title}
              </h3>
              <p className="text-gray-400 text-sm font-hindi leading-relaxed">
                {goal.description}
              </p>

              {/* Bottom accent line */}
              <div className={`h-0.5 w-0 bg-gradient-to-r ${goal.color} mt-4 rounded-full group-hover:w-full transition-all duration-500`} />
            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-3 bg-[#f26522]/10 border border-[#f26522]/30 rounded-full px-8 py-3">
            <span className="text-2xl">🚩</span>
            <p className="text-white font-hindi font-bold text-lg">
              जय श्री राम! भारत माता की जय! गौ माता की जय!
            </p>
            <span className="text-2xl">🚩</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
