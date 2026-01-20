// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Calendar, Loader2, ChevronLeft, ChevronRight, Quote, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PenTool, ShieldCheck, Layout, MessageSquare, Upload, Edit, Image, Globe, Rocket, Star, Headphones } from "lucide-react";

// Types for real data
type Book = {
  id: string;
  title: string;
  author: string;
  cover_url?: string | null;
  published_year?: number | null;
};

type Testimonial = {
  id: string;
  author: string;
  role?: string | null;
  quote: string;
  avatar_url?: string | null;
  rating: number;
};

const tickerText = "100+ Published Titles • Author-Centric Process • Fast Turnaround Times • Global Distribution Support • Faith-Friendly, Values-Aligned Publishing • Your Story Deserves Excellence • ";

export default function Home() {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simple contact form state
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  // Carousel state for testimonials
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch latest 4 published books
  useEffect(() => {
    async function fetchFeaturedBooks() {
      setLoadingBooks(true);
      const supabase = createClient();

      const { data, error } = await supabase
        .from("books")
        .select("id, title, author, cover_url, published_year")
        .order("published_year", { ascending: false })
        .order("created_at", { ascending: false }) // Add a secondary order for consistent results
        .limit(4);

      if (error) {
        console.error("Books fetch error:", error);
        setError("Failed to load featured books");
      } else {
        setFeaturedBooks(data || []);
      }
      setLoadingBooks(false);
    }

    fetchFeaturedBooks();
  }, []);

  // Fetch all testimonials
  useEffect(() => {
    async function fetchTestimonialsData() {
      setLoadingTestimonials(true);
      const supabase = createClient();

      const { data, error } = await supabase
        .from("testimonials")
        .select("id, author, role, quote, avatar_url, rating")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Testimonials fetch error:", error);
        setError("Failed to load testimonials");
      } else {
        setTestimonials(data || []);
      }
      setLoadingTestimonials(false);
    }

    fetchTestimonialsData();
  }, []);

  // Simple form submit (simulated - later replace with real email function)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    setFormSuccess(false);

    // TODO: Replace with real Supabase Edge Function or API route to send email
    setTimeout(() => {
      setFormSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      setFormLoading(false);
    }, 1500);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Carousel navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <main className="min-h-screen mt-20 md:mt-0">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-red-900/10 via-white to-black/5 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/book.jpg')] bg-cover bg-center opacity-10" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 lg:py-32 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-black">
              Publish Your Story with <span className="text-red-900">Excellence</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-lg">
              We help authors turn manuscripts into beautifully crafted books — print & digital, visible worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#services" className="inline-flex items-center justify-center px-8 py-4 bg-red-900 text-white font-semibold rounded-lg hover:bg-red-800 transition shadow-lg">
                How It Works <ArrowRight className="ml-2" size={20} />
              </a>
              <a href="/books" className="inline-flex items-center justify-center px-8 py-4 border-2 border-red-900 text-red-900 font-semibold rounded-lg hover:bg-red-50 transition">
                Check Our Books <BookOpen className="ml-2" size={20} />
              </a>
            </div>
          </motion.div>

          {/* Contact Form (replaced manuscript submission) */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
            <h2 className="text-2xl font-bold text-red-900 mb-6">Get in Touch</h2>

            {formSuccess ? (
              <div className="text-center py-8 text-green-600 font-medium">
                Message sent successfully! We'll get back to you soon.
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Full Name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900"
                  required
                  disabled={formLoading}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="Email Address"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900"
                  required
                  disabled={formLoading}
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  placeholder="Your message..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-900"
                  required
                  disabled={formLoading}
                />
                {formError && <p className="text-red-600 text-sm">{formError}</p>}
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full bg-red-900 text-white py-4 rounded-lg font-semibold hover:bg-red-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {formLoading ? <Loader2 className="animate-spin" size={20} /> : null}
                  {formLoading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Tiny Ticker */}
      <div className="bg-red-900 text-white py-3 overflow-hidden whitespace-nowrap">
        <motion.div
          className="inline-block text-sm md:text-base font-medium"
          animate={{ x: ["0%", "-100%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {tickerText.repeat(4)}
        </motion.div>
      </div>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">What We Do</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive publishing services designed to bring your vision to life with professionalism and care.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {[
              { icon: BookOpen, title: "Book Publishing (Print & Digital)", desc: "Seamless production with global reach." },
              { icon: PenTool, title: "Editing & Proofreading", desc: "Expert polishing for flawless prose." },
              { icon: ShieldCheck, title: "ISBN & Copyright Assistance", desc: "Full legal protection and registration." },
              { icon: Layout, title: "Cover Design & Formatting", desc: "Stunning, market-ready visuals." },
              { icon: MessageSquare, title: "Publishing Coaching & Strategy", desc: "Personalized guidance from start to launch." },
            ].map((service, idx) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:border-red-900/40 hover:shadow-2xl transition-all group"
              >
                <div className="p-6 text-center">
                  <service.icon className="w-12 h-12 text-red-900 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold text-black mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a href="/services" className="inline-flex items-center px-8 py-4 bg-red-900 text-white font-semibold rounded-lg hover:bg-red-800 transition shadow-md">
              Explore Our Services <ArrowRight className="ml-2" size={20} />
            </a>
          </div>
        </div>
      </section>

 {/* Advertisement Banner - Expert Services */}
      <section className="py-7 md:h-[350] bg-gradient-to-r from-red-900 to-red-800 text-white">
        <div className=" mx-auto pl-6 flex md:flex-row flex-col">
            <div className="max-w-7xl md:w-[200%] mx-auto px-6 text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold">Expert Services</h2>
            <h3 className="text-2xl md:text-3xl font-semibold">Tailored for Every Author</h3>
            <p className="text-xl max-w-3xl mx-auto">
              Self-publishing a book becomes simple. Transform your ideas into professional literature with our fantasy, romance, sci-fi, and children’s book publishing expertise.
            </p>

            <div className="flex flex-col sm:flex-row  gap-6 mt-8">
              <a
                href="#chat" // or live chat integration later
                className="inline-flex items-center px-5 py-2 bg-white text-red-900 font-semibold text-md rounded-lg hover:bg-gray-100 transition shadow-lg"
              >
                <MessageCircle className="mr-3" size={20} />
                LIVE CHAT
              </a>
              <a
                href="tel:+14155049548"
                className="inline-flex items-center px-10 py-2 bg-transparent border-2 border-white text-white font-semibold text-md rounded-lg hover:bg-white/10 transition"
              >
                <Headphones className="mr-3" size={20} />
                Call Us: (415) 504-9548
              </a>
            </div>
          </motion.div>
        </div>
<img
              src="/book.jpg" // Elegant open book + red light (placeholder)
              alt="Professional book publishing workspace"
              className="w-full h-80 md:h-96 object-cover"
            />        

        </div>
      
      </section>

        {/* Why Choose Us - Wavy Connected Timeline */}
    <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your story deserves the best — we guide you through every step with expertise and care.
            </p>
          </motion.div>

          {/* Horizontal Chain Container */}
          <div className="relative">
            {/* Mobile: Stack vertically */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-12 md:gap-8 relative">
              {[
                {
                  number: "1",
                  title: "Manuscript Submission",
                  desc: "Share your manuscript or idea with us to begin your publishing journey.",
                  icon: Upload,
                },
                {
                  number: "2",
                  title: "Editing & Formatting",
                  desc: "Our editors refine your content and format it for both print and digital platforms.",
                  icon: Edit,
                },
                {
                  number: "3",
                  title: "Cover Design",
                  desc: "We craft a professional book cover according to your unique preferences.",
                  icon: Image,
                },
                {
                  number: "4",
                  title: "Branding",
                  desc: "If needed, our team builds a high-end author website and branding.",
                  icon: Globe,
                },
                {
                  number: "5",
                  title: "Publishing",
                  desc: "Finally, your book is published with ISBN via Amazon & major platforms.",
                  icon: Rocket,
                },
              ].map((step, idx) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: idx * 0.15 }}
                  className="flex flex-col items-center text-center relative z-10"
                >
                  {/* Connected Circle */}
                  <div className="relative">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-red-900 text-white flex items-center justify-center shadow-2xl border-8 border-red-800 relative z-20">
                      <div className="text-center">
                        <step.icon className="w-10 h-10 md:w-14 md:h-14 mx-auto mb-2" />
                        <span className="text-2xl md:text-3xl font-bold">{step.number}</span>
                      </div>
                    </div>

                    {/* Overlap/Connection effect - pseudo line to next */}
                    {idx < 4 && (
                      <div className="hidden md:block absolute top-1/2 -right-16 w-32 h-1 bg-red-900/40 transform translate-y-1/2 z-0" />
                    )}
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-xl md:text-2xl font-bold text-red-900 mt-6 mb-3">{step.title}</h3>
                  <p className="text-gray-700 max-w-xs">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books - Real Latest 4 */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Featured Books</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our latest and most celebrated titles — stories that inspire, empower, and captivate.
            </p>
          </motion.div>

          {loadingBooks ? (
            <div className="text-center py-12">
              <Loader2 className="animate-spin mx-auto" size={48} />
              <p className="mt-4 text-gray-600">Loading featured books...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">{error}</div>
          ) : featuredBooks.length === 0 ? (
            <div className="text-center py-12 text-gray-600">No featured books yet. Check back soon!</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {featuredBooks.map((book) => (
                <motion.a
                  key={book.id}
                  href={`/books/${book.id}`} // Link to book detail page if you have one
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  whileHover={{ scale: 1.03, y: -8 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer"
                >
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={book.cover_url || "https://via.placeholder.com/800x800?text=No+Cover"}
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-black mb-2 line-clamp-2">{book.title}</h3>
                    <p className="text-gray-600 mb-3">by {book.author}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={16} /> {book.published_year || "N/A"}
                      </span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <a href="/books" className="inline-flex items-center px-10 py-5 bg-red-900 text-white font-semibold text-lg rounded-full hover:bg-red-800 transition shadow-xl group">
              View All Books <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" size={24} />
            </a>
          </div>
        </div>
      </section>

       {/* Transform Your Manuscript Banner - Styled like your reference, Image Left */}
      <section className="py-7 md:h-[350] bg-gradient-to-r from-red-900 to-red-800 text-white">
        <div className="mx-auto pl-6 flex md:flex-row flex-col items-center gap-[20]">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="w-full md:w-1/2 rounded-xl overflow-hidden shadow-2xl"
          >
            <img
              src="/book.jpg" // Or your /book.jpg
              alt="Author holding published book"
              className="w-full h-64 md:h-80 object-cover"
            />
          </motion.div>

          {/* Right: Text & CTAs */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full md:w-1/2 px-6 md:px-0 text-left space-y-6"
          >
            <h2 className="text-xl md:text-3xl font-bold leading-tight">
              Turn Your Manuscript Into a <span className="underline decoration-white/40">Published Masterpiece</span>
            </h2>

            <p className="text-xl">
              From raw ideas to global shelves — we make self-publishing effortless, professional, and impactful.
            </p>

            <p className="text-lg opacity-90">
              Whether it's your first book or your next bestseller, our expert team handles editing, design, distribution, and more — so you focus on what you love: writing.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 mt-6">
              <a
                href="/submit"
                className="inline-flex items-center px-4 py-2 bg-white text-red-900 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg"
              >
                <MessageCircle className="mr-3" size={24} />
                Submit Your Manuscript Now
              </a>

              <a
                href="/books"
                className="inline-flex items-center px-4 py-2 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition"
              >
                See Published Works
                <ArrowRight className="ml-3" size={24} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Testimonials Carousel - Real Data, Responsive (3+ on desktop, 1 on mobile) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">What People Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from authors who've trusted us with their stories — real experiences, real impact.
            </p>
          </motion.div>

          {loadingTestimonials ? (
            <div className="text-center py-12">
              <Loader2 className="animate-spin mx-auto" size={48} />
              <p className="mt-4 text-gray-600">Loading testimonials...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">{error}</div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12 text-gray-600">No testimonials yet.</div>
          ) : (
            <div className="relative">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {testimonials.map((t) => (
                    <div key={t.id} className="w-full flex-shrink-0 px-4">
                      <div className="bg-white p-10 md:p-12 rounded-3xl shadow-2xl border border-gray-100 text-center relative group hover:shadow-red-900/10 transition-shadow">
                        <Quote className="absolute top-6 left-8 w-16 h-16 text-red-900/20" />

                        <p className="text-xl md:text-2xl text-gray-800 italic mb-8 leading-relaxed">
                          "{t.quote}"
                        </p>

                        <div className="flex flex-col items-center">
                          <img
                            src={t.avatar_url || "https://via.placeholder.com/100?text=Avatar"}
                            alt={t.author}
                            className="w-20 h-20 rounded-full object-cover border-4 border-red-900 mb-4 shadow-md group-hover:scale-110 transition-transform"
                          />
                          <h4 className="text-xl font-bold text-black">{t.author}</h4>
                          {t.role && <p className="text-gray-600">{t.role}</p>}
                        </div>

                        <div className="flex justify-center mt-4">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={18}
                              className={i < t.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 p-4 bg-white/80 rounded-full shadow-md hover:bg-white transition disabled:opacity-50"
                disabled={currentSlide === 0}
              >
                <ChevronLeft className="text-red-900" size={28} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-4 bg-white/80 rounded-full shadow-md hover:bg-white transition disabled:opacity-50"
                disabled={currentSlide === testimonials.length - 1}
              >
                <ChevronRight className="text-red-900" size={28} />
              </button>

              {/* Dots for navigation (optional) */}
              <div className="flex justify-center gap-3 mt-8">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentSlide === idx ? "bg-red-900 w-6" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

        {/* Meet Our Team - Text Left + Scattered Circular Avatars Right */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text + CTA */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8 text-left"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight">
                Meet Our Team
              </h2>

              <p className="text-xl md:text-2xl text-gray-700 max-w-xl">
                Empowering authors with excellence. At LO Publications, we offer a full suite of publishing services tailored for authors, entrepreneurs, educators, and thought leaders.
              </p>

              <p className="text-lg text-gray-600">
                Whether you’re publishing your first book or your fifth, our passionate team helps you turn ideas into impact with creativity, professionalism, and care.
              </p>

              <div className="mt-10">
                <a
                  href="/team"
                  className="inline-flex items-center px-10 py-5 bg-red-900 text-white font-semibold text-lg rounded-xl hover:bg-red-800 transition shadow-xl group"
                >
                  View Full Team
                  <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" size={24} />
                </a>
              </div>
            </motion.div>

            {/* Right: Scattered Circular Avatars */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, staggerChildren: 0.15 }}
              className="relative h-[500px] md:h-[600px] flex justify-center items-center"
            >
              {/* Scattered layout - positions are approximate, adjust as needed */}
              {/* Top row - 2 people */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="absolute top-0 left-10 md:left-20"
              >
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-red-900 shadow-xl hover:scale-110 transition-transform">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    alt="Team Member 1"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="absolute top-8 right-10 md:right-32"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-red-900 shadow-xl hover:scale-110 transition-transform">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    alt="Team Member 2"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              {/* Middle row - 3 people */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="absolute top-1/3 left-0 md:left-16"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-red-900 shadow-xl hover:scale-110 transition-transform">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    alt="Team Member 3"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-red-900 shadow-2xl hover:scale-110 transition-transform">
                  <img
                    src="https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    alt="Team Member 4 - Center"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="absolute top-1/3 right-0 md:right-16"
              >
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-red-900 shadow-xl hover:scale-110 transition-transform">
                  <img
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    alt="Team Member 5"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              {/* Bottom row - 3 people */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="absolute bottom-0 left-12 md:left-28"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-red-900 shadow-xl hover:scale-110 transition-transform">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    alt="Team Member 6"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="absolute bottom-16 left-1/3 md:left-1/2 transform -translate-x-1/2"
              >
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-red-900 shadow-xl hover:scale-110 transition-transform">
                  <img
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    alt="Team Member 7"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="absolute bottom-0 right-10 md:right-24"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-red-900 shadow-xl hover:scale-110 transition-transform">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    alt="Team Member 8"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>


    </main>
  );
}

























