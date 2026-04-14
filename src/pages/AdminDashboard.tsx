import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, LogOut, Upload, Pencil } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type SliderImage = Database["public"]["Tables"]["slider_images"]["Row"];
type TeamMember = Database["public"]["Tables"]["team_members"]["Row"];
type UpcomingEvent = Database["public"]["Tables"]["upcoming_events"]["Row"];
type Plan = Database["public"]["Tables"]["plans"]["Row"];
type GalleryImage = Database["public"]["Tables"]["gallery_images"]["Row"];
type FeaturedEvent = Database["public"]["Tables"]["featured_events"]["Row"];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  // Data states
  const [sliders, setSliders] = useState<SliderImage[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [featured, setFeatured] = useState<FeaturedEvent[]>([]);
  const [donationSettings, setDonationSettings] = useState<{ id: string; qr_image_url: string; amounts: string[]; upi_id: string }>({ id: "", qr_image_url: "", amounts: ["100","500","1000","5000"], upi_id: "" });
  const [siteSettings, setSiteSettings] = useState<Record<string, { id: string; value: string }>>({});
  const [donationRequests, setDonationRequests] = useState<any[]>([]);

  const loadAll = useCallback(async () => {
    try {
      const [s, t, e, p, g, f, d, ss, dr] = await Promise.all([
        supabase.from("slider_images").select("*").order("display_order"),
        supabase.from("team_members").select("*").order("display_order"),
        supabase.from("upcoming_events").select("*").order("event_date"),
        supabase.from("plans").select("*"),
        supabase.from("gallery_images").select("*").order("display_order"),
        supabase.from("featured_events").select("*").order("event_date"),
        supabase.from("donation_settings").select("*").limit(1).single(),
        supabase.from("site_settings").select("*"),
        supabase.from("donation_requests").select("*").order("created_at", { ascending: false }),
      ]);

      if (dr.error) {
        console.error("Donation Requests Error:", dr.error);
        toast({ title: "Donation Data Error", description: dr.error.message, variant: "destructive" });
      }

      setSliders(s.data || []);
      setTeam(t.data || []);
      setEvents(e.data || []);
      setPlans(p.data || []);
      setGallery(g.data || []);
      setFeatured(f.data || []);
      setDonationRequests(dr.data || []);
      if (d.data) setDonationSettings({ id: d.data.id, qr_image_url: d.data.qr_image_url || "", amounts: d.data.amounts || ["100","500","1000","5000"], upi_id: d.data.upi_id || "" });

      const settingsMap: Record<string, { id: string; value: string }> = {};
      ss.data?.forEach((s) => { settingsMap[s.setting_key] = { id: s.id, value: s.setting_value || "" }; });
      setSiteSettings(settingsMap);
    } catch (err: any) {
      console.error("LoadAll Error:", err);
      toast({ title: "Error Loading Dashboard", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        navigate("/admin");
        return;
      }
      
        // Check for profile on initial dashboard load to prevent generic users from accessing
      const { data: profile, error: profileError } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();
        
      if (profileError || !profile) {
        await supabase.auth.signOut();
        alert(`Dashboard Access Denied: ${profileError ? profileError.message : "Profile not found in profiles table."}`);
        toast({ title: "Access Denied", description: "Your profile was not found. Please contact an administrator.", variant: "destructive" });
        navigate("/admin");
      } else {
        loadAll();
      }
    });
  }, [navigate, loadAll, toast]);

  const uploadFile = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("uploads").upload(path, file);
    if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); return null; }
    const { data } = supabase.storage.from("uploads").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  // CRUD helpers - using 'as any' for generic table access
  const addItem = async (table: string, data: Record<string, unknown>) => {
    const { error } = await (supabase.from(table as any).insert(data as any) as any);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Added!" }); loadAll(); }
  };

  const deleteItem = async (table: string, id: string) => {
    const { error } = await (supabase.from(table as any).delete().eq("id", id) as any);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted!" }); loadAll(); }
  };

  const updateItem = async (table: string, id: string, data: Record<string, unknown>) => {
    const { error } = await (supabase.from(table as any).update(data as any).eq("id", id) as any);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Updated!" }); loadAll(); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-primary">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-saffron p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary-foreground font-hindi">Admin Panel - पंचा महाबली संगठन</h1>
        <Button variant="outline" size="sm" onClick={handleLogout} className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30">
          <LogOut className="w-4 h-4 mr-1" /> Logout
        </Button>
      </div>

      <div className="container mx-auto p-4">
        <Tabs defaultValue="sliders">
          <TabsList className="flex-wrap h-auto mb-6">
            <TabsTrigger value="sliders">स्लाइडर</TabsTrigger>
            <TabsTrigger value="team">कार्यकारिणी</TabsTrigger>
            <TabsTrigger value="events">कार्यक्रम</TabsTrigger>
            <TabsTrigger value="plans">योजना</TabsTrigger>
            <TabsTrigger value="gallery">गैलरी</TabsTrigger>
            <TabsTrigger value="featured">आगामी</TabsTrigger>
            <TabsTrigger value="donation">दान</TabsTrigger>
            <TabsTrigger value="settings">सेटिंग्स</TabsTrigger>
          </TabsList>

          {/* SLIDERS */}
          <TabsContent value="sliders">
            <AdminSection
              title="स्लाइडर इमेज"
              items={sliders}
              onAdd={(data) => addItem("slider_images", data)}
              onDelete={(id) => deleteItem("slider_images", id)}
              onUpdate={(id, data) => updateItem("slider_images", id, data)}
              uploadFile={uploadFile}
              fields={[
                { key: "image_url", label: "Image", type: "image", required: true },
                { key: "title", label: "Title", type: "text" },
                { key: "display_order", label: "Order", type: "number" },
              ]}
              renderItem={(item) => (
                <div className="flex items-center gap-3">
                  {item.image_url && <img src={item.image_url} alt="" className="w-16 h-12 object-cover rounded" />}
                  <span className="font-medium">{item.title || "No title"}</span>
                  <span className="text-sm text-muted-foreground">Order: {item.display_order}</span>
                </div>
              )}
            />
          </TabsContent>

          {/* TEAM */}
          <TabsContent value="team">
            <AdminSection
              title="राष्ट्रीय कार्यकारिणी"
              items={team}
              onAdd={(data) => addItem("team_members", data)}
              onDelete={(id) => deleteItem("team_members", id)}
              onUpdate={(id, data) => updateItem("team_members", id, data)}
              uploadFile={uploadFile}
              fields={[
                { key: "name", label: "नाम", type: "text", required: true },
                { key: "position", label: "पद", type: "text", required: true },
                { key: "image_url", label: "Photo", type: "image" },
                { key: "description", label: "विवरण", type: "textarea" },
                { key: "display_order", label: "Order", type: "number" },
              ]}
              renderItem={(item) => (
                <div className="flex items-center gap-3">
                  {item.image_url && <img src={item.image_url} alt="" className="w-12 h-12 object-cover rounded-full" />}
                  <div><span className="font-medium">{item.name}</span><br/><span className="text-sm text-muted-foreground">{item.position}</span></div>
                </div>
              )}
            />
          </TabsContent>

          {/* EVENTS */}
          <TabsContent value="events">
            <AdminSection
              title="आने वाले कार्यक्रम"
              items={events}
              onAdd={(data) => addItem("upcoming_events", data)}
              onDelete={(id) => deleteItem("upcoming_events", id)}
              onUpdate={(id, data) => updateItem("upcoming_events", id, data)}
              uploadFile={uploadFile}
              fields={[
                { key: "title", label: "शीर्षक", type: "text", required: true },
                { key: "event_date", label: "तारीख", type: "date", required: true },
                { key: "time_range", label: "समय", type: "text" },
                { key: "location", label: "स्थान", type: "text" },
                { key: "description", label: "विवरण", type: "textarea" },
                { key: "image_url", label: "Image", type: "image" },
              ]}
              renderItem={(item) => (
                <div><span className="font-medium">{item.title}</span> - <span className="text-sm text-muted-foreground">{item.event_date}</span></div>
              )}
            />
          </TabsContent>

          {/* PLANS */}
          <TabsContent value="plans">
            <AdminSection
              title="हमारी योजना"
              items={plans}
              onAdd={(data) => addItem("plans", data)}
              onDelete={(id) => deleteItem("plans", id)}
              onUpdate={(id, data) => updateItem("plans", id, data)}
              uploadFile={uploadFile}
              fields={[
                { key: "title", label: "शीर्षक", type: "text", required: true },
                { key: "description", label: "विवरण", type: "textarea" },
                { key: "image_url", label: "Image", type: "image" },
                { key: "goal_amount", label: "लक्ष्य राशि", type: "text" },
              ]}
              renderItem={(item) => (
                <div><span className="font-medium">{item.title}</span>{item.goal_amount && <span className="text-sm text-muted-foreground ml-2">₹{item.goal_amount}</span>}</div>
              )}
            />
          </TabsContent>

          {/* GALLERY */}
          <TabsContent value="gallery">
            <AdminSection
              title="सहायता कार्य गैलरी"
              items={gallery}
              onAdd={(data) => addItem("gallery_images", data)}
              onDelete={(id) => deleteItem("gallery_images", id)}
              onUpdate={(id, data) => updateItem("gallery_images", id, data)}
              uploadFile={uploadFile}
              fields={[
                { key: "image_url", label: "Image", type: "image", required: true },
                { key: "caption", label: "Caption", type: "text" },
                { key: "display_order", label: "Order", type: "number" },
              ]}
              renderItem={(item) => (
                <div className="flex items-center gap-3">
                  <img src={item.image_url} alt="" className="w-16 h-12 object-cover rounded" />
                  <span>{item.caption || "No caption"}</span>
                </div>
              )}
            />
          </TabsContent>

          {/* FEATURED EVENTS */}
          <TabsContent value="featured">
            <AdminSection
              title="आगामी कार्यक्रम"
              items={featured}
              onAdd={(data) => addItem("featured_events", data)}
              onDelete={(id) => deleteItem("featured_events", id)}
              onUpdate={(id, data) => updateItem("featured_events", id, data)}
              uploadFile={uploadFile}
              fields={[
                { key: "title", label: "शीर्षक", type: "text", required: true },
                { key: "event_date", label: "तारीख", type: "date", required: true },
                { key: "year", label: "वर्ष", type: "text" },
                { key: "time_range", label: "समय", type: "text" },
                { key: "location", label: "स्थान", type: "text" },
                { key: "description", label: "विवरण", type: "textarea" },
                { key: "image_url", label: "Image", type: "image" },
              ]}
              renderItem={(item) => (
                <div><span className="font-medium">{item.title}</span> - <span className="text-sm text-muted-foreground">{item.event_date}</span></div>
              )}
            />
          </TabsContent>

          {/* DONATION SETTINGS */}
          <TabsContent value="donation">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-xl font-bold font-hindi text-primary mb-4">दान सेटिंग्स</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">QR Code Image</label>
                  <div className="flex items-center gap-2 mt-1">
                    {donationSettings.qr_image_url && <img src={donationSettings.qr_image_url} alt="QR" className="w-24 h-24 object-cover rounded" />}
                    <label className="cursor-pointer bg-secondary text-secondary-foreground px-4 py-2 rounded-md text-sm hover:opacity-80">
                      <Upload className="w-4 h-4 inline mr-1" /> Upload QR
                      <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const url = await uploadFile(file);
                        if (url) setDonationSettings(prev => ({...prev, qr_image_url: url}));
                      }} />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">UPI ID</label>
                  <Input value={donationSettings.upi_id} onChange={(e) => setDonationSettings(prev => ({...prev, upi_id: e.target.value}))} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Amounts (comma-separated)</label>
                  <Input
                    value={donationSettings.amounts.join(",")}
                    onChange={(e) => setDonationSettings(prev => ({...prev, amounts: e.target.value.split(",").map(s => s.trim())}))}
                  />
                </div>
                <Button onClick={() => updateItem("donation_settings", donationSettings.id, {
                  qr_image_url: donationSettings.qr_image_url,
                  amounts: donationSettings.amounts,
                  upi_id: donationSettings.upi_id,
                })} className="gradient-saffron text-primary-foreground">
                  Save
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* DONATION REQUESTS */}
          <TabsContent value="requests">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-xl font-bold font-hindi text-primary mb-4">दान के लिए अनुरोध (Donation Requests)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-3 text-sm font-semibold">नाम</th>
                      <th className="p-3 text-sm font-semibold">संपर्क (Email/Phone)</th>
                      <th className="p-3 text-sm font-semibold">राशि</th>
                      <th className="p-3 text-sm font-semibold">दिनांक</th>
                      <th className="p-3 text-sm font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donationRequests.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-4 text-center">
                          <p className="text-muted-foreground">कोई अनुरोध नहीं मिला</p>
                          <p className="text-[10px] text-muted-foreground/50 mt-1">If you expect data here, please ensure your account has the 'admin' or 'super_admin' role assigned.</p>
                        </td>
                      </tr>
                    ) : (
                      donationRequests.map((req) => (
                        <tr key={req.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="p-3">{req.name}</td>
                          <td className="p-3">
                            <div className="text-sm">{req.email || "-"}</div>
                            <div className="text-xs text-muted-foreground">{req.phone || "-"}</div>
                          </td>
                          <td className="p-3 font-semibold text-primary">₹{req.amount}</td>
                          <td className="p-3 text-sm text-muted-foreground">
                            {req.created_at ? new Date(req.created_at).toLocaleDateString('hi-IN') : "-"}
                          </td>
                          <td className="p-3 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteItem("donation_requests", req.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          {/* SITE SETTINGS */}
          <TabsContent value="settings">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-xl font-bold font-hindi text-primary mb-6">साइट सेटिंग्स</h3>
              <div className="space-y-6">

                {/* Contact Info */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 pb-2 border-b border-border font-hindi">📞 संपर्क जानकारी</h4>
                  <div className="space-y-3">
                    {["phone", "email", "address", "instagram", "org_name", "whatsapp_link"].map((key) => (
                      <div key={key}>
                        <label className="text-sm font-medium text-foreground capitalize">
                          {key === "whatsapp_link" ? "WhatsApp Group Link" : key === "org_name" ? "संगठन का नाम" : key}
                        </label>
                        <Input
                          value={siteSettings[key]?.value || ""}
                          onChange={(e) => setSiteSettings(prev => ({...prev, [key]: { ...prev[key], value: e.target.value }}))}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* About Organization */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 pb-2 border-b border-border font-hindi">🏛️ संगठन के बारे में</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-foreground">परिचय (About Text)</label>
                      <Textarea
                        rows={4}
                        placeholder="संगठन के बारे में जानकारी यहाँ लिखें..."
                        value={siteSettings["about_text"]?.value || ""}
                        onChange={(e) => setSiteSettings(prev => ({...prev, about_text: { ...prev["about_text"], value: e.target.value }}))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">About Image URL (optional)</label>
                      <Input
                        placeholder="https://..."
                        value={siteSettings["about_image"]?.value || ""}
                        onChange={(e) => setSiteSettings(prev => ({...prev, about_image: { ...prev["about_image"], value: e.target.value }}))}
                      />
                    </div>
                  </div>
                </div>

                {/* Campaign Section */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 pb-2 border-b border-border font-hindi">🎬 हमारा अभियान</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-foreground">YouTube Embed URL</label>
                      <Input
                        placeholder="https://www.youtube.com/embed/VIDEO_ID"
                        value={siteSettings["campaign_video"]?.value || ""}
                        onChange={(e) => setSiteSettings(prev => ({...prev, campaign_video: { ...prev["campaign_video"], value: e.target.value }}))}
                      />
                      <p className="text-xs text-muted-foreground mt-1">YouTube share link को Embed में बदलें: youtube.com/watch?v=ID → youtube.com/embed/ID</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Campaign Description</label>
                      <Input
                        placeholder="अभियान का विवरण..."
                        value={siteSettings["campaign_description"]?.value || ""}
                        onChange={(e) => setSiteSettings(prev => ({...prev, campaign_description: { ...prev["campaign_description"], value: e.target.value }}))}
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={async () => {
                  const entries = Object.entries(siteSettings) as [string, { id: string; value: string }][];
                  for (const [key, val] of entries) {
                    if (val.id) {
                      await updateItem("site_settings", val.id, { setting_value: val.value });
                    } else if (val.value) {
                      // New key not yet in DB — insert it
                      await (supabase.from("site_settings" as any).insert({ setting_key: key, setting_value: val.value }) as any);
                    }
                  }
                  toast({ title: "Saved!", description: "सभी सेटिंग्स सेव हो गई" });
                  loadAll();
                }} className="gradient-saffron text-primary-foreground w-full">
                  सभी सेटिंग्स सेव करें
                </Button>

              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Generic admin section component
interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "image";
  required?: boolean;
}

interface AdminSectionProps {
  title: string;
  items: any[];
  onAdd: (data: Record<string, any>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate?: (id: string, data: Record<string, any>) => Promise<void>;
  uploadFile: (file: File) => Promise<string | null>;
  fields: FieldDef[];
  renderItem: (item: any) => React.ReactNode;
}

const AdminSection = ({ title, items, onAdd, onDelete, onUpdate, uploadFile, fields, renderItem }: AdminSectionProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId && onUpdate) {
      await onUpdate(editingId, formData);
    } else {
      await onAdd(formData);
    }
    setFormData({});
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (item: any) => {
    setFormData(item);
    setEditingId(item.id);
    setShowForm(true);
  };

  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold font-hindi text-primary">{title}</h3>
        <Button onClick={() => {
          setFormData({});
          setEditingId(null);
          setShowForm(!showForm);
        }} size="sm" className="gradient-saffron text-primary-foreground">
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-muted p-4 rounded-lg mb-4 space-y-3">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="text-sm font-medium text-foreground">{field.label}</label>
              {field.type === "image" ? (
                <div className="flex items-center gap-2">
                  {formData[field.key] && <img src={formData[field.key] as string} alt="" className="w-16 h-12 object-cover rounded" />}
                  <label className="cursor-pointer bg-secondary text-secondary-foreground px-3 py-1.5 rounded text-sm">
                    <Upload className="w-4 h-4 inline mr-1" /> Upload
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const url = await uploadFile(file);
                      if (url) setFormData(prev => ({ ...prev, [field.key]: url }));
                    }} />
                  </label>
                </div>
              ) : field.type === "textarea" ? (
                <Textarea
                  value={(formData[field.key] as string) || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                  required={field.required}
                />
              ) : (
                <Input
                  type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                  value={(formData[field.key] as string) || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: field.type === "number" ? parseInt(e.target.value) : e.target.value }))}
                  required={field.required}
                />
              )}
            </div>
          ))}
          <div className="flex gap-2">
            <Button type="submit" size="sm" className="gradient-saffron text-primary-foreground">
              {editingId ? "Update" : "Save"}
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => {
              setShowForm(false);
              setEditingId(null);
              setFormData({});
            }}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {items.length === 0 && <p className="text-muted-foreground text-sm">No items yet</p>}
        {items.map((item) => (
          <div key={item.id as string} className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex-1">{renderItem(item)}</div>
            <div className="flex items-center gap-1">
              {onUpdate && (
                <Button variant="ghost" size="sm" onClick={() => handleEdit(item)} className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10">
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => onDelete(item.id as string)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
