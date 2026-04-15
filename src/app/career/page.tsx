"use client"
import React from 'react';
import Head from 'next/head';

const CareerPage = () => {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-serif selection:bg-stone-200">
      <Head>
        <title>Career | Book Interior Designer & Structural Editor</title>
        <meta name="description" content="Job opening for Book Interior Designer & Structural Editor" />
      </Head>

      {/* Hero Section */}
      <header className="max-w-4xl mx-auto pt-50 pb-12 px-6">
        <div className="border-b border-stone-300 pb-8">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-6 italic">
            Book Interior Designer & Structural Editor
          </h1>
          <div className="flex flex-wrap gap-6 text-sm uppercase tracking-widest font-sans font-medium text-stone-600">
            <span>Location: Hybrid</span>
            <span>Reports to: Lead Editor</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-24 space-y-16">
        
        {/* The Role */}
        <section>
          <h2 className="font-sans font-bold uppercase tracking-widest text-sm text-stone-500 mb-6">The Role</h2>
          <div className="text-xl leading-relaxed text-stone-800 space-y-6">
            <p>
              This role brings together editorial clarity and visual structure. You will shape the internal 
              architecture of our books, turning raw manuscripts into organized, readable, and 
              professionally designed interiors.
            </p>
            <p>
              The work goes beyond layout. You will guide how information flows, how hierarchy is built, 
              and how readers move through content with ease. Every decision you make should improve 
              clarity, consistency, and the overall reading experience.
            </p>
          </div>
        </section>

        <hr className="border-stone-200" />

        {/* Key Responsibilities */}
        <section className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h2 className="font-sans font-bold uppercase tracking-widest text-sm text-stone-500 sticky top-8">
              Key Responsibilities
            </h2>
          </div>
          <div className="md:col-span-2 space-y-10">
            <div>
              <h3 className="text-xl font-semibold mb-3">Interior Structure and Layout</h3>
              <p className="text-stone-700 leading-relaxed">Design and build interior systems that match the tone and complexity of each book. Work with standard prose as well as layered content such as callouts, sidebars, quotes, tables, footnotes, and appendices. Create flexible templates that keep long manuscripts consistent.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Editorial Structure Support</h3>
              <p className="text-stone-700 leading-relaxed">Work closely with authors and editors to improve how content is structured visually. Spot areas where sections need clearer breaks, where hierarchy is weak, or where layout can improve understanding.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Typography and Hierarchy</h3>
              <p className="text-stone-700 leading-relaxed">Apply strong typesetting principles with a clear focus on readability. Build and maintain heading systems, paragraph styles, spacing rules, and alignment standards.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Long Document Management</h3>
              <p className="text-stone-700 leading-relaxed">Handle complex manuscripts using advanced Adobe InDesign features. Build book files, generate tables of contents, manage cross-references, and keep production files clean.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Production Readiness</h3>
              <p className="text-stone-700 leading-relaxed">Prepare print-ready interiors with careful attention to margins, gutters, pagination, and image quality. Ensure all files meet press requirements.</p>
            </div>
          </div>
        </section>

        <hr className="border-stone-200" />

        {/* Skills & Experience */}
        <section className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h2 className="font-sans font-bold uppercase tracking-widest text-sm text-stone-500">Required Skills</h2>
          </div>
          <div className="md:col-span-2 grid sm:grid-cols-2 gap-x-12 gap-y-8 font-sans">
            <div>
              <h4 className="font-bold text-xs uppercase mb-2">Technical</h4>
              <p className="text-sm text-stone-700 italic">Advanced InDesign Expertise, Photoshop, & Illustrator.</p>
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase mb-2">Industry</h4>
              <p className="text-sm text-stone-700 italic">Editorial Awareness & Print Production Knowledge.</p>
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase mb-2">Soft Skills</h4>
              <p className="text-sm text-stone-700 italic">Detail-Oriented Execution & Clear Communication.</p>
            </div>
          </div>
        </section>

        {/* Success Roadmap */}
        <section className="bg-stone-900 text-stone-100 p-8 md:p-12 rounded-sm">
          <h2 className="font-sans font-bold uppercase tracking-widest text-xs text-stone-400 mb-10">What Success Looks Like</h2>
          <div className="space-y-12">
            <div className="flex gap-6">
              <span className="text-3xl font-light text-stone-500">30</span>
              <div>
                <h4 className="text-lg font-medium mb-2">First 30 Days</h4>
                <p className="text-stone-400 text-sm leading-relaxed">You understand and apply the house style. You complete your first manuscript, taking it from a raw Word document to a clean, production-ready interior.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <span className="text-3xl font-light text-stone-500">60</span>
              <div>
                <h4 className="text-lg font-medium mb-2">First 60 Days</h4>
                <p className="text-stone-400 text-sm leading-relaxed">You begin refining templates and improving consistency across titles. You start identifying layout improvements to smooth workflows.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <span className="text-3xl font-light text-stone-500">90</span>
              <div>
                <h4 className="text-lg font-medium mb-2">First 90 Days</h4>
                <p className="text-stone-400 text-sm leading-relaxed">You work closely with editorial on complex titles, building reliable systems that support consistency across future projects.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <footer className="text-center pt-10">
          <button className="bg-green-900 text-stone-50 px-10 py-4 font-sans uppercase tracking-widest text-sm hover:bg-stone-800 transition-colors">
            To apply, send your resume and cover letter to layo@lopublications.com
          </button>
        </footer>

      </main>
    </div>
  );
};

export default CareerPage;