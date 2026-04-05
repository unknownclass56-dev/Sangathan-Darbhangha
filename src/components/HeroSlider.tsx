import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSliderImages } from "@/hooks/useSiteData";

const HeroSlider = () => {
  const { data: slides } = useSliderImages();
  const [current, setCurrent] = useState(0);

  const images = slides && slides.length > 0 ? slides : [];

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % images.length), 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <section id="home" className="relative h-[400px] md:h-[500px] gradient-saffron flex items-center justify-center">
        <div className="text-center text-primary-foreground">
          <h2 className="text-4xl font-bold font-hindi text-shadow">पंचा महाबली संगठन</h2>
          <p className="text-xl mt-2 text-shadow">दरभंगा</p>
          <p className="mt-4 text-sm opacity-80">स्लाइडर इमेज Admin Panel से जोड़ें</p>
        </div>
      </section>
    );
  }

  return (
    <section id="home" className="relative h-[400px] md:h-[500px] overflow-hidden">
      {images.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}
        >
          <img src={slide.image_url} alt={slide.title || ""} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
          {slide.title && (
            <div className="absolute bottom-8 left-8 text-primary-foreground">
              <h2 className="text-3xl font-bold font-hindi text-shadow">{slide.title}</h2>
            </div>
          )}
        </div>
      ))}
      {images.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((c) => (c - 1 + images.length) % images.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-primary/80 text-primary-foreground p-2 rounded-full hover:bg-primary"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrent((c) => (c + 1) % images.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary/80 text-primary-foreground p-2 rounded-full hover:bg-primary"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </section>
  );
};

export default HeroSlider;
