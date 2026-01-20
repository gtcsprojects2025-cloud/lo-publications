// src/app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, FileText, Users, PenTool, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalBlogPosts: 0,
    pendingSubmissions: 0,
    totalTeamMembers: 0,
    recentActivity: [] as Array<{ type: string; title: string; date: string; status?: string }>,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      setError(null);

      const supabase = createClient();

      try {
        // Parallel fetches for speed
        const [booksRes, postsRes, subsRes, teamRes, recentSubsRes] = await Promise.all([
          supabase.from("books").select("id", { count: "exact" }).eq("status", "published"),
          supabase.from("blog_posts").select("id", { count: "exact" }).eq("status", "published"),
          supabase.from("manuscript_submissions").select("id", { count: "exact" }).eq("status", "pending"),
          supabase.from("team_members").select("id", { count: "exact" }),
          supabase
            .from("manuscript_submissions")
            .select("book_title, submitted_at, status")
            .order("submitted_at", { ascending: false })
            .limit(5),
        ]);

        if (booksRes.error) throw booksRes.error;
        if (postsRes.error) throw postsRes.error;
        if (subsRes.error) throw subsRes.error;
        if (teamRes.error) throw teamRes.error;
        if (recentSubsRes.error) throw recentSubsRes.error;

        setStats({
          totalBooks: booksRes.count || 0,
          totalBlogPosts: postsRes.count || 0,
          pendingSubmissions: subsRes.count || 0,
          totalTeamMembers: teamRes.count || 0,
          recentActivity: (recentSubsRes.data || []).map((s) => ({
            type: "Submission",
            title: s.book_title || "Untitled Manuscript",
            date: new Date(s.submitted_at).toLocaleDateString(),
            status: s.status,
          })),
        });
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 md:p-10 mt-30 md:mt-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
          Welcome to the Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Here's what's happening with LO Publications today.
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 p-8 rounded-2xl text-center mb-12">
          <AlertCircle className="mx-auto mb-4" size={48} />
          <h3 className="text-xl font-bold mb-2">Oops!</h3>
          <p>{error}</p>
        </div>
      ) : (
        <>
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <BookOpen className="text-red-900" size={32} />
                <span className="text-sm text-gray-500">Published</span>
              </div>
              <p className="text-4xl font-bold text-gray-900">{stats.totalBooks}</p>
              <p className="text-sm text-gray-600 mt-1">Books</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <PenTool className="text-red-900" size={32} />
                <span className="text-sm text-gray-500">Published</span>
              </div>
              <p className="text-4xl font-bold text-gray-900">{stats.totalBlogPosts}</p>
              <p className="text-sm text-gray-600 mt-1">Blog Posts</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <Clock className="text-yellow-600" size={32} />
                <span className="text-sm text-gray-500">Pending</span>
              </div>
              <p className="text-4xl font-bold text-yellow-700">{stats.pendingSubmissions}</p>
              <p className="text-sm text-gray-600 mt-1">Submissions</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <Users className="text-red-900" size={32} />
                <span className="text-sm text-gray-500">Team</span>
              </div>
              <p className="text-4xl font-bold text-gray-900">{stats.totalTeamMembers}</p>
              <p className="text-sm text-gray-600 mt-1">Members</p>
            </motion.div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Clock className="text-red-900" size={24} /> Recent Activity
              </h2>
            </div>

            {stats.recentActivity.length === 0 ? (
              <div className="p-12 text-center text-gray-600">
                <AlertCircle className="mx-auto mb-4" size={48} />
                <p>No recent activity yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {stats.recentActivity.map((activity, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 hover:bg-gray-50 transition-colors flex justify-between items-center"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="text-red-900" size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          New Submission: <span className="text-red-900">{activity.title}</span>
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(activity.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(activity.status || "pending")}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, label: "Add New Book", href: "/admin/books" },
              { icon: PenTool, label: "Write Blog Post", href: "/admin/blog" },
              { icon: Users, label: "Manage Team", href: "/admin/team" },
              { icon: FileText, label: "View Submissions", href: "/admin/submissions" },
            ].map((action, idx) => (
              <motion.a
                key={action.label}
                href={action.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-red-900 hover:shadow-md transition-all text-center group"
              >
                <action.icon className="w-10 h-10 text-red-900 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-gray-900">{action.label}</p>
              </motion.a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Helper for status badges
function getStatusBadge(status: string) {
  switch (status) {
    case "pending":
      return <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
    case "reviewed":
      return <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Reviewed</span>;
    case "accepted":
      return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Accepted</span>;
    case "rejected":
      return <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
    default:
      return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
  }
}