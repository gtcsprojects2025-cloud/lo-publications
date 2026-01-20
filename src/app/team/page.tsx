// src/app/team/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Linkedin, Twitter, Globe, Phone, Facebook, Instagram, Loader2} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// Define TypeScript type matching your team_members table
type TeamMember = {
  id: string;
  name: string;
  role: string;
  department?: string | null;
  photo_url?: string | null;
  bio?: string | null;
  socials?: {
    type: "phone" | "whatsapp" | "email" | "website" | "facebook" | "instagram" | "twitter" | "linkedin";
    url: string;
  }[] | null;
};

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Fetch real team members from Supabase
  useEffect(() => {
    async function fetchTeam() {
      setLoading(true);
      setError(null);

      const supabase = createClient();

      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("created_at", { ascending: true }); // or use display_order if you add it later

      if (error) {
        setError("Failed to load team members. Please try again later.");
        console.error("Fetch error:", error);
      } else {
        setTeam(data || []);
      }
      setLoading(false);
    }

    fetchTeam();
  }, []);

  // Icon mapping for social types
  const getSocialIcon = (type: string) => {
    switch (type) {
      case "phone":
      case "whatsapp":
        return Phone;
      case "email":
        return Mail;
      case "website":
        return Globe;
      case "facebook":
        return Facebook;
      case "instagram":
        return Instagram;
      case "twitter":
        return Twitter;
      case "linkedin":
        return Linkedin;
      default:
        return Globe;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-20 md:py-32 mt-20 md:mt-0">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-6">
            Meet Our Team
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto">
            A dedicated family of professionals committed to publishing truth with love, excellence, and obedience.
          </p>
        </motion.div>

        {/* Loading / Error State */}
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="animate-spin mx-auto" size={48} />
            <p className="mt-4 text-gray-600">Loading team members...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-600">
            {error}
          </div>
        ) : team.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            Our team is coming soon!
          </div>
        ) : (
          /* Team Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 md:gap-12">
            {team.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -8 }}
                transition={{ duration: 0.4 }}
                className="group cursor-pointer text-center"
                onClick={() => setSelectedMember(member)}
              >
                <div className="relative mx-auto w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-red-900/30 shadow-lg group-hover:border-red-900 transition-all">
                  <img
                    src={member.photo_url || "https://via.placeholder.com/400?text=No+Photo"}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="mt-6 text-xl font-bold text-black">{member.name}</h3>
                <p className="text-gray-600 font-medium">{member.role}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal for Details */}
        <AnimatePresence>
          {selectedMember && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedMember(null)}
            >
              <motion.div
                initial={{ scale: 0.7, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.7, y: 50 }}
                transition={{ type: "spring", damping: 25 }}
                className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedMember(null)}
                  className="absolute top-6 right-6 z-10 p-3 bg-white/90 rounded-full hover:bg-gray-100 transition shadow-md"
                >
                  <X size={28} className="text-gray-800" />
                </button>

                <div className="p-8 md:p-12">
                  <div className="flex flex-col md:flex-row gap-10">
                    {/* Photo */}
                    <div className="flex-shrink-0">
                      <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-8 border-red-900/20 shadow-xl mx-auto md:mx-0">
                        <img
                          src={selectedMember.photo_url || "https://via.placeholder.com/400?text=No+Photo"}
                          alt={selectedMember.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-6">
                      <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-black">
                          {selectedMember.name}
                        </h2>
                        <p className="text-xl text-red-900 font-medium mt-2">
                          {selectedMember.role}
                        </p>
                        {selectedMember.department && (
                          <p className="text-gray-600 mt-1">{selectedMember.department}</p>
                        )}
                      </div>

                      <p className="text-lg text-gray-700 leading-relaxed">
                        {selectedMember.bio || "No bio available."}
                      </p>

                      {/* Social Links - Only show if they exist */}
                      {selectedMember.socials && selectedMember.socials.length > 0 && (
                        <div className="pt-6 border-t border-gray-200">
                          <h4 className="text-lg font-semibold mb-4">Connect</h4>
                          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                            {selectedMember.socials.map((social, idx) => {
                              const Icon = getSocialIcon(social.type);
                              return (
                                <a
                                  key={idx}
                                  href={social.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 text-gray-700 hover:text-red-900 transition hover:scale-110"
                                  aria-label={social.type}
                                >
                                  <Icon size={28} />
                                  <span className="text-sm font-medium capitalize">{social.type}</span>
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

// Helper function for social icons (add more types as needed)
function getSocialIcon(type: string) {
  switch (type.toLowerCase()) {
    case "phone":
    case "whatsapp":
      return Phone;
    case "email":
      return Mail;
    case "website":
      return Globe;
    case "facebook":
      return Facebook;
    case "instagram":
      return Instagram;
    case "twitter":
    case "x":
      return Twitter;
    case "linkedin":
      return Linkedin;
    default:
      return Globe;
  }
}