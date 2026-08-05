'use client'

import { motion, Variants } from 'framer-motion';
import PublicLayout from '@/components/layout/PublicLayout';
import {
  Award, BookOpen, Users, Building, Laptop, Target,
  GraduationCap, MapPin, Phone, Mail, Wifi, Microscope,
  Trophy, Lightbulb, Globe, CheckCircle2, Star, FlaskConical,
} from 'lucide-react';

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const ugPrograms = [
  'B.E. Computer Science & Engineering',
  'B.E. Computer Science & Engineering (AI & ML)',
  'B.Tech Information Technology',
  'B.Tech Artificial Intelligence & Data Science',
  'B.E. Electronics & Communication Engineering',
  'B.E. Electrical & Electronics Engineering',
  'B.E. Mechanical Engineering',
  'B.E. Civil Engineering',
];

const pgPrograms = ['MBA', 'MCA'];

const facilities = [
  { icon: Laptop, label: 'Smart Classrooms' },
  { icon: FlaskConical, label: 'Modern Laboratories' },
  { icon: BookOpen, label: 'Central Library' },
  { icon: Wifi, label: 'Wi-Fi Campus' },
  { icon: Users, label: "Boys' & Girls' Hostels" },
  { icon: Globe, label: 'Transport Facilities' },
  { icon: Trophy, label: 'Sports Grounds' },
  { icon: Microscope, label: 'Auditorium & Seminar Halls' },
  { icon: Star, label: 'Placement & Training Cell' },
  { icon: Building, label: 'Cafeteria' },
];

const studentActivities = [
  'IEEE Student Branch',
  'NSS (National Service Scheme)',
  'Sports & Athletics',
  'Cultural Events',
  'Technical Symposiums',
  'Hackathons',
  'Entrepreneurship Activities',
];

