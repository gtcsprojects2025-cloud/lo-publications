// src/app/submit/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, Loader2, Send, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Heart, BookOpen, Sparkles, Users } from "lucide-react";
import FileDropzone from "../components/admin/FileDropzone";

// Form schema (validation)
const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  bookTitle: z.string().min(3, "Book title is required"),
  authorBio: z.string().min(50, "Bio must be at least 50 characters"),
  manuscriptSummary: z.string().min(100, "Summary must be at least 100 characters"),
  whyLO: z.string().min(50, "Please tell us why LO Publications (at least 50 characters)"),
  sampleFile: z.any().optional(), // We'll handle file manually
});

type FormData = z.infer<typeof formSchema>;

export default function SubmitManuscriptPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => setFilePreviewUrl(reader.result as string);
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreviewUrl(null);
      }
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const supabase = createClient();

      let sampleUrl: string | null = null;

      // Upload file if provided
      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `submissions/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("manuscript-samples")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        // Get signed URL (private bucket)
        const { data: signedData, error: signedError } = await supabase.storage
          .from("manuscript-samples")
          .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 days expiry

        if (signedError) throw signedError;

        sampleUrl = signedData.signedUrl;
      }

      // Save submission to database
      const { error: insertError } = await supabase.from("manuscript_submissions").insert({
        name: data.fullName,
        email: data.email,
        book_title: data.bookTitle,
        bio: data.authorBio,
        summary: data.manuscriptSummary,
        why_lo: data.whyLO,
        sample_url: sampleUrl,
        status: "pending",
      });

      if (insertError) throw insertError;

      setSubmitSuccess(true);
      reset();
      setFile(null);
      setFilePreviewUrl(null);
    } catch (err: any) {
      setSubmitError(err.message || "Submission failed. Please try again.");
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 mt-20 md:mt-0">
      {/* Hero Section */}
      <section className="relative py-32 md:py-48 bg-gradient-to-br from-red-900/10 to-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(185,28,28,0.08)_0%,transparent_50%)]" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-6xl font-bold text-black leading-tight mb-8"
          >
            Your Story Matters.<br />
            <span className="text-red-900">Let’s Share It With the World.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed"
          >
            If you feel led to write a book rooted in faith, healing, testimony, or truth,  
            we invite you to submit your manuscript. We’re looking for authors who carry a message that stirs the heart, speaks life, and serves a greater purpose.
          </motion.p>
        </div>
      </section>

      {/* What We’re Looking For */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              We Welcome Submissions That Are
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Heart, text: "Spiritually Grounded" },
              { icon: BookOpen, text: "Emotionally Authentic" },
              { icon: Sparkles, text: "Written with Purpose & Passion" },
              { icon: Users, text: "Aligned with Biblical Truth & Transformation" },
            ].map((item, idx) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.15 }}
                className="bg-white p-8 rounded-2xl shadow-lg text-center border border-gray-100 hover:border-red-900/30 hover:shadow-xl transition-all"
              >
                <item.icon className="w-16 h-16 text-red-900 mx-auto mb-6" />
                <p className="text-xl font-semibold text-black">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Genres & How to Submit */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16">
          {/* Left: Genres */}
          <div>
            <h2 className="text-4xl font-bold text-black mb-8">What We Publish</h2>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              We focus on works that inspire and equip readers through:
            </p>
            <ul className="space-y-4 text-lg text-gray-700">
              {[
                "Devotionals",
                "Inspirational nonfiction",
                "Faith-based memoirs",
                "Testimonies",
                "Christian living guides",
                "Poetry and reflective essays",
              ].map((genre) => (
                <li key={genre} className="flex items-center gap-3">
                  <BookOpen className="text-red-900 flex-shrink-0" size={24} />
                  {genre}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-gray-600 italic">
              If your work doesn’t fit one of these but carries a strong spiritual message, feel free to reach out—we’re open to meaningful, mission-driven storytelling.
            </p>
          </div>

          {/* Right: How to Submit */}
          <div>
            <h2 className="text-4xl font-bold text-black mb-8">How to Submit</h2>
            <p className="text-xl text-gray-700 mb-8">
              Submitting your manuscript is simple. Please prepare:
            </p>
            <ol className="space-y-6 text-lg text-gray-700 list-decimal pl-6">
              <li>A brief author bio (including your faith background and writing experience)</li>
              <li>A summary of your manuscript (1–2 paragraphs)</li>
              <li>A sample chapter or 10–15 pages of your manuscript</li>
              <li>Why you believe LO Publications is the right home for your message</li>
            </ol>
            <p className="mt-10 text-lg">
              Fill out the form below — we'll receive your submission securely.
            </p>
          </div>
        </div>
      </section>

      {/* Submission Form */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 md:p-16 rounded-3xl shadow-2xl border border-gray-100"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-12">
              Submit Your Manuscript
            </h2>

            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="text-6xl text-red-900 mb-6">🙏</div>
                <h3 className="text-2xl font-bold mb-4">Thank You!</h3>
                <p className="text-xl text-gray-700">
                  We've received your submission. Our team will prayerfully review it and get back to you soon.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Full Name *</label>
                    <input
                      {...register("fullName")}
                      className="w-full px-5 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900"
                      placeholder="Your name"
                    />
                    {errors.fullName && <p className="text-red-600 mt-1">{errors.fullName.message}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Email Address *</label>
                    <input
                      type="email"
                      {...register("email")}
                      className="w-full px-5 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900"
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-red-600 mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Phone (optional)</label>
                  <input
                    {...register("phone")}
                    className="w-full px-5 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900"
                    placeholder="+234 ..."
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Book Title *</label>
                  <input
                    {...register("bookTitle")}
                    className="w-full px-5 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900"
                    placeholder="Title of your manuscript"
                  />
                  {errors.bookTitle && <p className="text-red-600 mt-1">{errors.bookTitle.message}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Author Bio *</label>
                  <textarea
                    {...register("authorBio")}
                    rows={4}
                    className="w-full px-5 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900"
                    placeholder="Brief bio including faith background and writing experience..."
                  />
                  {errors.authorBio && <p className="text-red-600 mt-1">{errors.authorBio.message}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Manuscript Summary *</label>
                  <textarea
                    {...register("manuscriptSummary")}
                    rows={6}
                    className="w-full px-5 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900"
                    placeholder="1-2 paragraphs summarizing your book..."
                  />
                  {errors.manuscriptSummary && <p className="text-red-600 mt-1">{errors.manuscriptSummary.message}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Why LO Publications? *</label>
                  <textarea
                    {...register("whyLO")}
                    rows={4}
                    className="w-full px-5 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900"
                    placeholder="Why you feel we're the right publisher for your message..."
                  />
                  {errors.whyLO && <p className="text-red-600 mt-1">{errors.whyLO.message}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Upload Sample Chapter (PDF recommended)</label>
                  <div className="mt-2">
                    <FileDropzone
                      bucket="manuscript-samples"
                      onUploadComplete={(url) => {
                        // We'll handle this in onSubmit
                      }}
                      currentUrl={null}
                      accept=".pdf,.doc,.docx"
                      maxSizeMB={20}
                      label="Drag & drop your sample chapter (PDF, DOC, DOCX)"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-900 text-white py-6 rounded-xl font-bold text-xl hover:bg-red-800 transition shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={24} />
                      Submitting...
                    </>
                  ) : (
                    "Submit Your Manuscript"
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* What Happens Next */}
      <section className="py-20 bg-red-900 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">What Happens Next?</h2>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: "1", title: "Review", desc: "Our team will prayerfully read and evaluate your manuscript sample." },
              { step: "2", title: "Follow-Up", desc: "If we feel aligned, we’ll schedule a discovery call to learn more about your message and vision." },
              { step: "3", title: "Next Steps", desc: "If accepted, we’ll guide you through the publishing process—from editing and design to launch and distribution." },
            ].map((item) => (
              <div key={item.step} className="space-y-4">
                <div className="w-20 h-20 rounded-full bg-white/20 mx-auto flex items-center justify-center text-3xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-2xl font-semibold">{item.title}</h3>
                <p className="text-lg opacity-90">{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-16 text-xl font-medium italic">
            Our promise? To treat your work with the care and reverence it deserves.
          </p>
        </div>
      </section>
    </main>
  );
}