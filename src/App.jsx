import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";


function Home() {
  const [showImage, setShowImage] = useState(false);
  const videoRef = useRef();

  // Always reset on mount
  useEffect(() => {
    setShowImage(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  }, []);

  // ---- Adjust these ----
  const overlay = "bg-black bg-opacity-40"; // Overlay for both video and image
  const fadeDuration = 4000; // ms (1.2s)
  // -----------------------

  return (
    <section className="relative min-h-[80vh] w-full flex items-center justify-center overflow-hidden">
      {/* Background image: fades in when showImage is true */}
      <img
        src="/images/Home.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          zIndex: 1,
          opacity: showImage ? 1 : 0,
          transition: `opacity ${fadeDuration}ms`
        }}
      />

      {/* Video: fades out as showImage becomes true */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/Home.mp4"
        autoPlay
        muted
        playsInline
        onEnded={() => setShowImage(true)}
        style={{
          zIndex: 2,
          opacity: showImage ? 0 : 1,
          transition: `opacity ${fadeDuration}ms`
        }}
        controls={false} // Explicitly make sure controls are off
        tabIndex={-1}    // Not focusable
        disablePictureInPicture // <-- Hides PiP/minimize button
        controlsList="nodownload nofullscreen noremoteplayback" // Extra: hides other controls
      />

      {/* Overlay: set opacity in `overlay` variable */}
      <div className={`absolute inset-0 z-5 pointer-events-none ${overlay}`} />

      {/* Hero text content */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full px-4 py-28">
        <span className="text-blue-600 tracking-widest uppercase font-bold mb-3 text-3xl" style={{ letterSpacing: "0.18em" }}>
          WELCOME
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 text-center leading-tight">
          I create data-driven solutions <br />
          for business and infrastructure.
        </h1>
        <p className="text-2xl text-gray-900 text-center mb-12 max-w-4xl">
          Bridging Data Science, AI, and Digital Engineering for a smarter world.<br />
          <span className="text-2xl text-gray-900 text-center mb-12 max-w-2xl">(Data, AI, ML, BIM, Infrastructure, Consulting)</span>
        </p>
        <Link
          to="/projects"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold shadow transition text-lg"
        >
          See Projects
        </Link>
      </div>
    </section>
  );
}

function LoopedVideoWithFallback({
  src,
  poster,              // still image to show after loops
  maxLoops = 1,
  fadeMs = 1000,
  className = "",
}) {
  const videoRef = useRef(null);
  const [loopCount, setLoopCount] = useState(0);
  const [showImage, setShowImage] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Autoplay on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const handleEnded = () => {
    setLoopCount((c) => {
      const next = c + 1;
      if (next < maxLoops && videoRef.current) {
        // play next loop
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      } else {
        // done -> fade to image
        setShowImage(true);
      }
      return next;
    });
  };

  const handleReplay = () => {
    setLoopCount(0);
    setShowImage(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <div
      className={`relative w-full h-full ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Still image (fades in when showImage = true) */}
      <img
        src={poster}
        alt="Preview"
        className="absolute inset-0 w-full h-full object-contain rounded-xl shadow-md"
        style={{
          zIndex: 1,
          opacity: showImage ? 1 : 0,
          transition: `opacity ${fadeMs}ms ease`,
          background: "#eaeaea",
        }}
      />

      {/* Video (fades out when showImage = true) */}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-contain rounded-xl shadow-md"
        style={{
          zIndex: 2,
          opacity: showImage ? 0 : 1,
          transition: `opacity ${fadeMs}ms ease`,
          background: "#eaeaea",
        }}
        onEnded={handleEnded}
        controls={false}
        tabIndex={-1}
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
      />

      {/* Replay overlay (only when image is showing) */}
      {showImage && (
        <button
          onClick={handleReplay}
          className={`absolute inset-0 flex items-center justify-center rounded-xl
                      bg-black/30 hover:bg-black/40 text-white font-semibold
                      transition ${hovered ? 'opacity-100' : 'opacity-0'} `}
          style={{ zIndex: 3, transition: `opacity ${fadeMs}ms ease` }}
          aria-label="Replay"
          title="Replay"
        >
          ▶ Replay
        </button>
      )}
    </div>
  );
}


function Projects() {
  // You can update color codes for each project below to get just the subtle look you want!
  const projects = [
    {
      title: "Bank of England NLP/LLMs",
      subtitle: "Data Science · NLP · AI",
      desc: "Built LLM/NLP workflows for the PRA to detect risk in bank earnings calls. Automated topic modeling, sentiment analysis, and LLM-powered summaries for regulatory supervisors.",
      colorLeft: "bg-[#e5ebf3]",
      colorRight: "bg-[#f5f7fa]",
      image: "/images/boe_project.jpg", // put your real image in public/images/
      link: "https://github.com/EErlando/Quarterly-Bytes/blob/main/README.md"
    },
    {
      title: "MW Synergy: London Underground",
      subtitle: "BIM · Digital Twin · Smart Cities",
      desc: "Point cloud modeling and digital visualization for major city infrastructure. Supporting high-speed internet and 4G/5G rollout for TfL.",
      colorLeft: "bg-[#e6f3ec]",
      colorRight: "bg-[#f3f7f5]",
      image: "/images/mwsynergy_project.jpg",
      video: "/videos/mwsynergy_project.mp4", // <-- add this (put the file in public/videos/)
      link: "https://www.installationtechnology.com/case-studies/boldyn-networks"
    },
    // Add more projects...
  ];

  return (
    <section className="bg-[#f8f9fb] min-h-screen py-20 px-4">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-14 text-center tracking-tight">Projects</h2>
      <div className="flex flex-col gap-16 max-w-7xl mx-auto">
        {projects.map((proj, idx) => (
          <div 
            key={idx} 
            className="grid grid-cols-1 md:grid-cols-[0.9fr_1.2fr] rounded-2xl overflow-hidden shadow-md"
          >
            {/* LEFT: Text Card */}
            <div className={`p-8 md:p-10 flex flex-col justify-center ${proj.colorLeft}`}>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{proj.title}</h3>
              <span className="text-xl text-gray-700 font-bold mb-3 block">{proj.subtitle}</span>
              <p className="text-gray-700 text-lg mb-6 text-justify">{proj.desc}</p>
              {proj.link && (
                <a 
                  href={proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 font-semibold underline hover:text-blue-900 transition"
                >
                  View case study
                </a>
              )}
            </div>

            {/* RIGHT: Media Card */}
            <div className={`relative ${proj.colorRight} min-h-[440px] p-8 flex items-center justify-center`}>
              {proj.video ? (
                <LoopedVideoWithFallback
                  src={proj.video}
                  poster={proj.image}
                  maxLoops={1}
                  fadeMs={600}
                  className="w-full max-w-4xl h-full object-contain rounded-xl shadow-md"
                  style={{ background: "#eaeaea" }}
                  controls={false}
                  tabIndex={-1}
                  disablePictureInPicture
                  controlsList="nodownload nofullscreen noremoteplayback"
                />
              ) : (
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full max-w-2xl h-auto object-contain rounded-xl shadow-md"
                  style={{ background: "#eaeaea" }}
                  onError={(e) => {
                    e.currentTarget.style.opacity = 0.4;
                    e.currentTarget.src = "https://placehold.co/350x200?text=Image";
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LimitedLoopVideo({
  src,
  poster,
  maxLoops = 2,          // 1) set how many times to play (e.g., 1, 2, 3…)
  fadeMs = 1000,           // fade duration between video and poster
  className = "",         // allow external sizing (w-full h-full etc.)
  showReplay = true,      // 3) show replay button at the end
  replayLabel = "▶ Replay",
}) {
  const videoRef = useRef(null);
  const [loops, setLoops] = useState(0);
  const [showPoster, setShowPoster] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  // Start fresh on mount
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    setLoops(0);
    setShowPoster(false);
    setIsPlaying(true);
    v.currentTime = 0;
    v.play().catch(() => {});
  }, [src]);

  // Handle natural end of each play
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onEnded = () => {
      const next = loops + 1;
      if (next < maxLoops) {
        setLoops(next);
        v.currentTime = 0;
        v.play().catch(() => {});
      } else {
        setIsPlaying(false);
        setShowPoster(true);
      }
    };

    v.addEventListener("ended", onEnded);
    return () => v.removeEventListener("ended", onEnded);
  }, [loops, maxLoops]);

  // Manual restart (no hover restart)
  const handleReplay = () => {
    const v = videoRef.current;
    if (!v) return;
    setLoops(0);
    setShowPoster(false);
    setIsPlaying(true);
    v.currentTime = 0;
    v.play().catch(() => {});
  };

  return (
    <div className={`relative ${className}`} aria-live="polite">
      {/* Poster (fades in when finished) */}
      <img
        src={poster}
        alt="Video poster"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          zIndex: 1,
          opacity: showPoster ? 1 : 0,
          transition: `opacity ${fadeMs}ms ease`,
          background: "#eaeaea",
        }}
        draggable={false}
      />

      {/* Video (fades out when finished) */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        playsInline
        autoPlay
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          zIndex: 2,
          opacity: showPoster ? 0 : 1,
          transition: `opacity ${fadeMs}ms ease`,
          background: "#eaeaea",
        }}
        controls={false}
        tabIndex={-1}
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
      />

      {/* Replay button (only after loops complete) */}
      {showReplay && !isPlaying && showPoster && (
        <button
          onClick={handleReplay}
          className="absolute inset-0 flex items-center justify-center bg-black/25 hover:bg-black/35 text-white font-semibold rounded-none"
          style={{ zIndex: 3 }}
          aria-label="Replay video"
          title="Replay"
        >
          {replayLabel}
        </button>
      )}
    </div>
  );
}

function MWSynergy() {
  // ---- Content knobs (easy to edit) ----
  const hero = {
    title: "MW Synergy",
    subtitle: "Digital Engineering for a Smarter World",
    video: "/videos/mwsynergy_hero.mp4",      // optional
    poster: "/images/mwsynergy_hero.jpg",     // fallback / first frame
  };

  const overview = {
    problem:
      "Deliver resilient 4G/5G connectivity across deep‑level stations and tunnels for Transport for London while coordinating design data at scale.",
    solution:
      "Point‑cloud modeling, BIM coordination, digital twin visualisations, and construction‑ready documentation integrated with stakeholder workflows.",
    impact:
      "Accelerated approvals, reduced site rework, and a repeatable digital delivery approach now used across additional assets and lines.",
  };

  const kpis = [
    { label: "Stations & Tunnels", value: "450+" },
    { label: "Point‑cloud scans", value: "50+TB" },
    { label: "Design clashes resolved", value: "1,200+" },
    { label: "Approval cycle time", value: "−35%" },
  ];

  const role = [
    "BIM Management",
    "Point‑Cloud to BIM",
    "Model Validation",
    "Digital Twin Visualisation",
    "Stakeholder Coordination",
  ];

  const tools = ["Bentley CONNECT","Revit", "Navisworks", "Recap", "CloudCompare", "Python", "Power BI"];

  const milestones = [
    { when: "Q1", what: "Capture & registration of point‑cloud data" },
    { when: "Q2", what: "Discipline models + clash coordination" },
    { when: "Q3", what: "Digital twin visualisations & sign‑off packs" },
    { when: "Q4", what: "Handover, lessons learned, scalable templates" },
  ];

  const gallery = {
    video: "/videos/mwsynergy_project.mp4",   // optional media block
    poster: "/images/mwsynergy_project.jpg",
    caption: "Tunnel section visualisation used for stakeholder reviews.",
  };

  return (
    <section className="bg-[#f8f9fb]">
      {/* HERO */}
      <div className="relative overflow-hidden">
        {/* Overlay (lighter now) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/10 z-10" />

        {/* Poster or video */}
        {hero.video ? (
          <video
            src={hero.video}
            poster={hero.poster}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-[50vh] object-cover" // change md:h-[8vh] to adjust height if the container "w-full h-[20vh] md:h-[60vh] object-cover"
          />
        ) : (
          <img
            src={hero.poster}
            alt="MW Synergy hero"
            className="w-full h-[50vh] object-cover" // change md:h-[8vh] to adjust height if the container
          />
        )}

        {/* Text overlay ON TOP of media */}
        <div className="absolute bottom-6 left-10 z-20">
          <h1 className="text-cyan-200 text-4xl md:text-5xl font-semibold font-orbitron drop-shadow-sm">
            {hero.title}
            </h1>
            <p className="text-white/90 text-lg md:text-xl font-semibold mt-2">{hero.subtitle}</p>
        </div>
      </div>

      {/* OVERVIEW */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-2 text-xl">Problem</h3>
            <p className="text-gray-800 text-lg leading-relaxed">{overview.problem}</p>
          </div>
          <div className="bg-sky-100 rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-2 text-xl">Solution</h3>
            <p className="text-gray-800 text-lg leading-relaxed">{overview.solution}</p>
          </div>
          <div className="bg-blue-50 rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-2 text-xl">Impact</h3>
            <p className="text-gray-800 text-lg leading-relaxed">{overview.impact}</p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="max-w-6xl mx-auto px-4 pb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((k, i) => (
            <div key={i} className="bg-slate-200 rounded-xl shadow-sm p-6 text-center">
              <div className="text-3xl md:text-4xl font-extrabold text-blue-700">{k.value}</div>
              <div className="text-lg text-gray-600 mt-1">{k.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ROLE + TOOLS */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-100 rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-3 text-xl">My Role</h3>
            <div className="flex flex-wrap gap-2">
              {role.map((r) => (
                <span key={r} className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-lg">
                  {r}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-slate-100 rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-3 text-xl">Tools</h3>
            <div className="flex flex-wrap gap-2">
              {tools.map((t) => (
                <span key={t} className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-lg">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MEDIA PANEL (video with poster or image) */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <div className="relative rounded-xl overflow-hidden">
            {gallery.video ? (
              <LimitedLoopVideo
                src="/videos/mwsynergy_project.mp4"
                poster="/images/mwsynergy_project.jpg"
                maxLoops={1}
                fadeMs={600}
                className="w-full h-[46vh] md:h-[60vh] rounded-xl overflow-hidden shadow-md"
              />
            ) : (
              <img
                src={gallery.poster}
                alt="MW Synergy gallery"
                className="w-full h-[46vh] md:h-[60vh] object-cover rounded-xl shadow-md"
              />
            )}
          </div>
          <p className="text-sm text-gray-600 mt-3">{gallery.caption}</p>
        </div>
      </div>

      {/* RELATED VIDEOS */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-8 text-center">
          Related Videos
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src="https://www.youtube.com/embed/Cl6u6kMLyhM"
              title="Related video 1"
              className="w-full h-full rounded-xl shadow-md"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src="https://www.youtube.com/embed/ffBltAidwuw"
              title="Related video 2"
              className="w-full h-full rounded-xl shadow-md"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src="https://www.youtube.com/embed/uZaVYU1LICw"
              title="Related video 3"
              className="w-full h-full rounded-xl shadow-md"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 md:p-10 text-center">
          <h3 className="text-2xl font-bold text-gray-900">Interested in similar work?</h3>
          <p className="text-gray-700 mt-2">
            Let’s apply these methods to your assets, networks, or data platform.
          </p>
          <Link
            to="/contact"
            className="inline-block mt-5 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-full font-semibold transition"
          >
            Contact me
          </Link>
        </div>
      </div>
    </section>
  );
}


function Contact() {
  return (
    <section className="flex flex-col items-center justify-center py-20 px-4 min-h-[80vh] bg-white">
      <div className="max-w-xl w-full rounded-3xl shadow-md bg-[#f5f7fa] p-10 flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          Contact
        </h2>
        <p className="text-lg text-gray-700 mb-6 text-center">
          Interested in working together or have a question? <br />
          Reach out via LinkedIn, GitHub, or email.
        </p>
        <div className="flex flex-row gap-6 mb-8">
          <a
            href="https://www.linkedin.com/in/maciej-wojtkowiak-25a17366/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-full font-semibold shadow transition"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/EErlando"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-700 hover:bg-gray-900 text-white px-6 py-2 rounded-full font-semibold shadow transition"
          >
            GitHub
          </a>
        </div>
        <p className="text-gray-500 mb-2">
          <span className="font-semibold">Email:</span>{" "}
          <a
            href="mailto:your@email.com"
            className="text-blue-700 ml-2 hover:underline"
          >
            macwojtkowiak@gmail.com
          </a>
        </p>
      </div>
      {/* Partners section */}
      <div className="w-full max-w-6xl mt-20 mx-auto">
        {/* Heading and divider */}
        <div className="flex flex-row items-center gap-8 mb-2 px-2">
          <span className="text-xl font-bold text-gray-800 whitespace-nowrap">Project Partners</span>
        </div>
        <hr className="border-t border-gray-300 mb-6" />
        {/* Logos centered below line */}
        <div className="flex flex-row gap-10 md:gap-14 items-center justify-center overflow-x-auto pb-2">
          <a href="https://boldyn.com" target="_blank" rel="noopener noreferrer">
            <img src="/images/BDN.png" alt="Boldyn Networks logo" className="h-16 w-auto object-contain" />
          </a>
          <a href="https://www.dtcomms.co.uk/" target="_blank" rel="noopener noreferrer">
            <img src="/images/DT.png" alt="Data Tech logo" className="h-14 w-auto object-contain" />
          </a>
          <a href="https://www.installationtechnology.com/" target="_blank" rel="noopener noreferrer">
            <img src="/images/IT.png" alt="Installation Technology logo" className="h-14 w-auto object-contain" />
          </a>
          <a href="https://www.saswireless.com/" target="_blank" rel="noopener noreferrer">
            <img src="/images/SAS.png" alt="SAS Wireless logo" className="h-14 w-auto object-contain" />
          </a>
          <a href="https://tfl.gov.uk/" target="_blank" rel="noopener noreferrer">
            <img src="/images/TFL.png" alt="TfL logo" className="h-12 w-auto object-contain" />
          </a>
        </div>
      </div>
    </section>
  );
}

function App() {
  return (
    <Router basename="/My-Portfolio">
      <nav className="bg-white sticky top-0 z-50 flex justify-between items-center px-8 py-5 shadow">
        <span className="text-2xl font-extrabold tracking-tight text-gray-900">
          MACIEJ WOJTKOWIAK
        </span>
        <div className="flex gap-8">
          <Link className="text-gray-700 hover:text-blue-700 transition text-lg font-medium" to="/">Home</Link>
          <Link className="text-gray-700 hover:text-blue-700 transition text-lg font-medium" to="/projects">Projects</Link>
          <Link className="text-gray-700 hover:text-blue-700 transition text-lg font-medium" to="/mw-synergy">MW Synergy</Link>
          <Link className="text-gray-700 hover:text-blue-700 transition text-lg font-medium" to="/contact">Contact</Link>
        </div>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/mw-synergy" element={<MWSynergy />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
