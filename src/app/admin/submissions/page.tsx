// src/app/admin/submissions/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Eye, Save, X, Loader2, CheckCircle, Clock, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// Type matching your manuscript_submissions table
type Submission = {
  id: string;
  name: string;
  email: string;
  book_title?: string | null;
  bio?: string | null;
  summary?: string | null;
  why_lo?: string | null;
  sample_url?: string | null;  // Private signed URL
  submitted_at: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  notes?: string | null;  // Admin internal notes
};

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState<Submission | null>(null);
  const [status, setStatus] = useState<"pending" | "reviewed" | "accepted" | "rejected">("pending");
  const [notes, setNotes] = useState("");
  const [sampleSignedUrl, setSampleSignedUrl] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  // Fetch all submissions
  useEffect(() => {
    async function fetchSubmissions() {
      setLoading(true);
      setError(null);

      const supabase = createClient();

      const { data, error } = await supabase
        .from("manuscript_submissions")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (error) {
        setError(error.message);
        console.error("Fetch error:", error);
      } else {
        setSubmissions(data || []);
      }
      setLoading(false);
    }

    fetchSubmissions();
  }, []);

  const openModal = async (submission: Submission) => {
    setCurrentSubmission(submission);
    setStatus(submission.status);
    setNotes(submission.notes || "");
    setSampleSignedUrl(null);

    // Generate signed URL for private file (if exists)
    if (submission.sample_url) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.storage
          .from("manuscript-samples")
          .createSignedUrl(submission.sample_url.split("/").pop() || "", 3600); // 1 hour expiry

        if (error) throw error;
        setSampleSignedUrl(data.signedUrl);
      } catch (err: any) {
        console.error("Signed URL error:", err);
      }
    }

    setIsModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!currentSubmission) return;

    setUpdating(true);
    setError(null);

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("manuscript_submissions")
        .update({
          status,
          notes: notes || null,
        })
        .eq("id", currentSubmission.id);

      if (error) throw error;

      // Refresh list
      const { data } = await supabase
        .from("manuscript_submissions")
        .select("*")
        .order("submitted_at", { ascending: false });

      setSubmissions(data || []);
      setIsModalOpen(false);
    } catch (err: any) {
      setError("Update failed: " + (err.message || "Unknown error"));
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
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
  };

  return (
    <div className="mt-30 md:mt-20">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">
        Manuscript Submissions
      </h1>

      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="animate-spin mx-auto" size={48} />
          <p className="mt-4 text-gray-600">Loading submissions...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-800 p-6 rounded-xl text-center font-medium">
          {error}
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          No submissions yet.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Book Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Submitted</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => openModal(sub)}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{sub.name}</div>
                    <div className="text-sm text-gray-500">{sub.email}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{sub.book_title || "—"}</td>
                  <td className="px-6 py-4 text-gray-600">{new Date(sub.submitted_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{getStatusBadge(sub.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <Eye size={20} className="inline text-blue-600" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Modal */}
      {isModalOpen && currentSubmission && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-900">
                Submission: {currentSubmission.book_title || "Untitled"}
              </h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={28} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Submitted By</label>
                  <p className="text-lg text-gray-900">{currentSubmission.name}</p>
                  <p className="text-gray-600">{currentSubmission.email}</p>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">Book Title</label>
                  <p className="text-lg text-gray-900">{currentSubmission.book_title || "—"}</p>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">Submitted On</label>
                  <p className="text-lg text-gray-900">
                    {new Date(currentSubmission.submitted_at).toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Submission["status"])}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {currentSubmission.bio && (
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Author Bio</label>
                  <p className="text-gray-700 whitespace-pre-wrap">{currentSubmission.bio}</p>
                </div>
              )}

              {currentSubmission.summary && (
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Manuscript Summary</label>
                  <p className="text-gray-700 whitespace-pre-wrap">{currentSubmission.summary}</p>
                </div>
              )}

              {currentSubmission.why_lo && (
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Why LO Publications?</label>
                  <p className="text-gray-700 whitespace-pre-wrap">{currentSubmission.why_lo}</p>
                </div>
              )}

              {currentSubmission.sample_url && (
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Sample Chapter / File</label>
                  {sampleSignedUrl ? (
                    <div className="flex flex-col gap-4">
                      <a
                        href={sampleSignedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                      >
                        <Eye size={20} /> View/Download Sample
                      </a>
                      <p className="text-sm text-gray-500">
                        Link expires in 1 hour (regenerate if needed)
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-600">Generating secure link...</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-medium mb-2">Admin Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900 h-32"
                  placeholder="Internal notes, feedback, next steps..."
                />
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-4 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition"
                >
                  Close
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={updating}
                  className="flex items-center gap-3 px-8 py-4 bg-red-900 text-white rounded-xl hover:bg-red-800 transition disabled:opacity-50"
                >
                  {updating ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  {updating ? "Updating..." : "Update Status & Notes"}
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