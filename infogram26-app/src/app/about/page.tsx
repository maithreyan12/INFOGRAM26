'use client';

import { motion, Variants } from 'framer-motion';
import { 
  Building, 
  GraduationCap, 
  Award, 
  BookOpen, 
  Users, 
  Laptop, 
  Target, 
  Lightbulb, 
  Trophy, 
  CheckCircle2, 
  Globe, 
  MapPin, 
  Phone, 
  Mail, 
  Star,
  Monitor,
  Wifi,
  Home,
  Bus,
  Utensils
} from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import { useTheme } from '@/context/ThemeContext';

const ugPrograms = [
  'B.E. Computer Science & Engineering',
  'B.Tech Information Technology',
  'B.E. Electronics & Communication Engineering',
  'B.E. Electrical & Electronics Engineering',
  'B.E. Mechanical Engineering',
  'B.E. Civil Engineering',
];

const pgPrograms = [
  'M.E. CAD / CAM',
  'M.E. Communication Systems',
  'MBA – Master of Business Administration',
  'MCA – Master of Computer Applications',
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

const facilities = [
  { icon: Monitor, label: 'Smart Classrooms' },
  { icon: Laptop, label: 'Modern Laboratories' },
  { icon: BookOpen, label: 'Central Library' },
  { icon: Wifi, label: 'Wi-Fi Campus' },
  { icon: Home, label: "Boys' & Girls' Hostels" },
  { icon: Bus, label: 'Transport Facilities' },
  { icon: Trophy, label: 'Sports Grounds' },
  { icon: Building, label: 'Auditorium & Halls' },
  { icon: Award, label: 'Placement & Training' },
  { icon: Utensils, label: 'Cafeteria' },
];

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

function SectionBadge({ label }: { label: string }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <span
      className={`inline-block mb-3 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.16em] border ${
        isDark ? 'bg-purple-500/10 border-purple-500/30 text-amber-300' : 'bg-[#7c3aed]/10 border-[#7c3aed]/25 text-[#7c3aed]'
      }`}
      style={{ fontFamily: 'var(--font-heading)' }}
    >
      {label}
    </span>
  );
}

