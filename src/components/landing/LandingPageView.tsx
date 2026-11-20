import React, { useState } from 'react';
import { Language } from '../../types';
import { BrandLogo } from '../brand/BrandLogo';
import { BamuMascot } from '../brand/BamuMascot';
import { Search, Sparkles, Monitor, ArrowRight, Menu, X, LayoutDashboard } from 'lucide-react';

import heroClassroomPhoto from '../../assets/images/hero_classroom_photo_1794492154909.jpg';
import cardDigitalLibraryPhoto from '../../assets/images/card_digital_library_1794492160448.jpg';
import cardManagementPhoto from '../../assets/images/card_management_rph_1794492156587.jpg';
import cardTeachingResourcesPhoto from '../../assets/images/card_teaching_resources_1794492160351.jpg';
import cardDigitalToolsPhoto from '../../assets/images/card_digital_tools_1794492160088.jpg';

interface LandingPageViewProps {
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  onEnterDashboard: (targetTab?: string) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  language,
  onToggleLanguage,
  onEnterDashboard,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const featureCards = [
    {
      id: 'library',
      image: cardDigitalLibraryPhoto,
      imageAlt:
        language === 'bm'
          ? 'Guru perempuan Malaysia menggunakan komputer riba untuk meneroka sumber digital di bilik darjah'
          : 'Malaysian teacher exploring digital learning resources on a laptop in the classroom',
      barColor: 'bg-[#0099ff]',
      tagColor: 'text-[#0099ff]',
      tag: language === 'bm' ? 'BELAJAR' : 'LEARN',
      title: language === 'bm' ? 'Perpustakaan Digital' : 'Digital Library',
      description:
        language === 'bm'
          ? 'Ikuti tutorial terbimbing, daripada langkah permulaan sehingga meneroka alatan digital dan AI untuk pengajaran.'
          : 'Follow guided tutorials, from getting started to exploring digital tools and AI for teaching.',
      linkText: language === 'bm' ? 'Terokai panduan belajar' : 'Explore learning guides',
      targetTab: 'library',
    },
    {
      id: 'management',
      image: cardManagementPhoto,
      imageAlt:
        language === 'bm'
          ? 'Guru perempuan menyusun rancangan pengajaran harian dan rekod pentaksiran bilik darjah'
          : 'Teacher organising daily lesson plans and classroom assessment records at her desk',
      barColor: 'bg-[#cc310e]',
      tagColor: 'text-[#cc310e]',
      tag: language === 'bm' ? 'RANCANG & TAKSIR' : 'PLAN & ASSESS',
      title: language === 'bm' ? 'Pengurusan' : 'Management',
      description:
        language === 'bm'
          ? 'Sediakan rancangan pengajaran dengan Penjana RPH dan susun pentaksiran bilik darjah melalui PBD.'
          : 'Prepare lesson plans with the RPH Generator and organise classroom assessment with PBD.',
      linkText: language === 'bm' ? 'Terokai alatan pengurusan' : 'Explore management tools',
      targetTab: 'rph-generator',
    },
    {
      id: 'resources',
      image: cardTeachingResourcesPhoto,
      imageAlt:
        language === 'bm'
          ? 'Guru perempuan menyediakan lembaran kerja berwarna-warni dan bahan bantu mengajar'
          : 'Teacher preparing colourful worksheets, flashcards and classroom stationery',
      barColor: 'bg-[#0099ff]',
      tagColor: 'text-[#0099ff]',
      tag: language === 'bm' ? 'SEDIAKAN' : 'PREPARE',
      title: language === 'bm' ? 'Sumber Pengajaran' : 'Teaching Resources',
      description:
        language === 'bm'
          ? 'Dapatkan bahan pengajaran dan sumber bilik darjah untuk menyokong persediaan mengajar.'
          : 'Find teaching materials and classroom resources to support lesson preparation.',
      linkText: language === 'bm' ? 'Lihat sumber pengajaran' : 'Browse resources',
      targetTab: 'resources',
    },
    {
      id: 'tools',
      image: cardDigitalToolsPhoto,
      imageAlt:
        language === 'bm'
          ? 'Guru mengajar murid menggunakan paparan pintar interaktif di dalam bilik darjah'
          : 'Teacher using an interactive display screen with students in a bright classroom',
      barColor: 'bg-[#cc310e]',
      tagColor: 'text-[#cc310e]',
      tag: language === 'bm' ? 'TEROKAI' : 'DISCOVER',
      title: language === 'bm' ? 'Alatan Digital & Glosari' : 'Digital Tools & Glossary',
      description:
        language === 'bm'
          ? 'Terokai platform digital yang berguna dan fahami istilah digital utama melalui glosari.'
          : 'Discover useful digital platforms and understand key digital terms through the glossary.',
      linkText: language === 'bm' ? 'Terokai alatan digital' : 'Discover digital tools',
      targetTab: 'tools',
    },
  ];

