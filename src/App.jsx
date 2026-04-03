/* App.jsx — simplified: landing + cinematic are unified inside CinematicReveal */
import { useRef, useEffect } from "react";
import { ChartNoAxesGantt } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "./App.css";
import CinematicReveal from "./CinematicReveal";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const loadOverlayRef = useRef(null);
  const lenisRef       = useRef(null);

  const scrollToTop = () => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { duration: 1.5 });
  };

  useEffect(() => {
    // ── GTA VI-style page load: black overlay fades out ──────────────────
    gsap.to(loadOverlayRef.current, {
      opacity: 0,
      duration: 2.8,
      ease: "power3.out",
      pointerEvents: "none",
    });

    // ── Lenis smooth scroll ───────────────────────────────────────────────
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // ── Mouse cursor glow ─────────────────────────────────────────────────
    let xSetter, ySetter;
    const handleMouseMove = (e) => {
      const cursorGlow = document.querySelector(".cursor-glow");
      if (!cursorGlow) return;
      if (!xSetter) {
        xSetter = gsap.quickSetter(cursorGlow, "left", "px");
        ySetter = gsap.quickSetter(cursorGlow, "top", "px");
      }
      xSetter(e.clientX);
      ySetter(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      lenis.destroy();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="app-container">
      {/* GTA VI-style black load overlay */}
      <div ref={loadOverlayRef} className="load-overlay" />

      {/* Global persistent mouse cursor glow */}
      <div className="cursor-glow" />

      {/* Fixed navigation */}
      <nav className="global-nav">
        <img
          src="/Icon_Dark.svg"
          alt="SnooSpace"
          className="nav-logo"
          onClick={scrollToTop}
        />
        <ChartNoAxesGantt className="nav-icon" />
      </nav>

      {/* Unified hero: video landing + GTA VI scroll animation */}
      <CinematicReveal />

      {/* Future content sections */}
      <div className="post-reveal-content" />
    </div>
  );
}

export default App;