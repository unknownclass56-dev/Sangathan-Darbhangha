import { useState } from "react";
import { useDonationSettings } from "@/hooks/useSiteData";
import { submitDonation } from "@/lib/supabase-helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Heart } from "lucide-react";

const DonationSection = () => {
  const { data: settings } = useDonationSettings();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", amount: "" });
  const [showQR, setShowQR] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const amounts = settings?.amounts || ["100", "500", "1000", "5000"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.amount) {
      toast({ title: "कृपया नाम और राशि भरें", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await submitDonation(form);
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setShowQR(true);
      toast({ title: "धन्यवाद!", description: "कृपया QR कोड से भुगतान करें" });
    }
  };

  return (
    <section id="donate" className="section-padding">
      <div className="container mx-auto max-w-2xl">
        <h2 className="text-3xl font-bold text-center font-hindi text-primary mb-2">
          <Heart className="inline w-8 h-8 mr-2" />
          अभी एक दान करें!
        </h2>
        <div className="w-20 h-1 gradient-saffron mx-auto mb-10 rounded-full" />

        {!showQR ? (
          <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg shadow-md border border-border space-y-4">
            <Input
              placeholder="आपका नाम *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              maxLength={100}
            />
            <Input
              placeholder="ईमेल"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              maxLength={255}
            />
            <Input
              placeholder="फोन नंबर"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              maxLength={15}
            />
            <div>
              <p className="text-sm font-medium mb-2 text-foreground">राशि चुनें:</p>
              <div className="flex flex-wrap gap-2">
                {amounts.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setForm({ ...form, amount: a })}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      form.amount === a
                        ? "gradient-saffron text-primary-foreground border-primary"
                        : "bg-secondary text-secondary-foreground border-border hover:border-primary"
                    }`}
                  >
                    ₹{a}
                  </button>
                ))}
              </div>
              <Input
                placeholder="या अन्य राशि दर्ज करें"
                value={amounts.includes(form.amount) ? "" : form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="mt-2"
                maxLength={10}
              />
            </div>
            <Button type="submit" className="w-full gradient-saffron text-primary-foreground hover:opacity-90" disabled={submitting}>
              {submitting ? "प्रतीक्षा करें..." : "दान करें"}
            </Button>
          </form>
        ) : (
          <div className="bg-card p-8 rounded-lg shadow-md border border-border text-center">
            <h3 className="text-xl font-bold font-hindi text-foreground mb-4">
              ₹{form.amount} दान के लिए धन्यवाद, {form.name}!
            </h3>
            {settings?.qr_image_url ? (
              <img src={settings.qr_image_url} alt="QR Code" className="mx-auto max-w-[300px] rounded-lg mb-4" />
            ) : (
              <div className="bg-muted p-8 rounded-lg mb-4">
                <p className="text-muted-foreground">QR कोड Admin Panel से अपलोड करें</p>
              </div>
            )}
            {settings?.upi_id && <p className="text-sm text-muted-foreground">UPI ID: {settings.upi_id}</p>}
            <Button onClick={() => { setShowQR(false); setForm({ name: "", email: "", phone: "", amount: "" }); }} variant="outline" className="mt-4">
              वापस जाएं
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default DonationSection;