  const journeySteps = [
    {
      num: '01',
      numBg: 'bg-[#e6f5ff] text-[#0099ff]',
      iconBg: 'bg-[#e6f5ff] text-[#0099ff]',
      Icon: Search,
      title: language === 'bm' ? 'Terokai' : 'Explore',
      description:
        language === 'bm'
          ? 'Semak imbas tutorial, alatan dan sumber yang sepadan dengan keperluan anda.'
          : 'Browse tutorials, tools and resources that match your needs.',
    },
    {
      num: '02',
      numBg: 'bg-[#fdf2f0] text-[#cc310e]',
      iconBg: 'bg-[#fdf2f0] text-[#cc310e]',
      Icon: Sparkles,
      title: language === 'bm' ? 'Cuba sendiri' : 'Try it',
      description:
        language === 'bm'
          ? 'Ikuti panduan yang jelas dan berlatih mengikut rentak anda sendiri.'
          : 'Follow clear guidance and practise at your own pace.',
    },
    {
      num: '03',
      numBg: 'bg-[#e6f5ff] text-[#0099ff]',
      iconBg: 'bg-[#e6f5ff] text-[#0099ff]',
      Icon: Monitor,
      title: language === 'bm' ? 'Gunakan di kelas' : 'Use it in class',
      description:
        language === 'bm'
          ? 'Bawa kemahiran dan idea baharu anda ke dalam pengajaran harian.'
          : 'Bring your new skills and ideas into your teaching.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfe] text-slate-800 font-sans antialiased selection:bg-[#bae6fd] selection:text-[#062447]">
      {/* =====================================================================
          1. NAVIGATION BAR + 2. LARGE PHOTOGRAPHIC HERO SECTION
      ===================================================================== */}
      <div className="relative bg-[#062447] text-white overflow-hidden">
        {/* Background Realistic Classroom Photograph */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroClassroomPhoto}
            alt={
              language === 'bm'
                ? 'Suasana bilik darjah sekolah menengah di Malaysia bersama guru dan murid menggunakan komputer riba'
                : 'Authentic Malaysian classroom with a welcoming teacher guiding students using laptops'
            }
            className="w-full h-full object-cover object-[68%_center] sm:object-[62%_center] lg:object-center"
          />
          {/* Approved Figma Left-to-Right Deep Slate Readability Overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#062447]/95 via-[#062447]/80 to-[#062447]/35"
            aria-hidden="true"
          />
          {/* Subtle Top and Bottom Vignette for Navbar and Floating Card Contrast */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#062447]/80 via-transparent to-[#062447]/70"
            aria-hidden="true"
          />
        </div>

        {/* 1. Navigation Bar */}
        <header className="relative z-20 border-b border-white/10 bg-[#062447]/45 backdrop-blur-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between gap-4">
            {/* Brand Logo + Learn. Create. Teach. */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-left focus-visible:outline-2 focus-visible:outline-[#0099ff] rounded-xl py-1 cursor-pointer group"
                aria-label="BaMuDi Home"
              >
                <div className="flex items-center gap-2.5">
                  <BrandLogo size="sm" theme="dark" showSubtitle={false} />
                  <span className="hidden sm:inline-block text-[11px] font-medium text-white/75 border-l border-white/20 pl-2.5">
                    {language === 'bm' ? 'Belajar. Cipta. Ajar.' : 'Learn. Create. Teach.'}
                  </span>
                </div>
              </button>
            </div>

            {/* Center Navigation Links (Desktop) */}
            <nav
              aria-label={language === 'bm' ? 'Navigasi Laman Utama' : 'Landing Page Navigation'}
              className="hidden md:flex items-center gap-7 lg:gap-8 text-xs lg:text-sm font-semibold text-white/90"
            >
              <button
                type="button"
                onClick={() => scrollToSection('explore-features')}
                className="min-h-[44px] px-1 hover:text-[#38bdf8] transition-colors cursor-pointer"
              >
                {language === 'bm' ? 'Terokai' : 'Explore'}
              </button>
              <button
                type="button"
                onClick={() => onEnterDashboard('library')}
                className="min-h-[44px] px-1 hover:text-[#38bdf8] transition-colors cursor-pointer"
              >
                {language === 'bm' ? 'Perpustakaan Digital' : 'Digital Library'}
              </button>
              <button
                type="button"
                onClick={() => onEnterDashboard('tools')}
                className="min-h-[44px] px-1 hover:text-[#38bdf8] transition-colors cursor-pointer"
              >
                {language === 'bm' ? 'Alatan Pengajaran' : 'Teaching Tools'}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('why-bamudi')}
                className="min-h-[44px] px-1 hover:text-[#38bdf8] transition-colors cursor-pointer"
              >
                {language === 'bm' ? 'Tentang Kami' : 'About'}
              </button>
            </nav>

            {/* Right Controls: BM | EN, Log in, Get started */}
            <div className="flex items-center gap-3 sm:gap-5">
              {/* BM | EN Toggle */}
              <div
                className="flex items-center text-xs font-bold text-white/80"
                role="group"
                aria-label={language === 'bm' ? 'Pilih Bahasa' : 'Select Language'}
              >
                <button
                  type="button"
                  onClick={() => onToggleLanguage('bm')}
                  aria-pressed={language === 'bm'}
                  className={`min-h-[44px] px-2 transition-colors cursor-pointer ${
                    language === 'bm' ? 'text-white font-extrabold underline underline-offset-4 decoration-[#0099ff]' : 'text-white/65 hover:text-white'
                  }`}
                >
                  BM
                </button>
                <span className="text-white/35 select-none" aria-hidden="true">
                  |
                </span>
                <button
                  type="button"
                  onClick={() => onToggleLanguage('en')}
                  aria-pressed={language === 'en'}
                  className={`min-h-[44px] px-2 transition-colors cursor-pointer ${
                    language === 'en' ? 'text-white font-extrabold underline underline-offset-4 decoration-[#0099ff]' : 'text-white/65 hover:text-white'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Log in (opens teacher dashboard) */}
              <button
                type="button"
                onClick={() => onEnterDashboard('home')}
                className="hidden sm:inline-flex items-center min-h-[44px] px-2 text-xs lg:text-sm font-semibold text-white/90 hover:text-white transition-colors cursor-pointer"
              >
                {language === 'bm' ? 'Log masuk' : 'Log in'}
              </button>

              {/* Get started CTA */}
              <button
                type="button"
                onClick={() => onEnterDashboard('home')}
                className="min-h-[44px] px-4 sm:px-5 py-2 rounded-xl bg-[#0099ff] hover:bg-[#0088ee] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#0099ff]/25 transition-all cursor-pointer active:scale-[0.99]"
              >
                {language === 'bm' ? 'Mula sekarang' : 'Get started'}
              </button>

              {/* Mobile Menu Trigger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                aria-label={
                  mobileMenuOpen
                    ? language === 'bm'
                      ? 'Tutup menu'
                      : 'Close menu'
                    : language === 'bm'
                    ? 'Buka menu'
                    : 'Open menu'
                }
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Collapsible Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-[#062447]/95 backdrop-blur-md border-t border-white/10 px-4 py-4 space-y-1 animate-fadeIn">
              <button
                type="button"
                onClick={() => scrollToSection('explore-features')}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl text-left text-sm font-semibold text-white/90 hover:bg-white/10 transition-colors"
              >
                {language === 'bm' ? 'Terokai' : 'Explore'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onEnterDashboard('library');
                }}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl text-left text-sm font-semibold text-white/90 hover:bg-white/10 transition-colors"
              >
                {language === 'bm' ? 'Perpustakaan Digital' : 'Digital Library'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onEnterDashboard('tools');
                }}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl text-left text-sm font-semibold text-white/90 hover:bg-white/10 transition-colors"
              >
                {language === 'bm' ? 'Alatan Pengajaran' : 'Teaching Tools'}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('why-bamudi')}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl text-left text-sm font-semibold text-white/90 hover:bg-white/10 transition-colors"
              >
                {language === 'bm' ? 'Tentang Kami' : 'About'}
              </button>
              <div className="pt-2 border-t border-white/10 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onEnterDashboard('home');
                  }}
                  className="flex-1 min-h-[44px] px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold text-center"
                >
                  {language === 'bm' ? 'Log masuk Papan Pemuka' : 'Log in to Dashboard'}
                </button>
              </div>
            </div>
          )}
        </header>

        {/* 2. Hero Content Area */}
        <section
          aria-labelledby="landing-hero-heading"
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-12 pb-14 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-end">
            {/* Left Column: Headline, Copy & CTAs */}
            <div className="lg:col-span-7 xl:col-span-7">
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/15 mb-6">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-white/90">
                  {language === 'bm'
                    ? 'RAKAN DIGITAL MESRA UNTUK PARA GURU'
                    : 'A FRIENDLY DIGITAL COMPANION FOR TEACHERS'}
                </span>
              </div>

              {/* Main Headline */}
              <h1
                id="landing-hero-heading"
                className="font-display text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-white leading-[1.08] tracking-tight mb-5 max-w-xl"
              >
                {language === 'bm' ? (
                  <>
                    Jadikan pengajaran digital
                    <br />
                    lebih mudah.
                  </>
                ) : (
                  <>
                    Make digital teaching
                    <br />
                    feel simpler.
                  </>
                )}
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base lg:text-lg text-white/85 font-normal leading-relaxed max-w-lg mb-8">
                {language === 'bm'
                  ? 'Panduan praktikal, sumber pengajaran dan alatan digital untuk membantu setiap guru membina keyakinan, selangkah demi selangkah.'
                  : 'Practical guides, teaching resources and digital tools to help every teacher build confidence, one step at a time.'}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 mb-7">
                <button
                  type="button"
                  onClick={() => onEnterDashboard('home')}
                  className="min-h-[48px] px-6 py-3 rounded-xl bg-[#0099ff] hover:bg-[#0088ee] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#0099ff]/30 transition-all cursor-pointer active:scale-[0.99]"
                >
                  {language === 'bm' ? 'Terokai BaMuDi' : 'Explore BaMuDi'}
                </button>

                <button
                  type="button"
                  onClick={() => onEnterDashboard('library')}
                  className="min-h-[48px] px-6 py-3 rounded-xl bg-white/12 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-sm sm:text-base border border-white/20 transition-all cursor-pointer"
                >
                  {language === 'bm' ? 'Lihat panduan pembelajaran' : 'Browse learning guides'}
                </button>
              </div>

              {/* Supporting Micro-copy */}
              <p className="text-xs sm:text-sm text-white/75 font-medium">
                {language === 'bm'
                  ? 'Untuk setiap guru. Mulakan di tahap anda. Berkembang mengikut rentak sendiri.'
                  : 'For every teacher. Start where you are. Grow at your own pace.'}
              </p>
            </div>

            {/* Right Column: Floating "YOUR LEARNING JOURNEY" Card matching Figma Reference */}
            <div className="lg:col-span-5 xl:col-span-5 flex lg:justify-end">
              <div className="w-full sm:max-w-xs lg:max-w-[320px] bg-[#fdfdfe] text-[#062447] rounded-2xl p-5 sm:p-6 shadow-2xl border border-white/90 flex items-center justify-between gap-4">
                <div>
                  <span className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#cc310e] mb-1.5">
                    {language === 'bm' ? 'PERJALANAN PEMBELAJARAN ANDA' : 'YOUR LEARNING JOURNEY'}
                  </span>
                  <h2 className="font-display text-lg sm:text-xl font-extrabold text-[#062447] leading-snug mb-1">
                    {language === 'bm' ? 'Belajar · Cipta · Ajar' : 'Learn · Create · Teach'}
                  </h2>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {language === 'bm'
                      ? 'Langkah mudah. Idea bilik darjah yang praktikal.'
                      : 'Simple steps. Practical classroom ideas.'}
                  </p>
                </div>
                <div className="shrink-0">
                  <BamuMascot mood="happy" size="sm" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* =====================================================================
          3. INTRODUCTION / WHY BAMUDI ("A SUPPORTIVE SPACE TO GROW")
      ===================================================================== */}
      <section
        id="why-bamudi"
        aria-labelledby="why-bamudi-heading"
        className="bg-[#fdfdfe] py-14 sm:py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
            {/* Left Column: Eyebrow + Headline */}
            <div className="lg:col-span-6">
              <span className="block text-[11px] font-extrabold uppercase tracking-wider text-[#cc310e] mb-3">
                {language === 'bm'
                  ? 'RUANG SOKONGAN UNTUK BERKEMBANG'
                  : 'A SUPPORTIVE SPACE TO GROW'}
              </span>
              <h2
                id="why-bamudi-heading"
                className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#062447] leading-[1.16] tracking-tight max-w-md"
              >
                {language === 'bm' ? (
                  <>
                    Keyakinan digital bermula
                    <br />
                    dengan sedikit bimbingan.
                  </>
                ) : (
                  <>
                    Digital confidence starts
                    <br />
                    with a little guidance.
                  </>
                )}
              </h2>
            </div>

            {/* Right Column: Supporting Paragraph */}
            <div className="lg:col-span-6 lg:pt-6">
              <p className="text-sm sm:text-base lg:text-[17px] text-slate-600 leading-relaxed font-normal max-w-xl">
                {language === 'bm'
                  ? 'BaMuDi menghimpunkan pembelajaran digital yang praktikal, alatan pengajaran dan sumber bilik darjah di satu tempat. Terokai mengikut rentak anda sendiri, cuba apa yang dipelajari dan bina keyakinan langkah demi langkah.'
                  : 'BaMuDi brings practical digital learning, teaching tools and classroom resources together in one place. Explore at your own pace, try what you learn and build confidence step by step.'}
              </p>
            </div>
          </div>

          {/* Subtle Divider & Reassurance Statement */}
          <div className="mt-12 sm:mt-16 pt-6 border-t border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs sm:text-sm font-extrabold text-[#062447]">
              {language === 'bm'
                ? 'Sama ada anda baru bermula atau sudah meneroka alatan digital, sentiasa ada ruang untuk anda berkembang.'
                : 'Whether you are just getting started or already exploring digital tools, there is room for you to grow.'}
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. FOUR PHOTOGRAPHIC FEATURE CARDS ("EXPLORE WHAT YOU CAN DO")
      ===================================================================== */}
      <section
        id="explore-features"
        aria-labelledby="explore-features-heading"
        className="bg-[#e6f5ff] py-14 sm:py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          {/* Section Header */}
          <div className="max-w-xl mb-10 sm:mb-12">
            <span className="block text-[11px] font-extrabold uppercase tracking-wider text-[#cc310e] mb-2.5">
              {language === 'bm'
                ? 'TEROKAI APA YANG BOLEH ANDA LAKUKAN'
                : 'EXPLORE WHAT YOU CAN DO'}
            </span>
            <h2
              id="explore-features-heading"
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#062447] leading-[1.15] tracking-tight mb-3"
            >
              {language === 'bm' ? (
                <>
                  Sokongan praktikal untuk
                  <br />
                  pengajaran harian anda.
                </>
              ) : (
                <>
                  Practical support for your
                  <br />
                  day-to-day teaching.
                </>
              )}
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-slate-600 font-normal">
              {language === 'bm'
                ? 'Alatan dan sumber berguna, dihimpunkan khas untuk para guru.'
                : 'Useful tools and resources, brought together for teachers.'}
            </p>
          </div>

          {/* 4 Photographic Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureCards.map((card) => (
              <article
                key={card.id}
                onClick={() => onEnterDashboard(card.targetTab)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onEnterDashboard(card.targetTab);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`${card.title}: ${card.linkText}`}
                className="group bg-[#fdfdfe] rounded-2xl p-4 sm:p-5 shadow-[0_8px_24px_-6px_rgba(6,36,71,0.06)] hover:shadow-[0_14px_30px_-8px_rgba(0,153,255,0.16)] border border-white flex flex-col justify-between transition-all hover:-translate-y-0.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0099ff]"
              >
                <div>
                  {/* Realistic Photographic Header with Consistent Aspect Ratio & Rounding */}
                  <div className="w-full aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-slate-100">
                    <img
                      src={card.image}
                      alt={card.imageAlt}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Short Horizontal Accent Bar matching Figma */}
                  <div className={`w-7 h-1 rounded-full ${card.barColor} mb-2.5`} aria-hidden="true" />

                  {/* Category Eyebrow */}
                  <span
                    className={`block text-[10px] font-extrabold uppercase tracking-wider ${card.tagColor} mb-1.5`}
                  >
                    {card.tag}
                  </span>

                  {/* Card Title */}
                  <h3 className="font-display text-lg font-extrabold text-[#062447] leading-snug mb-2 group-hover:text-[#0077dd] transition-colors">
                    {card.title}
                  </h3>

                  {/* Card Description */}
                  <p className="text-xs text-slate-600 leading-relaxed font-normal mb-4">
                    {card.description}
                  </p>
                </div>

                {/* Card Footer Link */}
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0099ff] group-hover:text-[#0066cc] transition-colors">
                    <span>{card.linkText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. THREE-STAGE LEARNING JOURNEY ("A SIMPLE WAY TO BEGIN")
      ===================================================================== */}
      <section
        aria-labelledby="learning-journey-heading"
        className="bg-[#fdfdfe] py-14 sm:py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          {/* Section Header */}
          <div className="max-w-xl mb-12 sm:mb-14">
            <span className="block text-[11px] font-extrabold uppercase tracking-wider text-[#cc310e] mb-2.5">
              {language === 'bm' ? 'CARA MUDAH UNTUK BERMULA' : 'A SIMPLE WAY TO BEGIN'}
            </span>
            <h2
              id="learning-journey-heading"
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#062447] leading-[1.15] tracking-tight mb-2.5"
            >
              {language === 'bm' ? 'Terokai. Belajar. Aplikasi.' : 'Explore. Learn. Apply.'}
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-slate-600 font-normal">
              {language === 'bm'
                ? 'Mulakan dengan satu langkah kecil dan bawa apa yang anda pelajari ke dalam bilik darjah.'
                : 'Start with one small step and bring what you learn into your classroom.'}
            </p>
          </div>

          {/* 3 Stages Grid: 01 Explore -> 02 Try it -> 03 Use it in class */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {journeySteps.map((step) => {
              const Icon = step.Icon;
              return (
                <div
                  key={step.num}
                  className="flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-[#fdfdfe] border border-slate-100 sm:border-transparent"
                >
                  <div>
                    {/* Top Row: Number Pill on Left + Circular Icon on Right (Matching Figma) */}
                    <div className="flex items-center justify-between gap-4 mb-5">
                      <span
                        className={`w-10 h-10 rounded-xl ${step.numBg} font-extrabold text-xs flex items-center justify-center shrink-0`}
                      >
                        {step.num}
                      </span>
                      <span
                        className={`w-12 h-12 rounded-full ${step.iconBg} flex items-center justify-center shrink-0`}
                        aria-hidden="true"
                      >
                        <Icon className="w-5 h-5" />
                      </span>
                    </div>

                    {/* Stage Title */}
                    <h3 className="font-display text-lg sm:text-xl font-extrabold text-[#062447] mb-2">
                      {step.title}
                    </h3>

                    {/* Stage Description */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-xs">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. CLOSING CALL-TO-ACTION + 7. FOOTER (Deep Slate #062447)
      ===================================================================== */}
      <div className="bg-[#062447] text-white mt-auto">
        {/* 6. Closing Call-to-Action */}
        <section
          aria-labelledby="closing-cta-heading"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-14 pb-12 sm:pt-20 sm:pb-16"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#7cc8ff] mb-3">
                {language === 'bm' ? 'SEDIA BILA-BILA MASA' : 'READY WHEN YOU ARE'}
              </span>
              <h2
                id="closing-cta-heading"
                className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-[1.15] tracking-tight mb-4"
              >
                {language === 'bm' ? (
                  <>
                    Ambil langkah seterusnya
                    <br />
                    bersama BaMuDi.
                  </>
                ) : (
                  <>
                    Take your next step
                    <br />
                    with BaMuDi.
                  </>
                )}
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-white/75 font-normal leading-relaxed">
                {language === 'bm'
                  ? 'Terokai panduan praktikal dan sumber yang direka untuk menyokong perjalanan pengajaran anda.'
                  : 'Explore practical guides and resources designed to support your teaching journey.'}
              </p>
            </div>

            <div className="shrink-0">
              <button
                type="button"
                onClick={() => onEnterDashboard('library')}
                className="min-h-[48px] px-7 py-3.5 rounded-xl bg-[#0099ff] hover:bg-[#0088ee] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#0099ff]/25 transition-all cursor-pointer active:scale-[0.99]"
              >
                {language === 'bm'
                  ? 'Terokai Perpustakaan Digital'
                  : 'Explore the Digital Library'}
              </button>
            </div>
          </div>
        </section>

        {/* 7. Footer */}
        <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <BrandLogo
                size="sm"
                theme="dark"
                showSubtitle={false}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              />
              <span className="text-xs text-white/65 font-medium">
                {language === 'bm' ? 'Belajar. Cipta. Ajar.' : 'Learn. Create. Teach.'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <p className="text-xs text-white/70 font-normal">
                {language === 'bm'
                  ? 'Rakan pembelajaran digital untuk para guru.'
                  : 'A digital learning companion for teachers.'}
              </p>
              <button
                type="button"
                onClick={() => onEnterDashboard('home')}
                className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-sky-300 hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{language === 'bm' ? 'Papan Pemuka Guru' : 'Teacher Dashboard'}</span>
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
