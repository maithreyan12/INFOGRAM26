'use client'

import { motion, Variants } from 'framer-motion';
import PublicLayout from '@/components/layout/PublicLayout';
import {
  Award, BookOpen, Users, Building, Laptop, Target,
  GraduationCap, MapPin, Phone, Mail, Wifi, Microscope,
  Trophy, Lightbulb, Globe, CheckCircle2, Star, FlaskConical,
} from 'lucide-react';

import { useTheme } from '@/context/ThemeContext';

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
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
  { icon: Microscope, label: 'Auditorium & Halls' },
  { icon: Star, label: 'Placement & Training' },
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

/* ── Reusable section header ── */
function SectionBadge({ label }: { label: string }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <span className={`inline-block mb-3 px-4 py-1 rounded-full text-xs tracking-widest uppercase font-bold border ${
      isDark ? 'bg-purple-500/10 border-purple-500/30 text-amber-300' : 'bg-sky-400/10 border-sky-400/20 text-sky-600'
    }`}>
      {label}
    </span>
  );
}

/* ── Card header row: icon + title ── */
function CardHeader({ icon: Icon, title, color = 'text-[#7c3aed]', bg = 'bg-[#7c3aed]/10' }: { icon: any; title: string; color?: string; bg?: string }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
        isDark ? 'bg-purple-500/20 text-amber-300' : bg
      }`}>
        <Icon className={`w-4 h-4 ${isDark ? 'text-amber-300' : color}`} />
      </div>
      <h3 className={`text-base sm:text-lg font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
    </div>
  );
}

