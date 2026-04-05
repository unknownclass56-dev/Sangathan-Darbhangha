import { usePlans } from "@/hooks/useSiteData";
import { HandHeart } from "lucide-react";

const PlansSection = () => {
  const { data: plans } = usePlans();

  if (!plans || plans.length === 0) return null;

  return (
    <section id="plans" className="py-12 bg-[#fafafa]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold font-hindi text-gray-800 mb-2">
            हमारी <span className="text-[#f26522]">योजना</span>
          </h2>
          <div className="flex justify-center text-[#f26522]/40 mb-4">
            <HandHeart className="w-8 h-8" />
          </div>
          <p className="text-gray-600 font-hindi">विश्व हिन्दू रक्षा संगठन द्वारा बहुत तरह का योजना हर जिले में चलाया जा रहा है.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((p) => {
            const progress = 54; // Placeholder progress matching the screenshot
            return (
              <div key={p.id} className="bg-white rounded-none shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.title} className="w-full h-56 object-cover" />
                ) : (
                  <div className="w-full h-56 bg-gray-200"></div>
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg font-hindi text-gray-800 mb-4">{p.title}</h3>
                  {p.goal_amount ? (
                    <div className="text-sm font-bold text-gray-600 mb-2">RS.{p.goal_amount}</div>
                  ) : (
                    <div className="text-sm font-bold text-gray-600 mb-2">RS.50 लाख</div>
                  )}
                  
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-6 relative mt-2">
                    <div className="bg-[#f26522] h-3 rounded-full" style={{ width: `${progress}%` }}></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] bg-white border border-[#f26522] text-[#f26522] px-2 rounded-full font-bold">
                        {progress}%
                    </div>
                  </div>
                  
                  {p.description && <p className="text-sm text-gray-500 font-hindi line-clamp-3">{p.description}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PlansSection;
