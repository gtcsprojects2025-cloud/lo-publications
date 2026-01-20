// src/app/admin/team/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X, Loader2, Phone, Mail, Globe, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import FileDropzone from "../../components/admin/FileDropzone";

// Type for social link
type SocialLink = {
  type: "phone" | "whatsapp" | "email" | "website" | "facebook" | "instagram" | "twitter" | "linkedin";
  url: string;
};

// Type for team member
type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio?: string | null;
  photo_url: string | null;
  socials?: SocialLink[] | null;
  created_at: string;
};

const socialOptions = [
  { type: "phone", icon: Phone, label: "Phone" },
  { type: "whatsapp", icon: Phone, label: "WhatsApp" },
  { type: "email", icon: Mail, label: "Email" },
  { type: "website", icon: Globe, label: "Website" },
  { type: "facebook", icon: Facebook, label: "Facebook" },
  { type: "instagram", icon: Instagram, label: "Instagram" },
  { type: "twitter", icon: Twitter, label: "X/Twitter" },
  { type: "linkedin", icon: Linkedin, label: "LinkedIn" },
];

export default function AdminTeam() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [saving, setSaving] = useState(false);

  // Fetch real team members
  useEffect(() => {
    async function fetchTeam() {
      setLoading(true);
      setError(null);

      const supabase = createClient();

      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
        console.error("Fetch error:", error);
      } else {
        setTeam(data || []);
      }
      setLoading(false);
    }

    fetchTeam();
  }, []);

  const openModal = (member: TeamMember | null = null) => {
    if (member) {
      setCurrentMember(member);
      setName(member.name);
      setRole(member.role);
      setBio(member.bio || "");
      setPhotoUrl(member.photo_url || "");
      setSocials(member.socials || []);
    } else {
      setCurrentMember(null);
      setName("");
      setRole("");
      setBio("");
      setPhotoUrl("");
      setSocials([]);
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!name || !role) {
      setError("Name and Role are required");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const supabase = createClient();

      const memberData = {
        name,
        role,
        bio: bio || null,
        photo_url: photoUrl || null,
        socials: socials.length > 0 ? socials : null,
      };

      let result;

      if (currentMember) {
        result = await supabase
          .from("team_members")
          .update(memberData)
          .eq("id", currentMember.id);
      } else {
        result = await supabase.from("team_members").insert(memberData);
      }

      if (result.error) throw result.error;

      // Refresh list
      const { data } = await supabase
        .from("team_members")
        .select("*")
        .order("created_at", { ascending: false });

      setTeam(data || []);
      setIsModalOpen(false);
    } catch (err: any) {
      setError("Save failed: " + (err.message || "Unknown error"));
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this team member permanently?")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from("team_members").delete().eq("id", id);

      if (error) throw error;

      setTeam(team.filter(m => m.id !== id));
    } catch (err: any) {
      alert("Delete failed: " + (err.message || "Unknown error"));
    }
  };

  const addSocialLink = () => {
    setSocials([...socials, { type: "instagram", url: "" }]);
  };

  const updateSocialLink = (index: number, field: "type" | "url", value: string) => {
    const newSocials = [...socials];
    newSocials[index][field] = value;
    setSocials(newSocials);
  };

  const removeSocialLink = (index: number) => {
    setSocials(socials.filter((_, i) => i !== index));
  };

  const getSocialIcon = (type: SocialLink["type"]) => {
    switch (type) {
      case "phone": return Phone;
      case "whatsapp": return Phone;
      case "email": return Mail;
      case "website": return Globe;
      case "facebook": return Facebook;
      case "instagram": return Instagram;
      case "twitter": return Twitter;
      case "linkedin": return Linkedin;
      default: return Globe;
    }
  };

  return (
    <div className="mt-30 md:mt-20">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Manage Team Members
        </h1>

        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-red-900 text-white px-6 py-3 rounded-xl hover:bg-red-800 transition shadow-md"
        >
          <Plus size={20} />
          Add Member
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="animate-spin mx-auto" size={48} />
          <p className="mt-4 text-gray-600">Loading team members...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-800 p-6 rounded-xl text-center font-medium">
          {error}
        </div>
      ) : team.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          No team members yet. Click "Add Member" to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member) => (
            <div key={member.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 transition hover:shadow-lg">
              <img
                src={member.photo_url || "https://via.placeholder.com/400?text=No+Photo"}
                alt={member.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-gray-600 font-medium">{member.role}</p>
                {member.bio && <p className="text-gray-500 mt-3 line-clamp-3">{member.bio}</p>}

                {/* Social Icons Preview */}
                {member.socials && member.socials.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {member.socials.map((social, idx) => {
                      const Icon = getSocialIcon(social.type);
                      return (
                        <a
                          key={idx}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-red-900 transition"
                        >
                          <Icon size={20} />
                        </a>
                      );
                    })}
                  </div>
                )}

                <div className="mt-6 flex gap-4">
                  <button onClick={() => openModal(member)} className="text-blue-600 hover:text-blue-800">
                    <Edit size={20} />
                  </button>
                  <button onClick={() => handleDelete(member.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-900">
                {currentMember ? "Edit Team Member" : "Add New Team Member"}
              </h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={28} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900"
                  placeholder="Dr. Grace Adebayo"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Role *</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900"
                  placeholder="Founder & Publishing Director"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900 h-32"
                  placeholder="Brief description about their role and contributions..."
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Profile Photo</label>
                <FileDropzone
                  bucket="team-photos"
                  onUploadComplete={(url) => setPhotoUrl(url || "")}
                  currentUrl={photoUrl}
                  accept={{ "image/*": [".png", ".gif", ".jpeg", ".jpg"] }}
                  maxSizeMB={5}
                  label="Drag & drop photo here (JPG/PNG, max 5MB)"
                />
              </div>

              {/* Social Links */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Social & Contact Links</label>
                {socials.map((social, index) => (
                  <div key={index} className="flex gap-4 mb-4 items-center">
                    <select
                      value={social.type}
                      onChange={(e) => updateSocialLink(index, "type", e.target.value as SocialLink["type"])}
                      className="w-40 px-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900"
                    >
                      {socialOptions.map((opt) => (
                        <option key={opt.type} value={opt.type}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      value={social.url}
                      onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                      placeholder="https://instagram.com/..."
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900"
                    />

                    <button
                      onClick={() => removeSocialLink(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addSocialLink}
                  className="text-red-900 hover:text-red-700 font-medium flex items-center gap-2 mt-2"
                >
                  <Plus size={18} /> Add Social/Contact Link
                </button>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-4 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-3 px-8 py-4 bg-red-900 text-white rounded-xl hover:bg-red-800 transition disabled:opacity-50"
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  {saving ? "Saving..." : currentMember ? "Update Member" : "Add Member"}
                </button>
              </div>

              {error && <p className="text-red-600 text-center mt-4">{error}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}