export default function AboutPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <PublicLayout>
      <div className={`min-h-screen pb-20 ${isDark ? 'text-white' : 'text-slate-900'}`}>

        {/* ── PAGE HERO ── */}
        <section className="relative pt-28 pb-14 flex flex-col items-center justify-center overflow-hidden">
          <div className="container-xl relative z-10 text-center px-4">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
              <motion.div variants={revealVariants}>
                <SectionBadge label="Home / About" />
              </motion.div>
              <motion.h1
                variants={revealVariants}
                className="text-3xl sm:text-5xl md:text-7xl font-black mb-4 tracking-tight uppercase"
                style={{
                  fontFamily: 'var(--font-display)',
                  background: isDark
                    ? 'linear-gradient(180deg, #ffffff 0%, #c084fc 50%, #38bdf8 100%)'
                    : 'linear-gradient(180deg, #0f172a 0%, #6d28d9 55%, #059669 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent',
                  display: 'inline-block',
                }}
              >
                About INFOGRAM&apos;26
              </motion.h1>
              <motion.p variants={revealVariants} className={`text-base sm:text-xl font-bold max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Discover the legacy, vision, and passion behind Tamil Nadu&apos;s premier national-level technical symposium.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* ── ABOUT COLLEGE ── */}
        <section className="section-padding container-xl px-4">
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={revealVariants}
            className="glass-card p-5 sm:p-10 rounded-3xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left: Text */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-[#7c3aed]/10 flex items-center justify-center shrink-0">
                    <Building className="w-4 h-4 text-[#7c3aed]" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">About the College</h2>
                </div>
                <p className="text-slate-700 font-medium leading-relaxed mb-3 text-sm sm:text-base">
                  C. Abdul Hakeem College of Engineering & Technology (CAHCET) is a premier engineering institution
                  located in Hakeem Nagar, Melvisharam, Ranipet District, Tamil Nadu. Established in{' '}
                  <strong className="text-slate-900">1998</strong> by the{' '}
                  <strong className="text-slate-900">Melvisharam Muslim Educational Society (MMES)</strong>.
                </p>
                <p className="text-slate-700 font-medium leading-relaxed mb-5 text-sm sm:text-base">
                  Affiliated to <strong className="text-slate-900">Anna University</strong>, Approved by <strong className="text-slate-900">AICTE</strong>, Listed in <strong className="text-slate-900">2(F) & 12(B)</strong> Sections of UGC, certified by <strong className="text-slate-900">TÜV SÜD ISO 21001</strong>, and recognized by <strong className="text-slate-900">Institution&apos;s Innovation Council</strong>. Motto:{' '}
                  <em className="text-[#7c3aed] font-bold">&quot;Enter to Learn, Leave to Serve.&quot;</em>
                </p>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex items-start gap-2 text-slate-600 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-[#7c3aed] shrink-0 mt-0.5" />
                    <span>Hakeem Nagar, Melvisharam, Ranipet District, Tamil Nadu – 632 509</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 font-semibold">
                    <Phone className="w-3.5 h-3.5 text-[#7c3aed] shrink-0" />
                    <span>+91 4172 267387</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 font-semibold">
                    <Mail className="w-3.5 h-3.5 text-[#7c3aed] shrink-0" />
                    <span>info@cahcet.edu.in</span>
                  </div>
                </div>
              </div>

              {/* Right: Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: BookOpen, value: '1998', label: 'Established' },
                  { icon: Award, value: 'AICTE', label: 'Approved' },
                  { icon: GraduationCap, value: '10+', label: 'Programs' },
                  { icon: Users, value: 'Anna Univ.', label: 'Affiliated To' },
                ].map(({ icon: Icon, value, label }) => (
                  <div key={label} className="glass-card p-4 rounded-2xl flex flex-col items-center text-center">
                    <Icon className="w-5 h-5 text-[#7c3aed] mb-2" />
                    <span className="text-base sm:text-xl font-bold text-slate-900 leading-tight">{value}</span>
                    <span className="text-xs text-slate-600 font-semibold mt-1">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── COURSES OFFERED ── */}
        <section className="section-padding container-xl px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariants}
            className="text-center mb-8">
            <SectionBadge label="Academics" />
            <h2 className="text-2xl sm:text-4xl font-bold gradient-text">Courses Offered</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* UG Programs */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={revealVariants} className="glass-card p-5 sm:p-7 rounded-3xl">
              <CardHeader icon={GraduationCap} title="Undergraduate (UG)" />
              <ul className="space-y-2.5">
                {ugPrograms.map((prog) => (
                  <li key={prog} className="flex items-start gap-2.5 text-slate-700 font-medium text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#7c3aed] shrink-0 mt-0.5" />
                    <span>{prog}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* PG + Placements */}
            <div className="flex flex-col gap-5">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={revealVariants} className="glass-card p-5 sm:p-7 rounded-3xl">
                <CardHeader icon={Award} title="Postgraduate (PG)" color="text-teal-600" bg="bg-teal-500/10" />
                <ul className="space-y-2.5">
                  {pgPrograms.map((prog) => (
                    <li key={prog} className="flex items-start gap-2.5 text-slate-700 font-medium text-sm">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>{prog}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Placements */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={revealVariants}
                className="glass-card p-5 sm:p-7 rounded-3xl border border-[#7c3aed]/20 bg-[#7c3aed]/5">
                <div className="flex items-center gap-3 mb-3">
                  <Trophy className="w-5 h-5 text-amber-500 shrink-0" />
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">Placements</h3>
                </div>
                <p className="text-slate-700 font-medium text-sm leading-relaxed">
                  The UG Batch of 2026 achieved{' '}
                  <strong className="text-[#7c3aed] font-bold">100% placement</strong> with students placed across
                  multiple departments through campus recruitment. Strong industry engagement with top
                  recruiters across IT, Core Engineering, and Management sectors.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── ABOUT DEPARTMENT ── */}
        <section className="section-padding container-xl px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={revealVariants} className="glass-card p-5 sm:p-10 rounded-3xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Target, value: 'B.Tech IT', label: 'Flagship Program' },
                  { icon: Users, value: '15+', label: 'Expert Faculty' },
                  { icon: Laptop, value: '6+', label: 'State-of-art Labs' },
                  { icon: GraduationCap, value: '500+', label: 'Alumni Network' },
                ].map(({ icon: Icon, value, label }) => (
                  <div key={label} className="glass-card p-4 rounded-2xl flex flex-col items-center text-center">
                    <Icon className="w-5 h-5 text-[#7c3aed] mb-2" />
                    <span className="text-base sm:text-lg font-bold text-slate-900 leading-tight">{value}</span>
                    <span className="text-xs text-slate-600 font-semibold mt-1 leading-tight">{label}</span>
                  </div>
                ))}
              </div>

              {/* Text */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-[#7c3aed]/10 flex items-center justify-center shrink-0">
                    <Laptop className="w-4 h-4 text-[#7c3aed]" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Department of IT</h2>
                </div>
                <p className="text-slate-700 font-medium leading-relaxed mb-3 text-sm sm:text-base">
                  The Department of Information Technology at CAHCET offers the{' '}
                  <strong className="text-slate-900">B.Tech Information Technology</strong> program, designed to
                  produce industry-ready professionals skilled in software development, networking, data science,
                  and AI-driven technologies.
                </p>
                <p className="text-slate-700 font-medium leading-relaxed text-sm sm:text-base">
                  With state-of-the-art laboratories and strong industry partnerships, the department fosters
                  hands-on learning. It is the proud organizer of{' '}
                  <strong className="text-[#7c3aed] font-bold">INFOGRAM&apos;26</strong> — the annual National Level
                  Technical Symposium.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── CAMPUS FACILITIES ── */}
        <section className="section-padding container-xl px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={revealVariants} className="text-center mb-8">
            <SectionBadge label="Infrastructure" />
            <h2 className="text-2xl sm:text-4xl font-bold gradient-text">Campus Facilities</h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {facilities.map(({ icon: Icon, label }) => (
              <motion.div
                key={label} variants={revealVariants}
                className="glass-card p-4 rounded-2xl flex flex-col items-center text-center hover:border-[#7c3aed]/30 transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-[#7c3aed]/10 flex items-center justify-center mb-2">
                  <Icon className="w-4 h-4 text-[#7c3aed]" />
                </div>
                <span className="text-xs text-slate-700 font-bold leading-tight">{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── ABOUT SYMPOSIUM ── */}
        <section className="section-padding container-xl px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={revealVariants}
            className="glass-card p-6 sm:p-12 rounded-3xl text-center border border-[#7c3aed]/10 bg-[#7c3aed]/5 max-w-3xl mx-auto">
            <SectionBadge label="2026 Edition" />
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black gradient-text mb-4 mt-1">
              About INFOGRAM&apos;26
            </h2>
            <p className="text-xs uppercase tracking-[0.25em] text-[#7c3aed] font-bold mb-4">
              &quot;WHERE INNOVATION EARNS RECOGNITION&quot;
            </p>
            <p className="text-sm sm:text-lg text-slate-700 font-medium leading-relaxed">
              INFOGRAM&apos;26 is the annual{' '}
              <strong className="text-slate-900">National Level Technical Symposium</strong> hosted by the
              Department of Information Technology and Info Club at C. Abdul Hakeem College of Engineering & Technology (CAHCET). On <strong className="text-slate-900">August 22, 2026</strong>, this prestigious event brings together brilliant
              minds from engineering colleges across the nation to compete, collaborate, and celebrate
              technological innovation — blending technical brilliance with creative expression.
            </p>
          </motion.div>
        </section>

        {/* ── STUDENT ACTIVITIES ── */}
        <section className="section-padding container-xl px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={revealVariants} className="text-center mb-8">
            <SectionBadge label="Student Life" />
            <h2 className="text-2xl sm:text-4xl font-bold gradient-text">Student Activities</h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-wrap justify-center gap-3">
            {studentActivities.map((activity) => (
              <motion.div
                key={activity} variants={revealVariants}
                className="glass-card px-4 py-2.5 rounded-full flex items-center gap-2 text-sm font-bold text-slate-800 hover:border-[#7c3aed]/40 transition-all"
              >
                <Star className="w-3.5 h-3.5 text-[#7c3aed] shrink-0" />
                {activity}
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── MISSION / VISION / OBJECTIVES ── */}
        <section className="section-padding container-xl px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={revealVariants} className="text-center mb-8">
            <SectionBadge label="Our Purpose" />
            <h2 className="text-2xl sm:text-4xl font-bold gradient-text">Mission, Vision &amp; Objectives</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: Target,
                title: 'Our Mission',
                color: 'text-[#7c3aed]',
                bg: 'bg-[#7c3aed]/10',
                content: 'To provide a platform for students to showcase their technical prowess, foster innovation, and build professional networks that transcend institutional boundaries.',
                list: null,
              },
              {
                icon: Lightbulb,
                title: 'Our Vision',
                color: 'text-teal-600',
                bg: 'bg-teal-500/10',
                content: "To become India's most celebrated student-led technical symposium, recognized for academic excellence, innovation, and industry relevance.",
                list: null,
              },
              {
                icon: Award,
                title: 'Our Objectives',
                color: 'text-amber-600',
                bg: 'bg-amber-500/10',
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
                initial="hidden" whileInView="visible"
                viewport={{ once: true }}
                variants={revealVariants}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-5 sm:p-7 rounded-3xl"
              >
                <div className={`w-10 h-10 rounded-2xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">{title}</h3>
                {content && <p className="text-slate-700 font-medium leading-relaxed text-sm sm:text-base">{content}</p>}
                {list && (
                  <ul className="space-y-2">
                    {list.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-slate-700 font-medium text-sm">
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
        <section className="container-xl px-4 py-10">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={revealVariants}
            className="glass-card p-5 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-5 border border-slate-200"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#7c3aed]/10 flex items-center justify-center shrink-0">
              <Globe className="w-6 h-6 text-[#7c3aed]" />
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-bold text-slate-900 mb-2">Parent Organization — MMES</h3>
              <p className="text-slate-700 font-medium text-sm leading-relaxed">
                CAHCET is managed by the{' '}
                <strong className="text-slate-900">Melvisharam Muslim Educational Society (MMES)</strong>, founded
                in <strong className="text-slate-900">1918</strong> by Nawab C. Abdul Hakeem. MMES manages several
                schools and higher education institutions across the region, with a longstanding legacy of
                quality education and community service in Tamil Nadu.
              </p>
            </div>
          </motion.div>
        </section>

      </div>
    </PublicLayout>
  );
}
