import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";

// ─── Utility: cn ───────────────────────────────────────────────────────────────
const cn = (...cls) => cls.filter(Boolean).join(" ");

// ─── Particle Canvas ───────────────────────────────────────────────────────────
function ParticlesBg() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    const ctx = c.getContext("2d");
    let W = (c.width = window.innerWidth);
    let H = (c.height = window.innerHeight);
    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(56,189,248,0.5)";
        ctx.fill();
      });
      pts.forEach((a, i) =>
        pts.slice(i + 1).forEach((b) => {
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(56,189,248,${0.12 * (1 - d / 120)})`;
            ctx.stroke();
          }
        }),
      );
      raf = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => {
      W = c.width = window.innerWidth;
      H = c.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={ref}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.7,
      }}
    />
  );
}

// ─── Typing animation ──────────────────────────────────────────────────────────
function Typewriter({ words }) {
  const [idx, setIdx] = useState(0);
  const [char, setChar] = useState(0);
  const [del, setDel] = useState(false);
  const [disp, setDisp] = useState("");
  useEffect(() => {
    const t = setTimeout(
      () => {
        const w = words[idx];
        if (!del) {
          setDisp(w.slice(0, char + 1));
          if (char + 1 === w.length) {
            setTimeout(() => setDel(true), 1400);
          } else setChar((c) => c + 1);
        } else {
          setDisp(w.slice(0, char - 1));
          if (char === 0) {
            setDel(false);
            setIdx((i) => (i + 1) % words.length);
          } else setChar((c) => c - 1);
        }
      },
      del ? 40 : 70,
    );
    return () => clearTimeout(t);
  }, [char, del, idx, words]);
  return (
    <span className="text-sky-400">
      {disp}
      <span className="animate-pulse">|</span>
    </span>
  );
}

// ─── Section Heading ───────────────────────────────────────────────────────────
function SectionHeading({ title, sub }) {
  return (
    <div className="text-center mb-14">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
        {title}
      </h2>
      <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto">
        {sub}
      </p>
      <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-sky-500 to-blue-600" />
    </div>
  );
}

// ─── Scroll progress ──────────────────────────────────────────────────────────
function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const h = () => {
      const el = document.documentElement;
      setP((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    };
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <div
      style={{ width: `${p}%` }}
      className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-sky-500 to-blue-600 z-[9999] transition-all duration-100"
    />
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ dark, setDark }) {
  const [scroll, setScroll] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setScroll(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const links = [
    "Home",
    "About",
    "Skills",
    "Projects",
    "Certifications",
    "Experience",
    "Contact",
  ];
  const to = (id) => () => {
    setOpen(false);
    document
      .getElementById(id.toLowerCase())
      ?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scroll
          ? "bg-slate-900/90 backdrop-blur-md shadow-lg shadow-sky-900/10"
          : "bg-transparent",
      )}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
        <span className="text-sky-400 font-bold text-xl tracking-tight">
          Sneha<span className="text-white">.</span>
        </span>
        <div className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <button
              key={l}
              onClick={to(l)}
              className="text-sm text-slate-300 hover:text-sky-400 transition-colors"
            >
              {l}
            </button>
          ))}
          <button
            onClick={() => setDark((d) => !d)}
            className="ml-2 w-8 h-8 rounded-full border border-sky-500/40 text-sky-400 text-xs flex items-center justify-center hover:bg-sky-500/10"
          >
            {dark ? "☀" : "🌙"}
          </button>
        </div>
        <button
          className="md:hidden text-slate-300"
          onClick={() => setOpen((o) => !o)}
        >
          ☰
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-md px-4 pb-4 flex flex-col gap-3">
          {links.map((l) => (
            <button
              key={l}
              onClick={to(l)}
              className="text-slate-300 text-sm py-1 text-left hover:text-sky-400"
            >
              {l}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 flex flex-col-reverse md:flex-row items-center gap-12 py-20">
        {/* Text */}
        <div className="flex-1 text-center md:text-left">
          <p className="text-sky-400 text-sm font-semibold tracking-widest uppercase mb-3 animate-fadeIn">
            👋 Hello, I'm
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 leading-tight">
            Sneha{" "}
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              S
            </span>
          </h1>
          <div className="text-xl md:text-2xl font-medium text-slate-300 mb-6 h-8">
            <Typewriter
              words={[
                "Cloud & AI/ML Enthusiast",
                "Python Developer",
                "Freelance Developer",
                "Content Creator",
              ]}
            />
          </div>
          <p className="text-slate-400 max-w-md mb-8 text-sm md:text-base leading-relaxed">
            Building modern web experiences with Cloud, AI, and Creativity. CSE
            student at AMC Engineering College, Bangalore.
          </p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <button
              onClick={() => scrollTo("projects")}
              className="px-6 py-3 rounded-full bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm shadow-lg shadow-sky-500/30 transition-all hover:scale-105"
            >
              View Projects
            </button>
            <a
              href="https://drive.google.com/file/d/1_mwCwj3UwAA5BJbzaoi7QKXXtheCRLm7/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-full border border-sky-500/50 hover:border-sky-400 text-sky-400 font-semibold text-sm transition-all hover:scale-105 hover:bg-sky-500/10"
            >
              Download Resume
            </a>
            <button
              onClick={() => scrollTo("contact")}
              className="px-6 py-3 rounded-full border border-slate-600 hover:border-slate-400 text-slate-300 font-semibold text-sm transition-all hover:scale-105"
            >
              Contact Me
            </button>
          </div>
          {/* Stats */}
          <div className="mt-10 flex gap-6 justify-center md:justify-start">
            {[
              ["8+", "CGPA"],
              ["2+", "Projects"],
              ["6+", "Certificates"],
            ].map(([n, l]) => (
              <div key={l} className="text-center">
                <div className="text-2xl font-bold text-sky-400">{n}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Photo */}
        <div className="relative flex-shrink-0">
          <div className="w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-sky-500/40 shadow-2xl shadow-sky-500/20 relative">
            <img
              src="/images/sneha-profile.jpg"
              alt="Sneha S"
              className="w-full h-full object-cover object-top"
            />
          </div>
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-full border-2 border-sky-400/20 animate-ping" />
          {/* Floating badges */}
          <div className="absolute -bottom-2 -left-6 bg-slate-800/90 backdrop-blur border border-sky-500/30 rounded-xl px-3 py-2 text-xs text-white shadow-lg">
            ☁️ AWS Certified
          </div>
          <div className="absolute -top-2 -right-6 bg-slate-800/90 backdrop-blur border border-sky-500/30 rounded-xl px-3 py-2 text-xs text-white shadow-lg">
            🐍 Python Dev
          </div>
        </div>
      </div>
      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-500 text-xs animate-bounce">
        <span>Scroll</span>
        <span>↓</span>
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function About() {
  const cards = [
    {
      icon: "☁️",
      title: "Cloud Computing",
      desc: "AWS Academy certified, exploring cloud architectures and deployments.",
    },
    {
      icon: "🤖",
      title: "AI & ML",
      desc: "Completed ML internship and multiple AI certifications with hands-on projects.",
    },
    {
      icon: "🐍",
      title: "Python Dev",
      desc: "Building real-world applications with Python, Flask, and Django full stack.",
    },
    {
      icon: "🌐",
      title: "Web Development",
      desc: "Crafting responsive, modern web apps with React and full-stack techniques.",
    },
  ];
  return (
    <section id="about" className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <SectionHeading
          title="About Me"
          sub="Passionate developer on a mission to build impactful tech"
        />
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-slate-300 leading-relaxed mb-4">
              Hey there! I'm{" "}
              <span className="text-sky-400 font-semibold">Sneha S</span>, a 7th
              semester Computer Science Engineering student at{" "}
              <span className="text-sky-400 font-semibold">
                AMC Engineering College, Bangalore
              </span>
              . I'm passionate about bridging the gap between technology and
              creativity.
            </p>
            <p className="text-slate-300 leading-relaxed mb-4">
              My journey spans{" "}
              <span className="text-white font-medium">
                Cloud Computing (AWS)
              </span>
              , <span className="text-white font-medium">AI/ML</span>,{" "}
              <span className="text-white font-medium">Python development</span>
              , and{" "}
              <span className="text-white font-medium">
                Full Stack Web Development
              </span>
              . I also explore DevOps basics and have a keen interest in
              freelancing and content creation.
            </p>
            <p className="text-slate-300 leading-relaxed mb-6">
              I run{" "}
              <span className="text-sky-400 font-semibold">
                Logic LaunchPoint
              </span>{" "}
              — a YouTube channel where I create educational tech content around
              AI, programming, and productivity for learners everywhere.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Python",
                "React",
                "AWS",
                "Machine Learning",
                "Flask",
                "MongoDB",
                "DevOps",
                "Content Creation",
              ].map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full text-xs bg-sky-500/10 border border-sky-500/30 text-sky-400"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-6 flex gap-4">
              <a
                href="https://www.linkedin.com/in/sneha-s-18933330a/"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-sky-400 transition-colors text-sm"
              >
                LinkedIn →
              </a>
              <a
                href="https://github.com/sneha0018"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-sky-400 transition-colors text-sm"
              >
                GitHub →
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {cards.map((c) => (
              <div
                key={c.title}
                className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/10 transition-all hover:-translate-y-1"
              >
                <div className="text-3xl mb-3">{c.icon}</div>
                <div className="font-semibold text-white text-sm mb-1">
                  {c.title}
                </div>
                <div className="text-slate-400 text-xs leading-relaxed">
                  {c.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────────
function SkillBar({ name, pct, delay = 0 }) {
  const [w, setW] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setW(pct), delay);
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [pct, delay]);
  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm text-slate-300">{name}</span>
        <span className="text-xs text-sky-400">{pct}%</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-1000 ease-out"
          style={{ width: `${w}%` }}
        />
      </div>
    </div>
  );
}

function Skills() {
  const cats = [
    {
      label: "Programming",
      icon: "💻",
      skills: [
        ["Python", 85],
        ["Java Basics", 50],
      ],
    },
    {
      label: "Frontend",
      icon: "🎨",
      skills: [
        ["HTML", 90],
        ["CSS", 85],
        ["JavaScript", 75],
        ["React", 70],
      ],
    },
    {
      label: "Cloud & DevOps",
      icon: "☁️",
      skills: [
        ["AWS Cloud Practitioner", 75],
        ["DevOps Basics", 55],
      ],
    },
    {
      label: "Database",
      icon: "🗄️",
      skills: [
        ["MongoDB", 70],
        ["MySQL", 65],
      ],
    },
    {
      label: "Tools",
      icon: "🛠️",
      skills: [
        ["GitHub", 80],
        ["VS Code", 90],
        ["Vercel", 70],
        ["Render", 65],
      ],
    },
  ];
  return (
    <section id="skills" className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <SectionHeading
          title="Skills"
          sub="A growing toolkit of technologies and tools"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cats.map((c, ci) => (
            <div
              key={c.label}
              className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 hover:border-sky-500/30 transition-all hover:shadow-lg hover:shadow-sky-500/5"
            >
              <div className="flex items-center gap-2 mb-5">
                <span className="text-2xl">{c.icon}</span>
                <span className="font-semibold text-white">{c.label}</span>
              </div>
              {c.skills.map(([n, p], si) => (
                <SkillBar key={n} name={n} pct={p} delay={ci * 100 + si * 80} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────
function Projects() {
  const [filter, setFilter] = useState("All");
  const projects = [
    {
      title: "Habit Tracker Web App",
      image: "/images/habit-dashboard.png",
      category: "Web",
      desc: "A productivity-focused habit tracking application that helps users monitor daily habits, maintain consistency, and improve productivity.",
      tech: ["Python", "HTML", "CSS", "JavaScript", "MongoDB", "Render"],
      features: [
        "Add/Delete habits",
        "Daily tracking",
        "Progress monitoring",
        "Responsive UI",
      ],
      live: "https://habit-tracker-mlpz.onrender.com/",
      github: "https://github.com/sneha0018/Habit_tracker.git",
      emoji: "📊",
      color: "from-purple-500/20 to-pink-500/20",
      border: "border-purple-500/30",
      glow: "shadow-purple-500/10",
    },
    {
      title: "Weather Forecast App",
      image: "/images/weather-home.png",
      category: "Cloud",
      desc: "A real-time weather application that provides weather details using external API integration and AWS cloud deployment.",
      tech: [
        "Python",
        "Flask",
        "HTML",
        "CSS",
        "JavaScript",
        "Weather API",
        "AWS",
      ],
      features: [
        "Real-time weather",
        "City search",
        "Temperature details",
        "API integration",
      ],
      live: "http://weather-app-api123.s3-website.eu-north-1.amazonaws.com/",
      github: "https://github.com/sneha0018/weather_api.git",
      emoji: "🌤️",
      color: "from-sky-500/20 to-blue-500/20",
      border: "border-sky-500/30",
      glow: "shadow-sky-500/10",
    },
  ];
  const filters = ["All", "Web", "Cloud", "Python"];
  const filtered =
    filter === "All" ? projects : projects.filter((p) => p.category === filter);
  return (
    <section id="projects" className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <SectionHeading
          title="Projects"
          sub="Real-world applications built with passion and purpose"
        />
        {/* Filter buttons */}
        <div className="flex gap-2 flex-wrap justify-center mb-10">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all",
                filter === f
                  ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30"
                  : "border border-slate-600 text-slate-400 hover:border-sky-500/50 hover:text-sky-400",
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((p) => (
            <div
              key={p.title}
              className={cn(
                "rounded-2xl border bg-gradient-to-br p-6 hover:shadow-xl transition-all hover:-translate-y-2 duration-300 group",
                p.color,
                p.border,
                p.glow,
                "hover:shadow-2xl",
              )}
            >
              {" "}
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-52 object-contain bg-slate-900 rounded-xl mb-4 p-2"
              />
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{p.emoji}</div>
                <span className="text-xs px-3 py-1 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700">
                  {p.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{p.title}</h3>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                {p.desc}
              </p>
              {/* Features */}
              <ul className="mb-4 space-y-1">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="text-xs text-slate-400 flex items-center gap-2"
                  >
                    <span className="text-sky-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              {/* Tech stack */}
              <div className="flex flex-wrap gap-1 mb-5">
                {p.tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-0.5 rounded bg-slate-800/70 text-slate-300 border border-slate-700/50"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                <a
                  href={p.live}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-center py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold transition-all hover:shadow-lg hover:shadow-sky-500/30"
                >
                  Live Demo →
                </a>
                <a
                  href={p.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-center py-2 rounded-lg border border-slate-600 hover:border-sky-500/50 text-slate-300 text-xs font-semibold transition-all hover:text-sky-400"
                >
                  GitHub ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Certifications ───────────────────────────────────────────────────────────
function Certifications() {
  const certs = [
    {
      title: "AWS Academy Cloud Security Foundations",
      org: "Amazon Web Services",
      icon: "☁️",
      color: "from-orange-500/20 to-yellow-500/20",
      border: "border-orange-500/30",
      date: "Feb 2026",
    },
    {
      title: "Python & Django Full Stack Web Developer Bootcamp",
      org: "Udemy",
      icon: "🐍",
      color: "from-green-500/20 to-emerald-500/20",
      border: "border-green-500/30",
      date: "Nov 2025",
    },
    {
      title: "Machine Learning Internship",
      org: "Prinston Smart Engineers",
      icon: "🤖",
      color: "from-purple-500/20 to-indigo-500/20",
      border: "border-purple-500/30",
      date: "May–Jun 2025",
    },
    {
      title: "Career Essentials in Generative AI",
      org: "Microsoft & LinkedIn",
      icon: "✨",
      color: "from-sky-500/20 to-blue-500/20",
      border: "border-sky-500/30",
      date: "Aug 2024",
    },
    {
      title: "Introduction to Machine Learning",
      org: "Online Course",
      icon: "📊",
      color: "from-pink-500/20 to-rose-500/20",
      border: "border-pink-500/30",
      date: "2024",
    },
    {
      title: "Accenture Developer Job Simulation",
      org: "Accenture",
      icon: "💼",
      color: "from-violet-500/20 to-purple-500/20",
      border: "border-violet-500/30",
      date: "2024",
    },
  ];
  return (
    <section id="certifications" className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <SectionHeading
          title="Certifications"
          sub="Industry-recognized credentials and completed programs"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certs.map((c) => (
            <div
              key={c.title}
              className={cn(
                "rounded-2xl border bg-gradient-to-br p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group backdrop-blur-sm",
                c.color,
                c.border,
              )}
            >
              <div className="text-3xl mb-3">{c.icon}</div>
              <div className="text-xs text-slate-500 mb-1">{c.org}</div>
              <h3 className="font-semibold text-white text-sm leading-snug mb-2">
                {c.title}
              </h3>
              <div className="text-xs text-sky-400/70">{c.date}</div>
              <div className="mt-3 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400">Completed</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Experience ───────────────────────────────────────────────────────────────
function Experience() {
  const items = [
    {
      year: "May–Jun 2025",
      title: "Machine Learning Internship",
      org: "Prinston Smart Engineers",
      desc: "Completed hands-on ML internship at AMC Engineering College, working on real-world machine learning projects and algorithms.",
      icon: "🤖",
      color: "sky",
    },
    {
      year: "2024–Present",
      title: "Tech Content Creator",
      org: "Logic LaunchPoint (YouTube)",
      desc: "Creating educational content on AI, programming, and productivity. Achieved 1K+ views on a YouTube short, building a growing tech learner community.",
      icon: "🎬",
      color: "red",
    },
    {
      year: "2024",
      title: "Hackathon Participant",
      org: "2 Hackathons",
      desc: "Participated in 2 hackathons, collaborating in teams to solve real-world problems under time pressure, improving problem-solving and teamwork skills.",
      icon: "⚡",
      color: "yellow",
    },
    {
      year: "Ongoing",
      title: "LeetCode Practice",
      org: "Competitive Programming",
      desc: "Consistently practicing algorithmic problems on LeetCode, building strong DSA foundations.",
      icon: "💡",
      color: "purple",
    },
    {
      year: "Academic",
      title: "Strong Academic Record",
      org: "AMC Engineering College",
      desc: "Maintaining 8+ CGPA throughout the CSE program, demonstrating consistent academic excellence alongside practical projects.",
      icon: "🎓",
      color: "green",
    },
  ];
  const colorMap = {
    sky: "bg-sky-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    green: "bg-green-500",
  };
  return (
    <section id="experience" className="py-24 relative z-10">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <SectionHeading
          title="Experience"
          sub="My journey through learning, building, and growing"
        />
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-sky-500 via-blue-600 to-transparent" />
          <div className="space-y-8">
            {items.map((it, i) => (
              <div key={it.title} className="flex gap-6 group">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 border-2 border-slate-800 z-10",
                    colorMap[it.color] + "/20",
                  )}
                >
                  {it.icon}
                </div>
                <div className="flex-1 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 hover:border-sky-500/30 transition-all hover:shadow-lg hover:shadow-sky-500/5">
                  <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-white">{it.title}</h3>
                      <div className="text-sky-400 text-sm">{it.org}</div>
                    </div>
                    <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                      {it.year}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {it.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Content Creator ──────────────────────────────────────────────────────────
function ContentCreator() {
  const stats = [
    ["1K+", "YouTube Views"],
    ["10+", "Videos Created"],
    ["📱", "Short-form Content"],
    ["🎯", "Tech & AI Focus"],
  ];
  return (
    <section className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <SectionHeading
          title="Content Creator"
          sub="Sharing knowledge and making tech accessible"
        />
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white text-lg">
                ▶
              </div>
              <div>
                <div className="font-bold text-white">Logic LaunchPoint</div>
                <div className="text-xs text-slate-400">YouTube Channel</div>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed mb-6">
              I create educational and tech-related content focused on
              programming, AI tools, productivity, and learning — in simple,
              beginner-friendly ways. My goal is to make technology accessible
              to every aspiring developer.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                "Tech Education",
                "AI Tools",
                "Python Tutorials",
                "Productivity Tips",
                "Short-form Videos",
              ].map((t) => (
                <span
                  key={t}
                  className="text-xs px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="flex gap-3 flex-wrap">
              <a
                href="https://youtube.com/@logiclaunchpoint"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-full bg-red-500 hover:bg-red-400 text-white text-sm font-semibold transition-all hover:scale-105 flex items-center gap-2"
              >
                ▶ YouTube
              </a>
              <a
                href="https://www.instagram.com/logic_launchpoint"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-full border border-pink-500/50 text-pink-400 hover:bg-pink-500/10 text-sm font-semibold transition-all hover:scale-105"
              >
                📸 Instagram
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map(([n, l]) => (
              <div
                key={l}
                className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 text-center hover:border-red-500/30 transition-all hover:shadow-lg hover:shadow-red-500/5"
              >
                <div className="text-3xl font-bold text-white mb-1">{n}</div>
                <div className="text-xs text-slate-400">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const handle = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const submit = () => {
    if (form.name && form.email && form.message) {
      emailjs
        .send(
          "service_1nwq2mj", // from EmailJS dashboard
          "template_ji77fhm", // from EmailJS dashboard
          {
            from_name: form.name,
            from_email: form.email,
            message: form.message,
          },
          "t34pDr4MSXeSV2tQS", // from EmailJS dashboard
        )
        .then(() => {
          setSent(true);
          setForm({ name: "", email: "", message: "" });
          setTimeout(() => setSent(false), 4000);
        });
    }
  };
  const links = [
    {
      label: "Email",
      val: "snehapriya1801@gmail.com",
      href: "mailto:snehapriya1801@gmail.com",
      icon: "✉️",
    },
    { label: "Phone", val: "8867891629", href: "tel:8867891629", icon: "📞" },
    {
      label: "LinkedIn",
      val: "Sneha S",
      href: "https://www.linkedin.com/in/sneha-s-18933330a/",
      icon: "💼",
    },
    {
      label: "GitHub",
      val: "sneha0018",
      href: "https://github.com/sneha0018",
      icon: "🐙",
    },
  ];
  return (
    <section id="contact" className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <SectionHeading
          title="Contact Me"
          sub="Let's build something amazing together"
        />
        <div className="grid md:grid-cols-2 gap-10">
          {/* Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Get In Touch</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              I'm open to collaborations, freelance opportunities, and
              interesting conversations about tech. Feel free to reach out!
            </p>
            <div className="space-y-4">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/5 transition-all group"
                >
                  <span className="text-2xl">{l.icon}</span>
                  <div>
                    <div className="text-xs text-slate-500">{l.label}</div>
                    <div className="text-sm text-slate-200 group-hover:text-sky-400 transition-colors">
                      {l.val}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
          {/* Form */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">
                  Your Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handle}
                  placeholder="Sneha S"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">
                  Email Address
                </label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handle}
                  placeholder="you@example.com"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handle}
                  rows={5}
                  placeholder="Hey Sneha, I'd love to collaborate on..."
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors resize-none"
                />
              </div>
              <button
                onClick={submit}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-[.98]"
              >
                {sent ? "✓ Message Sent!" : "Send Message →"}
              </button>
              {sent && (
                <p className="text-center text-xs text-green-400">
                  Thanks! I'll get back to you soon 🎉
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const links = [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/sneha-s-18933330a/",
      icon: "💼",
    },
    { label: "GitHub", href: "https://github.com/sneha0018", icon: "🐙" },
    {
      label: "YouTube",
      href: "https://youtube.com/@logiclaunchpoint",
      icon: "▶",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/logic_launchpoint",
      icon: "📸",
    },
  ];
  return (
    <footer className="relative z-10 border-t border-slate-800 py-10">
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="text-sky-400 font-bold text-lg mb-1">
            Sneha<span className="text-white">.</span>
          </div>
          <div className="text-xs text-slate-500">
            Cloud & AI/ML Enthusiast · Python Developer · Bangalore, India
          </div>
        </div>
        <div className="flex gap-4">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full border border-slate-700 hover:border-sky-500/50 flex items-center justify-center text-sm hover:text-sky-400 text-slate-400 transition-all hover:scale-110 hover:shadow-lg hover:shadow-sky-500/20"
            >
              {l.icon}
            </a>
          ))}
        </div>
        <div className="text-xs text-slate-600">
          © 2025 Sneha S. Built with ❤️ &amp; React
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(true);
  return (
    <div
      className={dark ? "dark" : ""}
      style={{
        minHeight: "100vh",
        background: dark
          ? "linear-gradient(135deg, #020617 0%, #0a1628 40%, #020617 100%)"
          : "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 40%, #f0f9ff 100%)",
        color: dark ? "#f8fafc" : "#0f172a",
        fontFamily: "'Inter',system-ui,sans-serif",
        overflowX: "hidden",
      }}
    >
      <ScrollProgress />
      <ParticlesBg />
      <Navbar dark={dark} setDark={setDark} />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Certifications />
      <Experience />
      <ContentCreator />
      <Contact />
      <Footer />
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
        .animate-fadeIn{animation:fadeIn .8s ease forwards}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:#0a1628}
        ::-webkit-scrollbar-thumb{background:#1e40af;border-radius:3px}
        html{scroll-behavior:smooth}
      `}</style>
    </div>
  );
}
