import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./AfterScreen.css";

gsap.registerPlugin(ScrollTrigger);

const AfterScreen = () => {
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
      tl.to(".as-eyebrow", {
        opacity: 1,
        x: 0,
        duration: 0.5,
      });

      tl.to(".as-quote-word", {
        opacity: 1,
        y: 0,
        stagger: 0.06,
        duration: 0.6,
      }, "<0.2");

      tl.to(".as-right", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "expo.out",
      }, "<0.3");

      // BEAT 2A (The Regret + Punch Line)
      tl.to(".as-subtext-beat-1", {
        opacity: 1,
        y: 0,
        duration: 0.8,
      }, "+=0.3");

      // BEAT 2B (Switch to The Solution)
      tl.to(".as-subtext-beat-1", {
        opacity: 0,
        y: -15,
        duration: 0.4,
      }, "+=1.5"); // Extra time to read "You didn't."

      tl.to(".as-subtext-beat-2", {
        opacity: 1,
        y: 0,
        duration: 0.8,
      }, "<0.2");

      // BEAT 3 (Final Pull Quote)
      tl.to(".as-pull-quote", {
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
    <section className="after-screen" ref={sectionRef}>
      <div className="as-container">
        <div className="as-left">
          <p className="as-eyebrow" style={{ transform: "translateX(-20px)" }}>
            AFTER THE EVENT · THE ONE THAT GOT AWAY
          </p>

          <h2 className="as-quote">
            <span className="as-quote-line as-quote-line-1">
              {"You remember exactly who they were.".split(" ").map((word, i) => (
                <span
                  key={i}
                  className="as-quote-word"
                  style={{ display: "inline-block", marginRight: "0.25em" }}
                >
                  {word}
                </span>
              ))}
            </span>
            <span className="as-quote-line as-quote-line-2">
              {"You just never got their name.".split(" ").map((word, i) => (
                <span
                  key={i}
                  className="as-quote-word"
                  style={{ display: "inline-block", marginRight: "0.25em" }}
                >
                  {word}
                </span>
              ))}
            </span>
          </h2>

          <div className="as-subtext-wrapper">
            <div className="as-subtext-beat-1">
              <p className="as-subtext">
                The event is over. You're on your way back, replaying it in your
                head. There was that person — interesting, your type of people,
                the kind you don't meet every day. You almost went over. You
                made eye contact once. You told yourself you'd find them before
                it ended.
              </p>
              <p className="as-subtext-punch">
                You didn't.
              </p>
            </div>
            <div className="as-subtext-beat-2">
              <p className="as-subtext">
                Most platforms close when the event does. The attendee list
                disappears, the moment passes, and that connection goes with it.
                SnooSpace keeps the door open. Every person who attended that
                event is still there, still reachable — for as long as it takes
                you to find the courage to say hello.
              </p>
            </div>
          </div>
        </div>

        <div className="as-right">
          <div className="phone-mockup">
            <div className="phone-screen" />
          </div>
        </div>
      </div>

      <div className="as-indicator">
        <div className="as-indicator-line-track">
          <div className="as-indicator-line-progress" />
        </div>
        <div className="as-indicator-item ds-indicator-item-before filled">
          <div className="dot" />
          <span>Before</span>
        </div>
        <div className="as-indicator-item ds-indicator-item-during filled">
          <div className="dot" />
          <span>During</span>
        </div>
        <div className="as-indicator-item ds-indicator-item-after filled active">
          <div className="dot" />
          <span>After</span>
        </div>
      </div>
    </section>
  );
};

export default AfterScreen;
