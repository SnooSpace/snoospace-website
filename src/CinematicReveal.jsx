/* CinematicReveal.jsx — Unified hero: video landing + GTA VI scroll animation */
import { useRef, useEffect, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CinematicReveal() {
  const containerRef    = useRef(null);
  const landingVideoRef = useRef(null);
  const comingSoonRef   = useRef(null);

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isHovering,     setIsHovering]     = useState(false);
  const [isMuted,        setIsMuted]        = useState(true);

  const startTextSequence = () => {
    gsap.set(comingSoonRef.current, {
      y: 0,
      backgroundImage: "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.6) 100%)",
      opacity: 1,
    });
    gsap.to(comingSoonRef.current, {
      y: "15vh",
      backgroundImage: "linear-gradient(135deg, #00E0FF 0%, #007BFF 100%)",
      duration: 1.5,
      delay: 5,
      ease: "power2.inOut",
    });
  };

  const handlePlayVideo  = () => {
    if (landingVideoRef.current) {
      landingVideoRef.current.muted = false;
      landingVideoRef.current.currentTime = 0;
      landingVideoRef.current.play();
      setIsMuted(false);
    }
  };
  const toggleMute       = (e) => {
    e.stopPropagation();
    if (landingVideoRef.current) {
      const m = !landingVideoRef.current.muted;
      landingVideoRef.current.muted = m;
      setIsMuted(m);
    }
  };
  const handlePauseVideo = () => {
    if (landingVideoRef.current) landingVideoRef.current.pause();
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Scroll indicator bounce ─────────────────────────────────────────
      const indicator = containerRef.current.querySelector(".cr-scroll-indicator");
      if (indicator) {
        gsap.timeline({ repeat: -1, yoyo: true }).to(indicator, {
          y: 20, opacity: 0.5, duration: 0.8, ease: "power1.inOut",
        });
      }

      // ── Initial states (set BEFORE timeline — prevents any flick) ───────
      //
      // cr-logo-main: starts at scale(25) — 30vw × 25 = 750vw effective width.
      // transformOrigin locked to the second 'S' ("Space") center in the SVG:
      //   x = 443/893 = 49.66%,  y = 107/217 = 49.3%
      // This matches the GTA VI technique of starting inside a single letter ('h')
      gsap.set(".cr-logo-main", {
        xPercent: -50, yPercent: -50,
        top: "50%",    left: "50%",
        scale: 25,
        opacity: 0,
        transformOrigin: "49.66% 49.3%",   // pivot = second 'S' ("Space") center
        // sepia→hue-rotate→saturate converts white pixels to deep blue-teal
        filter: "sepia(1) hue-rotate(170deg) saturate(4)",
      });
      gsap.set(".cr-logo-oo-cut", {
        xPercent: -50, yPercent: -50,
        top: "20%",    left: "50%",
        opacity: 0,
      });
      gsap.set(".cr-logo-final", {
        xPercent: -50, yPercent: -50,
        top: "20%",    left: "50%",
        opacity: 0,
      });

      // ── Master scrubbed timeline ────────────────────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          scrub: 1,
          pin: true,
          start: "top top",
          end: "+=2500",
          ease: "none",
          invalidateOnRefresh: true,
        },
      });

      // ── PHASE 0: Video fades fast, logo appears concurrently (no black moment) ──
      tl.to(".cr-video-layer", { opacity: 0, duration: 0.5 }, 0);

      // Logo fades in DURING the video fade — starts colored (blue-teal), gradually turns white
      tl.to(".cr-logo-main", { opacity: 1, duration: 1.2 }, 0);

      // Simultaneously: scale 25→1 AND rise 50%→20% (pure GTA VI zoom-out)
      // transformOrigin stays at second 'S' — pivot rises from viewport-center to top-20%
      tl.fromTo(
        ".cr-logo-main",
        { scale: 25, top: "50%" },
        { scale: 1,  top: "20%", duration: 2.5, ease: "power2.inOut" },
        0
      );

      // Color fades to white during the latter half of the zoom
      // ">-1" = 1 unit before fromTo ends (t=2.5−1=1.5), finishing exactly as logo settles
      tl.to(".cr-logo-main", {
        filter: "sepia(0) hue-rotate(0deg) saturate(1)",
        duration: 1,
      }, ">-1");

      // ── PHASE 3a: logo (now white) → oo-cut crossfade ─────────────────
      tl.to(".cr-logo-main",   { opacity: 0, duration: 0.8 }, ">");
      tl.to(".cr-logo-oo-cut", { opacity: 1, duration: 0.8 }, "<");

      // ── PHASE 3b: oo-cut → Master Logo crossfade ───────────────────────
      tl.to(".cr-logo-oo-cut", { opacity: 0, duration: 0.6 }, ">");
      tl.to(".cr-logo-final",  { opacity: 1, duration: 0.6 }, "<");

      // ── PHASE 4: Tagline fades in ───────────────────────────────────────
      tl.set(".cr-hero-2-container", { visibility: "visible" });
      tl.to(".cr-hero-2-container",  { opacity: 1, duration: 3 }, ">");

      // Tagline gradient shifts to brand colours
      tl.fromTo(
        ".cr-hero-2-container",
        {
          backgroundImage: `radial-gradient(circle at 50% 200vh, rgba(0,198,255,0) 0, rgba(0,114,255,0.5) 90vh, rgba(91,58,255,0.8) 120vh, rgba(11,11,19,0) 150vh)`,
        },
        {
          backgroundImage: `radial-gradient(circle at 50% 3.9575vh, rgb(0,230,255) 0vh, rgb(0,114,255) 50.011vh, rgb(91,58,255) 90.0183vh, rgba(11,11,19,0) 140.599vh)`,
          duration: 3,
        },
        "<1.2"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="cr-container">

      {/* ══ PHASE 0: Landing layer (fades as one unit on scroll) ══════════ */}
      <div className="cr-video-layer">
        <div className="cr-landing-bg" />
        <div className="cursor-glow" />

        <div className="cr-video-inner">
          <video
            ref={landingVideoRef}
            src="/logo-video.mp4"
            autoPlay muted playsInline
            onPlay={() => {
              setIsVideoPlaying(true);
              if (landingVideoRef.current?.currentTime < 1) startTextSequence();
            }}
            onPause={() => setIsVideoPlaying(false)}
            onEnded={()  => setIsVideoPlaying(false)}
          />
        </div>

        <div
          className="landing-content"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {!isVideoPlaying && (
            <button className="btn-play-reveal font-manrope-semibold" onClick={handlePlayVideo}>
              <Play fill="#15141e" size={32} />
            </button>
          )}
          {isVideoPlaying && isHovering && (
            <button className="btn-play-reveal btn-pause-reveal font-manrope-semibold" onClick={handlePauseVideo}>
              <Pause fill="#15141e" size={28} />
            </button>
          )}
          <h1 className="h1-premium font-bc-black coming-soon-text" ref={comingSoonRef}>
            COMING SOON
          </h1>
          <button className="btn-mute-toggle" onClick={toggleMute}>
            {isMuted ? <VolumeX color="white" size={24} /> : <Volume2 color="white" size={24} />}
          </button>
        </div>

        <div className="initial-scroll">
          <div className="cr-scroll-indicator">
            <svg width="34" height="14" viewBox="0 0 34 14" fill="none" aria-hidden="true">
              <path
                fillRule="evenodd" clipRule="evenodd"
                d="M33.5609 1.54346C34.0381 2.5875 33.6881 3.87821 32.7791 4.42633L17.0387 13.9181L1.48663 4.42115C0.580153 3.86761 0.235986 2.57483 0.717909 1.53365C1.19983 0.492464 2.32535 0.097152 3.23182 0.650692L17.0497 9.08858L31.051 0.64551C31.96 0.0973872 33.0837 0.499411 33.5609 1.54346Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ══ PHASE 1+: Logo zoom-out + crossfade sequence ═════════════════ */}
      <div className="cr-hero-1-container">

        {/* cr-logo-main: colored blue-teal via CSS filter, turns white as it settles */}
        <img
          className="cr-logo-main"
          src="/SnooSpace_TEXT_LOGO_Dark.svg"
          alt=""
          draggable={false}
        />

        {/* cr-logo-oo-cut: pre-positioned at top:20% — matches exactly where main lands */}
        <img
          className="cr-logo-oo-cut"
          src="/SnooSpace_TEXT_LOGO_Dark _oo_CUT.svg"
          alt=""
          draggable={false}
        />

        {/* cr-logo-final: Master Logo at same settled centre point */}
        <img
          className="cr-logo-final"
          src="/SnooSpace_Master_Logo_Dark.svg"
          alt="SnooSpace"
          draggable={false}
        />
      </div>

      {/* ══ PHASE 4: Tagline panel ════════════════════════════════════════ */}
      <div className="cr-hero-2-container">
        <h3>Your Community. Your Space.</h3>
        <p>
          SnooSpace is where your people gather — discover events near you,
          grab tickets instantly, and feel the pulse of your community.
        </p>
      </div>

    </div>
  );
}
