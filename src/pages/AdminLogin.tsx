import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.jpeg";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/admin/dashboard");
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    
    if (authError) {
      setLoading(false);
      toast({ title: "Login Error", description: authError.message, variant: "destructive" });
      return;
    }

    if (authData?.user) {
      // Check if user has a profile
      const { data: profileData, error: profileError } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      setLoading(false);

      if (profileError || !profileData) {
        // No profile found, log them out immediately
        await supabase.auth.signOut();
        alert(`त्रुटि (Error): ${profileError ? profileError.message : "प्रोफ़ाइल नहीं मिली!"} - कृपया सुनिश्चित करें कि आपने SQL Query चला ली है।`);
        toast({ title: "Access Denied", description: "आपकी प्रोफ़ाइल नहीं मिली। आप एडमिन नहीं हैं!", variant: "destructive" });
      } else {
        // Profile exists, let them in
        navigate("/admin/dashboard");
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-saffron p-4">
      <form onSubmit={handleLogin} className="bg-card p-8 rounded-lg shadow-xl w-full max-w-md space-y-4">
        <div className="text-center">
          <img src={logo} alt="Logo" className="h-20 w-20 rounded-full mx-auto mb-4" />
          <h1 className="text-2xl font-bold font-hindi text-primary">Admin Login</h1>
        </div>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full gradient-saffron text-primary-foreground" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default AdminLogin;