function CardHeader({
  icon: Icon,
  title,
  color = 'text-[#7c3aed]',
  bg = 'bg-[#7c3aed]/10',
}: {
  icon: React.ElementType;
  title: string;
  color?: string;
  bg?: string;
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-9 h-9 rounded-2xl ${bg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <h3 className={`text-base sm:text-xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>{title}</h3>
    </div>
  );
}

export default function AboutPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <PublicLayout>
      <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#070913] text-white' : 'bg-[#f8fafc] text-slate-950'}`}>
        
        {/* ── HERO HEADER ── */}
        <section className="pt-28 pb-12 sm:pt-36 sm:pb-16 text-center relative overflow-hidden">
          <div className="container-xl mx-auto px-4 relative z-10 max-w-4xl">
            <motion.div initial="hidden" animate="visible" variants={revealVariants}>
              <span className={`inline-block mb-4 px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.16em] border ${
                isDark ? 'bg-purple-500/10 border-purple-500/30 text-amber-300' : 'bg-[#7c3aed]/10 border-[#7c3aed]/25 text-[#7c3aed]'
              }`}>
                Institutional Legacy
              </span>
              <h1 className={`text-3xl sm:text-5xl md:text-6xl font-black uppercase mb-4 ${isDark ? 'text-white' : 'text-slate-950'}`} style={{ fontFamily: 'var(--font-display)' }}>
                About CAHCET &amp; INFOGRAM
              </h1>
              <p className={`text-sm sm:text-lg max-w-2xl mx-auto font-black leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                Empowering technical minds since 1998 under the aegis of Melvisharam Muslim Educational Society (MMES).
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── ABOUT COLLEGE ── */}
        <section className="section-padding container-xl px-4">
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={revealVariants}
            className={`p-6 sm:p-10 rounded-3xl border shadow-xl ${
              isDark ? 'bg-slate-900/90 border-purple-500/30 text-white' : 'bg-white border-slate-200 text-slate-950'
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left: Text */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-2xl bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center shrink-0">
                    <Building className="w-5 h-5 text-[#7c3aed]" />
                  </div>
                  <h2 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>About the College</h2>
                </div>
                <p className={`font-bold leading-relaxed mb-3 text-sm sm:text-base ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  C. Abdul Hakeem College of Engineering &amp; Technology (CAHCET) is a premier engineering institution
                  located in Hakeem Nagar, Melvisharam, Ranipet District, Tamil Nadu. Established in{' '}
                  <strong className={isDark ? 'text-amber-300' : 'text-[#7c3aed]'}>1998</strong> by the{' '}
                  <strong className={isDark ? 'text-white' : 'text-slate-950'}>Melvisharam Muslim Educational Society (MMES)</strong>.
                </p>
                <p className={`font-bold leading-relaxed mb-5 text-sm sm:text-base ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  Affiliated to <strong className={isDark ? 'text-white' : 'text-slate-950'}>Anna University</strong>, Approved by <strong className={isDark ? 'text-white' : 'text-slate-950'}>AICTE</strong>, Listed in <strong className={isDark ? 'text-white' : 'text-slate-950'}>2(F) &amp; 12(B)</strong> Sections of UGC, certified by <strong className={isDark ? 'text-white' : 'text-slate-950'}>TÜV SÜD ISO 21001</strong>, and recognized by <strong className={isDark ? 'text-white' : 'text-slate-950'}>Institution&apos;s Innovation Council</strong>. Motto:{' '}
                  <em className={isDark ? 'text-amber-300 font-black' : 'text-[#7c3aed] font-black'}>&quot;Enter to Learn, Leave to Serve.&quot;</em>
                </p>
                <div className="space-y-2.5 text-xs sm:text-sm">
                  <a
                    href="https://www.google.com/maps/place/C.+Abdul+Hakeem+College+of+Engineering+%26+Technology,+Melvisharam,+Ranipet,+Tamil+Nadu+632509/data=!4m2!3m1!1s0x3bad35d34059d16f:0xb443fab6e00b313f"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-start gap-2.5 font-bold transition-all hover:underline ${isDark ? 'text-slate-200 hover:text-amber-300' : 'text-slate-800 hover:text-[#7c3aed]'}`}
                    style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
                  >
                    <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>Hakeem Nagar, Melvisharam, Ranipet District, Tamil Nadu – 632 509 <strong className="text-red-500 font-black text-xs uppercase tracking-wider ml-1">(Open Maps 📍)</strong></span>
                  </a>
                  <a href="tel:+919043293530" className={`flex items-center gap-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-all hover:underline ${isDark ? 'text-slate-200 hover:text-amber-300' : 'text-slate-800 hover:text-[#7c3aed]'}`}>
                    <Phone className="w-4 h-4 text-[#7c3aed] shrink-0" />
                    <span>Assistant Professor: Mr. M. Mohamed Rafe (9043293530)</span>
                  </a>
                  <div className={`flex items-center gap-2.5 font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    <Mail className="w-4 h-4 text-[#7c3aed] shrink-0" />
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
                  <div key={label} className={`p-4 rounded-2xl flex flex-col items-center text-center border ${
                    isDark ? 'bg-slate-950/80 border-purple-500/30 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                  }`}>
                    <Icon className="w-6 h-6 text-[#7c3aed] mb-2" />
                    <span className="text-base sm:text-xl font-black leading-tight">{value}</span>
                    <span className={`text-xs font-black mt-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{label}</span>
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
            <h2 className={`text-2xl sm:text-4xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>Courses Offered</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* UG Programs */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={revealVariants} className={`p-6 sm:p-7 rounded-3xl border shadow-xl ${
                isDark ? 'bg-slate-900/90 border-purple-500/30 text-white' : 'bg-white border-slate-200 text-slate-950'
              }`}>
              <CardHeader icon={GraduationCap} title="Undergraduate (UG)" />
              <ul className="space-y-3">
                {ugPrograms.map((prog) => (
                  <li key={prog} className={`flex items-start gap-2.5 font-bold text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    <CheckCircle2 className="w-4 h-4 text-[#7c3aed] shrink-0 mt-0.5" />
                    <span>{prog}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* PG + Placements */}
            <div className="flex flex-col gap-5">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={revealVariants} className={`p-6 sm:p-7 rounded-3xl border shadow-xl ${
                  isDark ? 'bg-slate-900/90 border-purple-500/30 text-white' : 'bg-white border-slate-200 text-slate-950'
                }`}>
                <CardHeader icon={Award} title="Postgraduate (PG)" color="text-teal-500" bg="bg-teal-500/10" />
                <ul className="space-y-3">
                  {pgPrograms.map((prog) => (
                    <li key={prog} className={`flex items-start gap-2.5 font-bold text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                      <span>{prog}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Placements */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={revealVariants}
                className={`p-6 sm:p-7 rounded-3xl border shadow-xl ${
                  isDark ? 'bg-slate-900/90 border-amber-500/40 text-white' : 'bg-white border-amber-300/60 text-slate-950'
                }`}>
                <div className="flex items-center gap-3 mb-3">
                  <Trophy className="w-5 h-5 text-amber-400 shrink-0" />
                  <h3 className={`text-base sm:text-lg font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>Placements</h3>
                </div>
                <p className={`font-bold text-sm leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  The UG Batch of 2026 achieved{' '}
                  <strong className={isDark ? 'text-amber-300 font-black' : 'text-[#7c3aed] font-black'}>100% placement</strong> with students placed across
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
            variants={revealVariants} className={`p-6 sm:p-10 rounded-3xl border shadow-xl ${
              isDark ? 'bg-slate-900/90 border-purple-500/30 text-white' : 'bg-white border-slate-200 text-slate-950'
            }`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Target, value: 'B.Tech IT', label: 'Flagship Program' },
                  { icon: Users, value: '15+', label: 'Expert Faculty' },
                  { icon: Laptop, value: '6+', label: 'State-of-art Labs' },
                  { icon: GraduationCap, value: '500+', label: 'Alumni Network' },
                ].map(({ icon: Icon, value, label }) => (
                  <div key={label} className={`p-4 rounded-2xl flex flex-col items-center text-center border ${
                    isDark ? 'bg-slate-950/80 border-purple-500/30 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                  }`}>
                    <Icon className="w-5 h-5 text-[#7c3aed] mb-2" />
                    <span className="text-base sm:text-lg font-black leading-tight">{value}</span>
                    <span className={`text-xs font-black mt-1 leading-tight ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{label}</span>
                  </div>
                ))}
              </div>

              {/* Text */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-2xl bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center shrink-0">
                    <Laptop className="w-5 h-5 text-[#7c3aed]" />
                  </div>
                  <h2 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>Department of IT</h2>
                </div>
                <p className={`font-bold leading-relaxed mb-3 text-sm sm:text-base ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  The Department of Information Technology at CAHCET offers the{' '}
                  <strong className={isDark ? 'text-amber-300 font-black' : 'text-slate-950 font-black'}>B.Tech Information Technology</strong> program, designed to
                  produce industry-ready professionals skilled in software development, networking, data science,
                  and AI-driven technologies.
                </p>
                <p className={`font-bold leading-relaxed text-sm sm:text-base ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  With state-of-the-art laboratories and strong industry partnerships, the department fosters
                  hands-on learning. It is the proud organizer of{' '}
                  <strong className={isDark ? 'text-amber-300 font-black' : 'text-[#7c3aed] font-black'}>INFOGRAM&apos;26</strong> — the annual National Level
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
            <h2 className={`text-2xl sm:text-4xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>Campus Facilities</h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {facilities.map(({ icon: Icon, label }) => (
              <motion.div
                key={label} variants={revealVariants}
                className={`p-4 rounded-2xl flex flex-col items-center text-center border transition-all duration-200 ${
                  isDark 
                    ? 'bg-slate-900/90 border-purple-500/30 text-white hover:border-purple-400/60 shadow-lg' 
                    : 'bg-white border-slate-200 text-slate-950 hover:border-[#7c3aed]/40 shadow-md'
                }`}
              >
                <div className="w-10 h-10 rounded-2xl bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center mb-2.5">
                  <Icon className={`w-5 h-5 ${isDark ? 'text-purple-300' : 'text-[#7c3aed]'}`} />
                </div>
                <span className={`text-xs font-black leading-tight ${isDark ? 'text-slate-100' : 'text-slate-950'}`}>{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── ABOUT SYMPOSIUM ── */}
        <section className="section-padding container-xl px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={revealVariants}
            className={`p-6 sm:p-12 rounded-3xl text-center border max-w-4xl mx-auto shadow-2xl ${
              isDark ? 'bg-slate-900/95 border-purple-500/40 text-white' : 'bg-white border-slate-200 text-slate-950'
            }`}>
            <SectionBadge label="2026 Edition" />
            <h2 className={`text-2xl sm:text-3xl md:text-5xl font-black mb-4 mt-1 ${isDark ? 'text-white' : 'text-slate-950'}`}>
              About INFOGRAM&apos;26
            </h2>
            <p className={`text-xs uppercase tracking-[0.25em] font-black mb-4 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`}>
              &quot;WHERE INNOVATION EARNS RECOGNITION&quot;
            </p>
            <p className={`text-sm sm:text-lg font-black leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              INFOGRAM&apos;26 is the annual{' '}
              <strong className={isDark ? 'text-amber-300 font-black' : 'text-[#7c3aed] font-black'}>National Level Technical Symposium</strong> hosted by the
              Department of Information Technology and Info Club at C. Abdul Hakeem College of Engineering &amp; Technology (CAHCET). On <strong className={isDark ? 'text-white font-black' : 'text-slate-950 font-black'}>August 22, 2026</strong>, this prestigious event brings together brilliant
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
            <h2 className={`text-2xl sm:text-4xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>Student Activities</h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-wrap justify-center gap-3">
            {studentActivities.map((activity) => (
              <motion.div
                key={activity} variants={revealVariants}
                className={`px-4 py-2.5 rounded-full flex items-center gap-2 text-sm font-black border transition-all ${
                  isDark 
                    ? 'bg-slate-900/90 border-purple-500/40 text-amber-300 hover:border-amber-300/60' 
                    : 'bg-white border-slate-200 text-[#7c3aed] hover:border-[#7c3aed]/40 shadow-sm'
                }`}
              >
                <Star className="w-4 h-4 text-amber-400 shrink-0" />
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
            <h2 className={`text-2xl sm:text-4xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>Mission, Vision &amp; Objectives</h2>
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
                color: 'text-teal-500',
                bg: 'bg-teal-500/10',
                content: "To become India's most celebrated student-led technical symposium, recognized for academic excellence, innovation, and industry relevance.",
                list: null,
              },
              {
                icon: Award,
                title: 'Our Objectives',
                color: 'text-amber-500',
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
                className={`p-6 sm:p-7 rounded-3xl border shadow-xl ${
                  isDark ? 'bg-slate-900/90 border-purple-500/30 text-white' : 'bg-white border-slate-200 text-slate-950'
                }`}
              >
                <div className={`w-10 h-10 rounded-2xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <h3 className={`text-lg sm:text-xl font-black mb-3 ${isDark ? 'text-white' : 'text-slate-950'}`}>{title}</h3>
                {content && <p className={`font-bold leading-relaxed text-sm sm:text-base ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{content}</p>}
                {list && (
                  <ul className="space-y-2.5">
                    {list.map((item) => (
                      <li key={item} className={`flex items-start gap-2.5 font-bold text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
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

        <section className="container-xl px-4 py-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={revealVariants}
            className={`p-6 sm:p-10 rounded-3xl border shadow-xl ${
              isDark ? 'bg-slate-900/90 border-purple-500/30 text-white' : 'bg-white border-slate-200 text-slate-950'
            }`}
          >
            <div className="text-center mb-8">
              <SectionBadge label="Leadership" />
              <h2 className={`text-2xl sm:text-4xl font-black uppercase ${isDark ? 'text-white' : 'text-slate-950'}`} style={{ fontFamily: 'var(--font-display)' }}>
                College &amp; Symposium Authorities
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`p-5 rounded-2xl border text-center ${
                isDark ? 'bg-slate-950/80 border-purple-500/20' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className={`text-[11px] font-black uppercase tracking-wider mb-1 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`}>Chief Patron</div>
                <div className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>Janab Dr. S. Ziauddin Ahmed</div>
              </div>

              <div className={`p-5 rounded-2xl border text-center ${
                isDark ? 'bg-slate-950/80 border-purple-500/20' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className={`text-[11px] font-black uppercase tracking-wider mb-1 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`}>Chairman</div>
                <div className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>Janab V. Mohammed Rizwanullah</div>
              </div>

              <div className={`p-5 rounded-2xl border text-center ${
                isDark ? 'bg-slate-950/80 border-purple-500/20' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className={`text-[11px] font-black uppercase tracking-wider mb-1 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`}>Patrons</div>
                <div className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>Dr. M. Sasikumar <span className="text-xs font-bold text-slate-400">(Principal)</span></div>
                <div className={`text-sm font-black mt-1 ${isDark ? 'text-white' : 'text-slate-950'}`}>Dr. A. MD Muzaffar Hussain <span className="text-xs font-bold text-slate-400">(Vice-Principal)</span></div>
              </div>

              <div className={`p-5 rounded-2xl border text-center ${
                isDark ? 'bg-slate-950/80 border-purple-500/20' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className={`text-[11px] font-black uppercase tracking-wider mb-1 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`}>Staff Convenor</div>
                <div className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>Mr. M. Mohamed Rafe <span className="text-xs font-bold text-slate-400">(Assistant Professor / IT)</span></div>
                <div className={`text-xs font-bold mt-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Co-Convenor: Mrs. I. Abdulla (AP/IT)</div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── PARENT ORG BANNER ── */}
        <section className="container-xl px-4 py-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={revealVariants}
            className={`p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-5 border shadow-xl ${
              isDark ? 'bg-slate-900/90 border-purple-500/30 text-white' : 'bg-white border-slate-200 text-slate-950'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center shrink-0">
              <Globe className="w-6 h-6 text-[#7c3aed]" />
            </div>
            <div>
              <h3 className={`text-base sm:text-xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-950'}`}>Parent Organization — MMES</h3>
              <p className={`font-bold text-sm leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                CAHCET is managed by the{' '}
                <strong className={isDark ? 'text-amber-300 font-black' : 'text-slate-950 font-black'}>Melvisharam Muslim Educational Society (MMES)</strong>, founded
                in <strong className={isDark ? 'text-white font-black' : 'text-slate-950 font-black'}>1918</strong> by Nawab C. Abdul Hakeem. MMES manages several
                schools and higher education institutions across the region, with a longstanding legacy of
                quality education and community service in Tamil Nadu.
              </p>
            </div>
          </motion.div>
        </section>

        {/* ── WEBSITE DEVELOPER & ADMIN BANNER ── */}
        <section className="container-xl px-4 pb-12">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={revealVariants}
            className={`p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border shadow-xl relative overflow-hidden ${
              isDark ? 'bg-slate-900/90 border-purple-500/35 text-white' : 'bg-white border-slate-200 text-slate-950'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Laptop className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className={`text-lg sm:text-xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>Website Architect &amp; Admin</h3>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border shadow-xs ${
                    isDark ? 'bg-purple-900/60 text-white border-purple-400/40' : 'bg-purple-600 text-white border-purple-700'
                  }`}>
                    Maithreyan D
                  </span>
                </div>
                <p className={`font-bold text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  Designed and engineered with Next.js &amp; Tailwind CSS by <strong className={`font-black ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>Maithreyan D</strong>. For any website inquiries or technical assistance:
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0 w-full md:w-auto">
              <a
                href="https://maithreyan.in"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider border transition-all active:scale-95 ${
                  isDark
                    ? 'bg-purple-600 text-white border-purple-500 hover:bg-purple-500 shadow-md shadow-purple-600/30'
                    : 'bg-purple-600 text-white border-purple-700 hover:bg-purple-700 shadow-md'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>maithreyan.in</span>
              </a>
              <a
                href="tel:+919342706675"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>Call 9342706675</span>
              </a>
            </div>
          </motion.div>
        </section>
      </div>
    </PublicLayout>
  );
}
