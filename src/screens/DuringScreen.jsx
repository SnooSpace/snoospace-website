import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./DuringScreen.css";

gsap.registerPlugin(ScrollTrigger);

const DuringScreen = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // BEAT 1 - Headline Reveal
      tl.to(".ds-eyebrow", {
        opacity: 1,
        x: 0,
        duration: 0.5,
      });

      tl.to(".ds-quote-word", {
        opacity: 1,
        y: 0,
        stagger: 0.06,
        duration: 0.6,
      }, "<0.2");

      tl.to(".ds-right", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "expo.out",
      }, "<0.3");

      // INDICATOR INITIAL STATE
      tl.set(".ds-indicator-line-progress", { width: "50%" }, 0);

      // BEAT 2A (Pain Paragraph)
      tl.to(".ds-subtext-beat-1", {
        opacity: 1,
        y: 0,
        duration: 0.8,
      }, "+=0.3");

      // BEAT 2B (Switch to Solution Paragraphs)
      tl.to(".ds-subtext-beat-1", {
        opacity: 0,
        y: -15,
        duration: 0.4,
      }, "+=1.2");

      tl.to(".ds-subtext-beat-2", {
        opacity: 1,
        y: 0,
        duration: 0.8,
      }, "<0.2");

      // Filling Progress to After as we move to solution
      tl.to(".ds-indicator-line-progress", {
        width: "100%",
        duration: 0.8,
        ease: "power2.inOut",
      }, "<");
      
      tl.set(".ds-indicator-item-after", { 
        className: "ds-indicator-item ds-indicator-item-after filled" 
      }, "<0.4");

      // BEAT 3 (Pull Quote)
      tl.to(".ds-pull-quote", {
        opacity: 1,
        x: 0,
        duration: 0.7,
      }, "+=0.2");

      // Final breather
      tl.to({}, { duration: 0.5 });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="during-screen" ref={sectionRef}>
      <div className="ds-container">
        <div className="ds-left">
          <p className="ds-eyebrow" style={{ transform: "translateX(-20px)" }}>
            LIVE AT THE EVENT · IN THE ROOM, NOT IN IT
          </p>

          <h2 className="ds-quote">
            <span className="ds-quote-line ds-quote-line-1">
              {"Everyone seems to know someone.".split(" ").map((word, i) => (
                <span
                  key={i}
                  className="ds-quote-word"
                  style={{ display: "inline-block", marginRight: "0.25em" }}
                >
                  {word}
                </span>
              ))}
            </span>
            <span className="ds-quote-line ds-quote-line-2">
              {"Except you.".split(" ").map((word, i) => (
                <span
                  key={i}
                  className="ds-quote-word"
                  style={{ display: "inline-block", marginRight: "0.25em" }}
                >
                  {word}
                </span>
              ))}
            </span>
          </h2>

          <div className="ds-subtext-wrapper">
            <div className="ds-subtext-beat-1">
              <p className="ds-subtext">
                You made it. The energy is real, the crowd is buzzing, and
                everyone around you seems to already know each other.
                Conversations are flowing, laughter is happening, and you're
                cycling between checking your phone and pretending to look for
                someone you're not actually looking for.
              </p>
            </div>
            <div className="ds-subtext-beat-2">
              <p className="ds-subtext">
                SnooSpace makes the room readable. See who's checked in around you
                right now. Send a connection request without the cold approach.
                Break into the energy without breaking a sweat — because the
                hardest part of any event isn't getting there. It's getting in.
              </p>
              <p className="ds-subtext">
                And SnooSpace gives you exactly what you need to get in — a reason
                to walk up, something to say, and the confidence that they already
                know you're coming.
              </p>
            </div>
          </div>
        </div>

        <div className="ds-right">
          <div className="phone-mockup">
            <div className="phone-screen" />
          </div>
        </div>
      </div>

      <div className="ds-indicator">
        <div className="ds-indicator-line-track">
          <div className="ds-indicator-line-progress" />
        </div>
        <div className="ds-indicator-item ds-indicator-item-before filled">
          <div className="dot" />
          <span>Before</span>
        </div>
        <div className="ds-indicator-item ds-indicator-item-during filled active">
          <div className="dot" />
          <span>During</span>
        </div>
        <div className="ds-indicator-item ds-indicator-item-after">
          <div className="dot" />
          <span>After</span>
        </div>
      </div>
    </section>
  );
};

export default DuringScreen;
