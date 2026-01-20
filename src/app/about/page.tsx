"use client";

import { motion } from "framer-motion";
import { ArrowRight, Heart, BookOpen, Users, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white mt-20 md:mt-0  via-gray-50 to-white">
      {/* Hero Section - Large, Emotional */}
      <section className="relative py-32 md:py-48 bg-gradient-to-br from-red-900/5 via-white to-red-900/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(185,28,28,0.08)_0%,transparent_50%)]" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-7xl font-bold text-black leading-tight mb-8"
          >
            Creating Stories That <span className="text-red-900">Illuminate the Soul</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed"
          >
            At LO Publications, we believe in the power of words to inspire, uplift, and transform.  
            Whether through deeply personal testimonies, faith-rooted devotionals, or compelling storytelling,  
            our mission is simple and sacred:
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-12 inline-block px-10 py-5 bg-red-900 text-white text-2xl md:text-3xl font-serif italic rounded-xl shadow-lg"
          >
            To publish truth with love and purpose.
          </motion.div>
        </div>
      </section>

      {/* We Don’t Just Publish — We Amplify */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              We Don’t Just Publish Books—<br />
              <span className="text-red-900">We Amplify Voices</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Voices with depth, honesty, and the power to bring healing, hope, and spiritual growth to others.  
              Our authors carry a message that matters, and we’re here to help it reach the world.
            </p>
          </motion.div>

          {/* Three Pillars - Creative Cards */}
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: Heart,
                title: "Faith-Inspired Purpose",
                desc: "Every project we take on is covered in prayer and guided by purpose. We’re committed to stories that align with truth, love, and God’s calling.",
              },
              {
                icon: Sparkles,
                title: "Excellence with Integrity",
                desc: "From first draft to final publication, we uphold the highest editorial standards—delivering work that’s clear, powerful, and purpose-filled.",
              },
              {
                icon: Users,
                title: "Empowering Authors",
                desc: "We walk with our authors at every step. Whether you’re an established voice or new to writing, we’re here to elevate your message with care and clarity.",
              },
            ].map((pillar, idx) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.2 }}
                className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-red-900/30 transition-all group"
              >
                <pillar.icon className="w-16 h-16 text-red-900 mb-6 mx-auto group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold text-black mb-4 text-center">{pillar.title}</h3>
                <p className="text-gray-700 text-center">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Publish */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-black mb-8"
          >
            What We Publish
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-700 mb-10 max-w-3xl mx-auto"
          >
            Our focus is clear. We specialize in books that are:
          </motion.p>

          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.3 } },
            }}
            className="space-y-6 text-left max-w-2xl mx-auto"
          >
            {[
              "Spiritually grounded",
              "Emotionally honest",
              "Purposefully written",
            ].map((item) => (
              <motion.li
                key={item}
                variants={{
                  hidden: { opacity: 0, x: -30 },
                  visible: { opacity: 1, x: 0 },
                }}
                className="flex items-center gap-4 text-xl md:text-2xl font-medium"
              >
                <BookOpen className="text-red-900 flex-shrink-0" size={32} />
                <span>{item}</span>
              </motion.li>
            ))}
          </motion.ul>

          <p className="mt-12 text-lg text-gray-600 max-w-3xl mx-auto">
            From inspirational memoirs and devotionals to transformative nonfiction and poetic reflections,  
            our catalogue reflects the beauty and complexity of the human spirit—through the lens of faith and hope.
          </p>
        </div>
      </section>

      {/* Why Choose Us + Call to Action */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-black mb-8"
          >
            Why Choose LO Publications?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Plenty of publishers exist. Few walk with you like we do. We take the time to understand your message,  
            honor your vision, and refine your work until it shines. With us, you're not just signing a contract—  
            you’re stepping into a mission.
          </motion.p>

          <div className="space-y-8">
            <Link
              href="/submit"
              className="inline-flex items-center px-12 py-6 bg-red-900 text-white font-bold text-xl rounded-xl hover:bg-red-800 transition shadow-2xl group"
            >
              Let’s Create Something Eternal
              <ArrowRight className="ml-4 group-hover:translate-x-2 transition-transform" size={28} />
            </Link>

            <p className="text-lg text-gray-600 italic">
              Do you have a message? A story that keeps stirring your soul?  
              We’d love to hear it.
            </p>
          </div>
        </div>
      </section>

      {/* LO Meaning + Connect */}
      <section className="py-20 bg-red-900 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-serif italic mb-8"
          >
            What LO Means
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-medium max-w-4xl mx-auto leading-relaxed"
          >
            “LO” stands for <span className="underline decoration-white/40">Love & Obedience</span>.  
            It's our daily reminder: Every story we steward is done in love—and in obedience to the calling we've been given.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-16 flex flex-wrap justify-center gap-8 text-lg"
          >
            <Link href="/books" className="hover:underline">Explore Our Books</Link>
            <Link href="/submit" className="hover:underline">Submit Your Manuscript</Link>
            <Link href="#" className="hover:underline">Follow us on Instagram</Link>
            <Link href="#" className="hover:underline">Join our newsletter</Link>
          </motion.div>

          <p className="mt-16 text-xl font-medium">
            LO Publications: Real stories. Deep faith. Bold love.
          </p>
        </div>
      </section>
    </main>
  );
}