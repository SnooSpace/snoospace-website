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
        scale: 45,
        opacity: 0,
        // The second 'S' (in "Space") is exactly in the center of the logo.
        // X bounds: 397.78 to 489.58 => Center: 443.68.  443.68/893 = 49.68%
        // Y bounds => Center: ~49.5%
        transformOrigin: "49.68% 49.5%",   // Exact geometrical center of the 2nd 'S'
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
          end: "+=3000",
          ease: "none",
          invalidateOnRefresh: true,
        },
      });

      // ── PHASE 0: Everything fades simultaneously (play btn, coming soon, video bg) ──
      tl.to(".cr-video-layer", { opacity: 0, duration: 0.8, ease: "power2.inOut" }, 0);
      tl.to(".initial-scroll", { opacity: 0, duration: 0.4 }, 0);

      // ── PHASE 1: CinematicReveal begins AFTER the fade is complete ──
      // Logo fades in — starts colored (blue-teal), gradually turns white
      // Starts at t=0.8 (right after fade completes) for a clean black gap
      tl.to(".cr-logo-main", { opacity: 1, duration: 1.2 }, 0.8);

      // Simultaneously: scale 45→1 AND rise 50%→20% (pure GTA VI zoom-out)
      // transformOrigin stays at second 'S' — pivot rises from viewport-center to top-20%
      tl.fromTo(
        ".cr-logo-main",
        { scale: 45, top: "50%" },
        { scale: 1,  top: "20%", duration: 2.5, ease: "power2.inOut" },
        1.3
      );

      // ── PHASE 3a: logo (now white) → oo-cut crossfade ─────────────────
      // Label the start so tagline + Phase 3b can both reference it independently
      tl.addLabel("phase3a");
      tl.to(".cr-logo-main",   { opacity: 0, duration: 0.8 }, "phase3a");
      tl.to(".cr-logo-oo-cut", { opacity: 1, duration: 0.8 }, "phase3a");

      // ── PHASE 4: Ghost appears at phase3a, then blooms to full (GTA VI style) ──
      // Instantly set to ghost state (visible but faint) exactly when white logo settles
      tl.set(".cr-hero-2-container", { visibility: "visible", opacity: 0.07 }, "phase3a");
      // Then bloom from ghost → full vibrant color
      tl.to(".cr-hero-2-container", { opacity: 1, duration: 2.5, ease: "power2.inOut" }, "phase3a");

      // ── PHASE 3b: oo-cut → Master Logo crossfade ───────────────────────
      // Anchored to label+0.8 so it fires after 3a's 0.8s crossfade,
      // independent of the tagline's longer 2.5s fade
      tl.to(".cr-logo-oo-cut", { opacity: 0, duration: 0.6 }, "phase3a+=0.8");
      tl.to(".cr-logo-final",  { opacity: 1, duration: 0.6 }, "phase3a+=0.8");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="cr-container">

      {/* ══ PHASE 0: Landing layer (fades as one unit on scroll) ══════════ */}
      <div className="cr-video-layer">
        <div className="cr-landing-bg" />

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
