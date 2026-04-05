import { useFeaturedEvents } from "@/hooks/useSiteData";
import { Calendar, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";

const FeaturedEventsSection = () => {
  const { data: events } = useFeaturedEvents();

  if (!events || events.length === 0) return null;

  return (
    <section className="section-padding bg-secondary">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center font-hindi text-primary mb-2">आगामी कार्यक्रम</h2>
        <div className="w-20 h-1 gradient-saffron mx-auto mb-10 rounded-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((e) => (
            <div key={e.id} className="bg-card rounded-lg shadow-md overflow-hidden border border-border">
              {e.image_url && <img src={e.image_url} alt={e.title} className="w-full h-48 object-cover" />}
              <div className="p-5">
                <div className="inline-block gradient-saffron text-primary-foreground text-xs px-3 py-1 rounded-full mb-3">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  {format(new Date(e.event_date), "dd MMM")} {e.year}
                </div>
                <h3 className="font-bold text-lg font-hindi text-foreground mb-2">{e.title}</h3>
                {e.time_range && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                    <Clock className="w-3 h-3" /> {e.time_range}
                  </p>
                )}
                {e.location && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {e.location}
                  </p>
                )}
                {e.description && <p className="text-sm text-muted-foreground mt-3">{e.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEventsSection;
