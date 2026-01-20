"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Books", href: "/books" },
  { name: "Submit Manuscript", href: "/submit" },
  { name: "Blog", href: "/blog" },
  { name: "Team", href: "/team" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-4" : "py-6"
      } backdrop-blur-xl bg-black/10 border-b border-white/10`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo - Glass Bubble */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative px-6 py-3 rounded-full backdrop-blur-2xl bg-white/10 border border-white/20 shadow-xl overflow-hidden group"
            >
              {/* Liquid ripple effect on hover */}
              <span className="absolute inset-0 bg-gradient-to-r from-red-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <span className="absolute inset-0 rounded-full border-2 border-red-900/40 scale-0 group-hover:scale-125 opacity-0 group-hover:opacity-30 transition-all duration-700" />
              <span className="relative text-2xl font-bold text-white drop-shadow-lg">
                LO Publications
              </span>
            </motion.div>
          </Link>

          {/* Desktop Nav - Each item as glass bubble */}
          <nav className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <motion.div
                  whileHover={{ scale: 1.08, y: -4 }}
                  className="relative px-6 py-3 rounded-full backdrop-blur-2xl bg-white/10 border border-white/20 shadow-lg overflow-hidden group cursor-pointer"
                >
                  {/* Ripple / water wave effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700 ease-out" />
                  <span className="absolute inset-0 rounded-full border border-red-900/30 scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-40 transition-all duration-700" />

                  <span className="relative text-white font-medium drop-shadow-md">
                    {link.name}
                  </span>
                </motion.div>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-3 rounded-full backdrop-blur-lg bg-white/10 border border-white/20 hover:bg-white/20 transition"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-black/40 backdrop-blur-xl border-t border-white/10"
        >
          <div className="px-6 py-8 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block text-white text-lg font-medium hover:text-red-400 transition"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
}