export default function AboutPage() {
  return (
    <PublicLayout>
      <div className="min-h-screen text-white pb-24">

        {/* ── PAGE HERO ── */}
        <section className="relative pt-32 pb-20 flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-sky-900/10 blur-3xl z-0" />
          <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-sky-500/10 rounded-full blur-[120px] float-animation" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] float-animation" style={{ animationDelay: '2s' }} />

          <div className="container-xl relative z-10 text-center px-4">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={revealVariants}>
                <span className="inline-block section-badge mb-4 px-4 py-1 rounded-full text-sky-400 bg-sky-400/10 border border-sky-400/20 text-xs tracking-widest uppercase font-semibold">
                  Home / About
                </span>
              </motion.div>
              <motion.h1
                variants={revealVariants}
                className="text-5xl md:text-7xl font-black gradient-text mb-6 tracking-tight"
              >
                About INFOGRAM&apos;26
              </motion.h1>
              <motion.p variants={revealVariants} className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                Discover the legacy, the vision, and the passion that drives Tamil Nadu&apos;s premier national-level technical symposium.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* ── ABOUT COLLEGE ── */}
        <section className="section-padding container-xl px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={revealVariants}
            className="glass-card p-8 md:p-12 rounded-3xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left: Text */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-sky-400/10 flex items-center justify-center">
                    <Building className="w-5 h-5 text-sky-400" />
                  </div>
                  <h2 className="text-3xl font-bold">About the College</h2>
                </div>
                <p className="text-white/70 leading-relaxed mb-4">
                  C. Abdul Hakeem College of Engineering &amp; Technology (CAHCET) is a private, self-financing engineering college located in Hakeem Nagar, Melvisharam, Ranipet District, Tamil Nadu. It was established in <strong className="text-white">1998</strong> by the <strong className="text-white">Melvisharam Muslim Educational Society (MMES)</strong> — founded in 1918 by Nawab C. Abdul Hakeem.
                </p>
                <p className="text-white/70 leading-relaxed mb-6">
                  The institution is affiliated with <strong className="text-white">Anna University, Chennai</strong>, approved by <strong className="text-white">AICTE</strong>, and stands as a premier minority institution committed to academic excellence and industry-ready graduates. The college proudly follows its motto: <em className="text-sky-400 font-semibold">"Enter to Learn, Leave to Serve."</em>
                </p>

                {/* Contact strip */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2 text-white/60">
                    <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span>Hakeem Nagar, Melvisharam, Ranipet District, Tamil Nadu – 632 509</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>+91 4172 267387</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>info@cahcet.edu.in</span>
                  </div>
                </div>
              </div>

              {/* Right: Stats grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: BookOpen, value: '1998', label: 'Established' },
                  { icon: Award, value: 'AICTE', label: 'Approved' },
                  { icon: GraduationCap, value: '10+', label: 'Programs' },
                  { icon: Users, value: 'Anna Univ.', label: 'Affiliated To' },
                ].map(({ icon: Icon, value, label }) => (
                  <div key={label} className="glass-card p-5 rounded-2xl flex flex-col items-center text-center">
                    <Icon className="w-6 h-6 text-sky-400 mb-2" />
                    <span className="text-xl font-bold text-white leading-tight">{value}</span>
                    <span className="text-xs text-white/50 mt-1">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── COURSES OFFERED ── */}
        <section className="section-padding container-xl px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={revealVariants}
            className="text-center mb-10"
          >
            <span className="section-badge inline-block mb-3 px-4 py-1 rounded-full text-sky-400 bg-sky-400/10 border border-sky-400/20 text-xs tracking-widest uppercase font-semibold">
              Academics
            </span>
            <h2 className="text-4xl font-bold gradient-text">Courses Offered</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* UG Programs */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={revealVariants}
              className="glass-card p-8 rounded-3xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-sky-400/10 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-sky-400" />
                </div>
                <h3 className="text-xl font-bold">Undergraduate (UG)</h3>
              </div>
              <ul className="space-y-3">
                {ugPrograms.map((prog) => (
                  <li key={prog} className="flex items-start gap-3 text-white/70 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span>{prog}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* PG + Placements */}
            <div className="flex flex-col gap-8">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={revealVariants}
                className="glass-card p-8 rounded-3xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-purple-400/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold">Postgraduate (PG)</h3>
                </div>
                <ul className="space-y-3">
                  {pgPrograms.map((prog) => (
                    <li key={prog} className="flex items-start gap-3 text-white/70 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span>{prog}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Placements highlight */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={revealVariants}
                className="glass-card p-8 rounded-3xl border border-sky-400/20 bg-sky-400/5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-xl font-bold">Placements</h3>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">
                  The UG Batch of 2026 achieved <strong className="text-sky-400">100% placement</strong> with students placed across multiple departments through campus recruitment. The institution reports strong industry engagement with top recruiters across IT, Core Engineering, and Management sectors.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── ABOUT DEPARTMENT ── */}
        <section className="section-padding container-xl px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariants}
            className="glass-card p-8 md:p-12 rounded-3xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
                {[
                  { icon: Target, value: 'B.Tech IT', label: 'Flagship Program' },
                  { icon: Users, value: '15+', label: 'Expert Faculty' },
                  { icon: Laptop, value: '6+', label: 'State-of-art Labs' },
                  { icon: GraduationCap, value: '500+', label: 'Alumni Network' },
                ].map(({ icon: Icon, value, label }) => (
                  <div key={label} className="glass-card p-5 rounded-2xl flex flex-col items-center text-center">
                    <Icon className="w-6 h-6 text-sky-400 mb-2" />
                    <span className="text-lg font-bold text-white leading-tight">{value}</span>
                    <span className="text-xs text-white/50 mt-1">{label}</span>
                  </div>
                ))}
              </div>
              <div className="order-1 lg:order-2">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-sky-400/10 flex items-center justify-center">
                    <Laptop className="w-5 h-5 text-sky-400" />
                  </div>
                  <h2 className="text-3xl font-bold">Department of IT</h2>
                </div>
                <p className="text-white/70 leading-relaxed mb-4">
                  The Department of Information Technology at CAHCET offers the <strong className="text-white">B.Tech Information Technology</strong> program, designed to produce industry-ready professionals skilled in software development, networking, data science, and AI-driven technologies.
                </p>
                <p className="text-white/70 leading-relaxed">
                  With state-of-the-art laboratories, a highly qualified faculty team, and strong industry partnerships, the department fosters hands-on learning and research culture. It is the proud organizer of <strong className="text-sky-400">INFOGRAM&apos;26</strong> — the annual National Level Technical Symposium.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── CAMPUS FACILITIES ── */}
        <section className="section-padding container-xl px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariants}
            className="text-center mb-10"
          >
            <span className="section-badge inline-block mb-3 px-4 py-1 rounded-full text-sky-400 bg-sky-400/10 border border-sky-400/20 text-xs tracking-widest uppercase font-semibold">
              Infrastructure
            </span>
            <h2 className="text-4xl font-bold gradient-text">Campus Facilities</h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
          >
            {facilities.map(({ icon: Icon, label }) => (
              <motion.div
                key={label}
                variants={revealVariants}
                className="glass-card p-5 rounded-2xl flex flex-col items-center text-center hover:border-sky-400/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-400/10 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-sky-400" />
                </div>
                <span className="text-xs text-white/70 leading-tight">{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── ABOUT SYMPOSIUM ── */}
        <section className="section-padding container-xl px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariants}
            className="glass-card p-10 md:p-16 rounded-3xl text-center border border-sky-400/10 bg-sky-400/5 max-w-4xl mx-auto"
          >
            <span className="section-badge inline-block mb-4 px-4 py-1 rounded-full text-sky-400 bg-sky-400/10 border border-sky-400/20 text-xs tracking-widest uppercase font-semibold">
              2026 Edition
            </span>
            <h2 className="text-4xl md:text-5xl font-black gradient-text mb-6">About INFOGRAM&apos;26</h2>
            <p className="text-lg text-white/70 leading-relaxed">
              INFOGRAM&apos;26 is the annual <strong className="text-white">National Level Technical Symposium</strong> organized by the Department of Information Technology, CAHCET. This prestigious event brings together brilliant minds from engineering colleges across the nation to compete, collaborate, and celebrate technological innovation — blending technical brilliance with creative expression.
            </p>
          </motion.div>
        </section>

        {/* ── STUDENT ACTIVITIES ── */}
        <section className="section-padding container-xl px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariants}
            className="text-center mb-10"
          >
            <span className="section-badge inline-block mb-3 px-4 py-1 rounded-full text-sky-400 bg-sky-400/10 border border-sky-400/20 text-xs tracking-widest uppercase font-semibold">
              Student Life
            </span>
            <h2 className="text-4xl font-bold gradient-text">Student Activities</h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-wrap justify-center gap-4"
          >
            {studentActivities.map((activity) => (
              <motion.div
                key={activity}
                variants={revealVariants}
                className="glass-card px-6 py-3 rounded-full flex items-center gap-2 text-sm font-medium hover:border-sky-400/40 transition-all"
              >
                <Star className="w-4 h-4 text-sky-400" />
                {activity}
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── MISSION / VISION / OBJECTIVES ── */}
        <section className="section-padding container-xl px-4 pb-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariants}
            className="text-center mb-10"
          >
            <span className="section-badge inline-block mb-3 px-4 py-1 rounded-full text-sky-400 bg-sky-400/10 border border-sky-400/20 text-xs tracking-widest uppercase font-semibold">
              Our Purpose
            </span>
            <h2 className="text-4xl font-bold gradient-text">Mission, Vision &amp; Objectives</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: 'Our Mission',
                color: 'text-sky-400',
                bg: 'bg-sky-400/10',
                content: 'To provide a platform for students to showcase their technical prowess, foster innovation, and build professional networks that transcend institutional boundaries.',
                list: null,
              },
              {
                icon: Lightbulb,
                title: 'Our Vision',
                color: 'text-purple-400',
                bg: 'bg-purple-400/10',
                content: "To become India's most celebrated student-led technical symposium, recognized for academic excellence, innovation, and industry relevance.",
                list: null,
              },
              {
                icon: Award,
                title: 'Our Objectives',
                color: 'text-yellow-400',
                bg: 'bg-yellow-400/10',
                content: null,
                list: [
                  'Encourage research and innovation',
                  'Foster inter-collegiate collaboration',
                  'Bridge academia and industry',
                  'Recognize and reward talent',
                  'Promote emerging technologies',
                ],
              },
            ].map(({ icon: Icon, title, color, bg, content, list }, i) => (
              <motion.div
                key={title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={revealVariants}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 rounded-3xl"
              >
                <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mb-5`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{title}</h3>
                {content && <p className="text-white/70 leading-relaxed">{content}</p>}
                {list && (
                  <ul className="space-y-2">
                    {list.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-white/70 text-sm">
                        <CheckCircle2 className={`w-4 h-4 ${color} shrink-0 mt-0.5`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── PARENT ORG BANNER ── */}
        <section className="container-xl px-4 py-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariants}
            className="glass-card p-8 md:p-10 rounded-3xl flex flex-col md:flex-row items-center gap-8 border border-white/10"
          >
            <div className="w-16 h-16 rounded-2xl bg-sky-400/10 flex items-center justify-center shrink-0">
              <Globe className="w-8 h-8 text-sky-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Parent Organization — MMES</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                CAHCET is managed by the <strong className="text-white">Melvisharam Muslim Educational Society (MMES)</strong>, founded in <strong className="text-white">1918</strong> by Nawab C. Abdul Hakeem. MMES manages several schools and higher education institutions across the region, with a longstanding legacy of quality education and community service in Tamil Nadu.
              </p>
            </div>
          </motion.div>
        </section>

      </div>
    </PublicLayout>
  );
}
