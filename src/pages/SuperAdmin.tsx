import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ShieldAlert, Trash2, Settings, ArrowRight, UserPlus, X, Globe, Lock, Layout } from "lucide-react";

const SUPER_ADMIN_EMAIL = "superadmin@gmail.com";

const SuperAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuper, setIsSuper] = useState(false);
  
  const [profiles, setProfiles] = useState<any[]>([]);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceId, setMaintenanceId] = useState<string | null>(null);

  // Add Admin form state
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newAdminName, setNewAdminName] = useState("");
  const [addingAdmin, setAddingAdmin] = useState(false);
  
  // Block Mode Settings
  const [blockMode, setBlockMode] = useState(false);
  const [blockTitle, setBlockTitle] = useState("");
  const [blockMessage, setBlockMessage] = useState("");
  const [showBlockConfig, setShowBlockConfig] = useState(false);
  const [savingBlock, setSavingBlock] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const hasAccess = await checkSuperAccess(session.user.id, session.user.email);
        if (hasAccess) {
          setIsSuper(true);
          loadSuperData();
        }
      }
    });
  }, []);

  const checkSuperAccess = async (userId: string, userEmail: string | undefined) => {
    const email1 = userEmail?.trim().toLowerCase() || "";
    const email2 = SUPER_ADMIN_EMAIL.trim().toLowerCase();
    
    if (email1 === email2) return true;
    
    // Check role in DB
    const { data, error } = await (supabase as any)
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'super_admin')
      .maybeSingle();
      
    if (error) console.error("Role lookup error:", error);
    return !!data;
  };

  const loadSuperData = async () => {
    // Load Admin Profiles
    const { data: profs } = await (supabase as any).from('profiles').select('*');
    if (profs) setProfiles(profs);

    // Load Site Settings (Maintenance Mode)
    const { data: settings } = await (supabase as any)
      .from('site_settings')
      .select('*')
      .eq('setting_key', 'maintenance_mode')
      .maybeSingle();

    if (settings) {
      setMaintenanceMode(settings.setting_value === "true");
      setMaintenanceId(settings.id);
    }

    // Load Block Settings
    const { data: allSettings } = await (supabase as any)
      .from('site_settings')
      .select('*');

    if (allSettings) {
      const blockE = allSettings.find((s: any) => s.setting_key === 'block_mode');
      const blockT = allSettings.find((s: any) => s.setting_key === 'block_title');
      const blockM = allSettings.find((s: any) => s.setting_key === 'block_message');

      if (blockE) setBlockMode(blockE.setting_value === "true");
      if (blockT) setBlockTitle(blockT.setting_value || "");
      if (blockM) setBlockMessage(blockM.setting_value || "");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setLoading(false);
      alert(`लॉगिन फेल: ${error.message}`);
      toast({ title: "Login Error", description: error.message, variant: "destructive" });
      return;
    }

    if (authData?.user) {
      const hasAccess = await checkSuperAccess(authData.user.id, authData.user.email);
      if (hasAccess) {
        setIsSuper(true);
        loadSuperData();
      } else {
        await supabase.auth.signOut();
        alert("Access Denied: You don't have super admin access.");
        toast({ title: "Access Denied", description: "You are not a Super Admin.", variant: "destructive" });
      }
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsSuper(false);
    navigate("/super-admin");
  };

  const toggleMaintenance = async () => {
    const newValue = !maintenanceMode;
    const valueStr = newValue ? "true" : "false";
    
    const { error } = await (supabase as any)
      .from('site_settings')
      .upsert({ 
        setting_key: 'maintenance_mode', 
        setting_value: valueStr 
      }, { onConflict: 'setting_key' });
      
    if (!error) {
      setMaintenanceMode(newValue);
      toast({ title: "Settings Updated", description: `Maintenance Mode is now ${newValue ? "ON" : "OFF"}` });
    } else {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const saveBlockSettings = async () => {
    setSavingBlock(true);
    try {
      const settings = [
        { setting_key: 'block_mode', setting_value: blockMode ? "true" : "false" },
        { setting_key: 'block_title', setting_value: blockTitle },
        { setting_key: 'block_message', setting_value: blockMessage }
      ];

      const { error } = await (supabase as any)
        .from('site_settings')
        .upsert(settings, { onConflict: 'setting_key' });

      if (error) throw error;
      
      toast({ title: "Success", description: "Block settings saved successfully." });
      setShowBlockConfig(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSavingBlock(false);
    }
  };

  const toggleBlockMode = async () => {
    const newValue = !blockMode;
    const { error } = await (supabase as any)
      .from('site_settings')
      .upsert({ 
        setting_key: 'block_mode', 
        setting_value: newValue ? "true" : "false" 
      }, { onConflict: 'setting_key' });

    if (!error) {
      setBlockMode(newValue);
      toast({ title: "Settings Updated", description: `Block Mode is now ${newValue ? "ON" : "OFF"}` });
    }
  };

  const deleteAdminProfile = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this admin's access?")) return;
    const { error } = await (supabase as any).from('profiles').delete().eq('id', id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Admin access revoked." });
      setProfiles(profiles.filter(p => p.id !== id));
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingAdmin(true);
    try {
      // Create user via Supabase Admin Auth (signUp)
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: newAdminEmail,
        password: newAdminPassword,
        options: {
          data: { first_name: newAdminName }
        }
      });

      if (signUpError) {
        toast({ title: "Error", description: signUpError.message, variant: "destructive" });
        return;
      }

      if (signUpData?.user) {
        // Insert profile entry so dashboard lets them in
        await (supabase as any).from('profiles').insert({
          id: signUpData.user.id,
          first_name: newAdminName,
        });

        // Assign 'admin' role in user_roles table
        await (supabase as any).from('user_roles').insert({
          user_id: signUpData.user.id,
          role: 'admin'
        });

        toast({ title: "Success!", description: `Admin '${newAdminEmail}' created successfully.` });
        setNewAdminEmail("");
        setNewAdminPassword("");
        setNewAdminName("");
        setShowAddAdmin(false);
        loadSuperData();
      }
    } finally {
      setAddingAdmin(false);
    }
  };

  if (!isSuper) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-gray-900 border border-red-500/30 p-8 rounded-lg shadow-2xl w-full max-w-sm space-y-6">
          <div className="text-center">
            <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-2" />
            <h1 className="text-xl font-bold text-white tracking-widest uppercase">Super Admin Access</h1>
            <p className="text-red-400 text-xs mt-1">Classified System Control</p>
          </div>
          <Input type="email" placeholder="Master Email" value={email} onChange={e => setEmail(e.target.value)} required className="bg-black text-white border-gray-700" />
          <Input type="password" placeholder="Master Password" value={password} onChange={e => setPassword(e.target.value)} required className="bg-black text-white border-gray-700" />
          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={loading}>
            {loading ? "Authenticating..." : "Establish Connection"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-200 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center bg-gray-900 border border-gray-800 p-4 rounded-lg mb-8 shadow-lg">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-red-500" />
            <div>
              <h1 className="text-xl font-bold text-white uppercase tracking-widest">Master Console</h1>
              <p className="text-xs text-gray-500">System Priority: OVERRIDE</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.open("/", "_blank")} className="border-green-500/50 text-green-400 hover:bg-green-500/10">
              <Globe className="w-4 h-4 mr-2" /> View Site
            </Button>
            <Button variant="outline" onClick={() => navigate("/admin/dashboard")} className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
              <ArrowRight className="w-4 h-4 mr-2" /> Admin Panel
            </Button>
            <Button variant="outline" onClick={handleLogout} className="border-red-500/50 text-red-400 hover:bg-red-500/10">
              Disconnect
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Server Control */}
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-800 pb-4">
              <Settings className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-semibold text-white">Server Infrastructure</h2>
            </div>
            
            <div className="space-y-4">
              {/* Maintenance Mode */}
              <div className="p-4 bg-black rounded-lg border border-gray-800 flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-white flex items-center gap-2">
                    <Settings className="w-4 h-4 text-gray-500" />
                    Server Maintenance
                  </h3>
                  <p className="text-sm text-gray-500">Takes public site offline entirely.</p>
                </div>
                <Button 
                  onClick={toggleMaintenance}
                  variant={maintenanceMode ? "destructive" : "default"}
                  className={!maintenanceMode ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {maintenanceMode ? "Server is DOWN" : "Server is ON"}
                </Button>
              </div>

              {/* Block Mode */}
              <div className="p-4 bg-black rounded-lg border border-gray-800 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-white flex items-center gap-2">
                      <Lock className="w-4 h-4 text-red-500" />
                      Block Screen
                    </h3>
                    <p className="text-sm text-gray-500">Show a custom blocking overlay.</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowBlockConfig(!showBlockConfig)}
                      className="border-gray-700 text-gray-400"
                    >
                      {showBlockConfig ? "Close" : "Configure"}
                    </Button>
                    <Button 
                      onClick={toggleBlockMode}
                      variant={blockMode ? "destructive" : "default"}
                      className={!blockMode ? "bg-blue-600 hover:bg-blue-700" : ""}
                    >
                      {blockMode ? "ENABLED" : "DISABLED"}
                    </Button>
                  </div>
                </div>

                {showBlockConfig && (
                  <div className="pt-4 border-t border-gray-800 space-y-3 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 uppercase tracking-wider">Block Title</label>
                      <Input 
                        placeholder="e.g., Access Restricted" 
                        value={blockTitle} 
                        onChange={e => setBlockTitle(e.target.value)}
                        className="bg-gray-900 border-gray-800 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 uppercase tracking-wider">Block Message</label>
                      <textarea 
                        className="flex min-h-[80px] w-full rounded-md border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="e.g., We are currently performing scheduled maintenance..." 
                        value={blockMessage}
                        onChange={e => setBlockMessage(e.target.value)}
                      />
                    </div>
                    <Button 
                      onClick={saveBlockSettings} 
                      disabled={savingBlock}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {savingBlock ? "Saving..." : "Save Block Configuration"}
                    </Button>
                    <p className="text-[10px] text-gray-500 text-center italic">
                      * Changes will reflect on the home page once enabled.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Admin Control */}
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-white">Admin Access Control</h2>
              </div>
              <Button
                size="sm"
                onClick={() => setShowAddAdmin(!showAddAdmin)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
              >
                {showAddAdmin ? <X className="w-4 h-4 mr-1" /> : <UserPlus className="w-4 h-4 mr-1" />}
                {showAddAdmin ? "Cancel" : "Add Admin"}
              </Button>
            </div>

            {showAddAdmin && (
              <form onSubmit={handleAddAdmin} className="mb-4 p-4 bg-black rounded-lg border border-blue-500/30 space-y-3">
                <p className="text-blue-400 text-sm font-medium">Create New Admin Account</p>
                <Input
                  placeholder="Admin Name"
                  value={newAdminName}
                  onChange={e => setNewAdminName(e.target.value)}
                  required
                  className="bg-gray-900 text-white border-gray-700 text-sm"
                />
                <Input
                  type="email"
                  placeholder="Admin Email"
                  value={newAdminEmail}
                  onChange={e => setNewAdminEmail(e.target.value)}
                  required
                  className="bg-gray-900 text-white border-gray-700 text-sm"
                />
                <Input
                  type="password"
                  placeholder="Password (min 6 chars)"
                  value={newAdminPassword}
                  onChange={e => setNewAdminPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-gray-900 text-white border-gray-700 text-sm"
                />
                <Button type="submit" disabled={addingAdmin} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm">
                  {addingAdmin ? "Creating..." : "Create Admin"}
                </Button>
              </form>
            )}
            
            <div className="space-y-3">
              {profiles.length === 0 && <p className="text-gray-500 italic">No admin profiles found.</p>}
              {profiles.map(profile => (
                <div key={profile.id} className="p-3 bg-black rounded-lg border border-gray-800 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-white">{profile.first_name || "Unknown"} {profile.last_name || ""}</h3>
                    <p className="text-xs text-gray-500">ID: {profile.id.substring(0, 8)}...</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteAdminProfile(profile.id)} className="text-red-500 hover:text-red-400 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdmin;
