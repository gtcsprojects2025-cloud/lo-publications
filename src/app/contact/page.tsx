"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Send, Mail, MapPin, FileUp } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  messageType: z.enum(["General Inquiry", "Manuscript Submission", "Partnership Opportunity", "Other"]),
  message: z.string().min(10, "Message should be at least 10 characters"),
  attachment: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      messageType: "General Inquiry",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    // Later: Real submission (e.g., to Supabase + trigger email)
    // await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) })
    await new Promise((resolve) => setTimeout(resolve, 1800)); // Simulate

    setSubmitSuccess(true);
    reset();
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 mt-20 md:mt-0 ">
      {/* Hero */}
      <section className="relative py-32 md:py-44 bg-gradient-to-br from-red-900/5 via-white to-red-900/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(185,28,28,0.06)_0%,transparent_60%)]" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-6xl font-bold text-black mb-8 leading-tight"
          >
            Get in Touch
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed"
          >
            At LO Publications, we believe in the power of storytelling. Whether you’re an aspiring author, a seasoned writer,  
            or someone with a compelling narrative to share, we’re here to support your journey from the first word to the final print.
          </motion.p>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">Contact Channels</h2>
              <p className="text-lg text-gray-700 mb-8">
                For questions, collaborations, or general inquiries, reach out through the appropriate channel below:
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="text-red-900 mt-1" size={28} />
                  <div>
                    <p className="text-lg font-medium">General Inquiries</p>
                    <a
                      href="mailto:info@lopublications.com"
                      className="text-red-900 hover:underline text-xl"
                    >
                      info@lopublications.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="text-red-900 mt-1" size={28} />
                  <div>
                    <p className="text-lg font-medium">Manuscript Submissions</p>
                    <a
                      href="mailto:submission@lopublications.com"
                      className="text-red-900 hover:underline text-xl"
                    >
                      submission@lopublications.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="text-red-900 mt-1" size={28} />
                  <div>
                    <p className="text-lg font-medium">Head Office</p>
                    <p className="text-xl text-gray-700">
                      1551 Lycee Place, Ottawa, ON K1G 4B5
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Connect with Us */}
            <div>
              <h3 className="text-2xl font-bold text-black mb-6">Connect with Us</h3>
              <p className="text-lg text-gray-700">
                Join our creative community and stay up to date with the latest news, events, and author spotlights.
              </p>
              <div className="mt-6 flex gap-6">
                {/* Add social icons/links here later */}
              </div>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 md:p-12 rounded-3xl shadow-2xl border border-gray-100"
          >
            <h2 className="text-3xl font-bold text-black mb-10 text-center">
              Quick Message
            </h2>

            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="text-6xl text-red-900 mb-6">✉️</div>
                <h3 className="text-2xl font-bold mb-4">Message Sent!</h3>
                <p className="text-xl text-gray-700">
                  Thank you for reaching out. We'll get back to you soon.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Name *</label>
                  <input
                    {...register("name")}
                    className="w-full px-5 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900"
                    placeholder="Your full name"
                  />
                  {errors.name && <p className="text-red-600 mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full px-5 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900"
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-600 mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Message Type</label>
                  <select
                    {...register("messageType")}
                    className="w-full px-5 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900 bg-white"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Manuscript Submission">Manuscript Submission</option>
                    <option value="Partnership Opportunity">Partnership Opportunity</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Your Message *</label>
                  <textarea
                    {...register("message")}
                    rows={6}
                    className="w-full px-5 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900"
                    placeholder="How can we help you today?"
                  />
                  {errors.message && <p className="text-red-600 mt-1">{errors.message.message}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Attachment (optional)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-900 transition">
                    <FileUp className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600">Upload file (.docx, .pdf, .jpg, .png)</p>
                    <input
                      type="file"
                      accept=".docx,.pdf,.jpg,.png"
                      className="hidden"
                      {...register("attachment")}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-900 text-white py-6 rounded-xl font-bold text-xl hover:bg-red-800 transition shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  {!isSubmitting && <Send size={24} />}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
}