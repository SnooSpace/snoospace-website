import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./BeforeScreen.css";

gsap.registerPlugin(ScrollTrigger);

const BeforeScreen = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

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

      // BEAT 1
      tl.to(".bs-eyebrow", {
        opacity: 1,
        x: 0,
        duration: 0.5,
      });

      tl.to(".bs-quote-word", {
        opacity: 1,
        y: 0,
        stagger: 0.06,
        duration: 0.6,
      }, "<0.2");

      tl.to(".bs-right", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "expo.out"
      }, "<0.3");

      // BEAT 2
      tl.to(".bs-subtext-wrapper", {
        opacity: 1,
        y: 0,
        duration: 0.8,
      }, "+=0.3");

      // BEAT 3
      tl.to(".bs-pull-quote", {
        opacity: 1,
        x: 0,
        duration: 0.7,
      }, "+=0.3");

      // INDICATOR ANIMATION (Stay at Before)
      tl.set(".bs-indicator-line-progress", { width: "0%" }, 0);
      
      // We fill the line to 'During' as we scroll, but keep the labels dimmed
      tl.to(".bs-indicator-line-progress", {
        width: "50%",
        duration: 0.8,
        ease: "power2.inOut"
      }, "+=0.5");
      
      tl.set(".bs-indicator-item-during", { 
        className: "bs-indicator-item bs-indicator-item-during filled" 
      }, "<0.4");

      // Add labels for syncing
      tl.addLabel("beat2_start", "-=1.8");
      tl.addLabel("beat3_start", "-=0.7");

      // Add space at the end of the scroll for reading the final beat
      tl.to({}, { duration: 0.5 });
      
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="before-screen" ref={sectionRef}>
      <div className="bs-container" ref={containerRef}>
        <div className="bs-left">
          <p className="bs-eyebrow" style={{ transform: "translateX(-20px)" }}>
            ATTENDEE DISCOVERY · YOU'RE NOT ALONE
          </p>
          
          <h2 className="bs-quote">
            <span className="bs-quote-line bs-quote-line-1">
              {"Going alone feels like".split(" ").map((word, i) => (
                <span key={i} className="bs-quote-word" style={{ display: "inline-block", marginRight: "0.25em" }}>
                  {word}
                </span>
              ))}
            </span>
            <span className="bs-quote-line bs-quote-line-2">
              {"showing up naked.".split(" ").map((word, i) => (
                <span key={i} className="bs-quote-word" style={{ display: "inline-block", marginRight: "0.25em" }}>
                  {word}
                </span>
              ))}
            </span>
          </h2>

          <div className="bs-subtext-wrapper">
            <p className="bs-subtext">
              You got the invite. You want to go. But it's a room full of strangers, and the thought of showing up solo, standing alone, making small talk with nobody — it kills you. So you don't go. Or you go and spend the whole time pretending to be on your phone.
            </p>
            <p className="bs-subtext">
              SnooSpace changes that. Connect with attendees before you arrive. Find your people, spark conversations that start before the event even begins. You're not showing up blind anymore. You're showing up with a warm intro waiting — and SnooSpace gives you the ice-breakers to actually start it.
            </p>
          </div>
        </div>

        <div className="bs-right">
          <div className="phone-mockup">
            <div className="phone-screen" />
          </div>
        </div>
      </div>

      <div className="bs-indicator">
        <div className="bs-indicator-line-track">
          <div className="bs-indicator-line-progress" />
        </div>
        <div className="bs-indicator-item bs-indicator-item-before filled active">
          <div className="dot" />
          <span>Before</span>
        </div>
        <div className="bs-indicator-item bs-indicator-item-during">
          <div className="dot" />
          <span>During</span>
        </div>
        <div className="bs-indicator-item bs-indicator-item-after">
          <div className="dot" />
          <span>After</span>
        </div>
      </div>
    </section>
  );
};

export default BeforeScreen;
