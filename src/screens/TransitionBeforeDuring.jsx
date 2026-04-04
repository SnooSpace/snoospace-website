import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./TransitionBeforeDuring.css";

gsap.registerPlugin(ScrollTrigger);

export default function TransitionBeforeDuring() {
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Parallax & fade in for left text
      gsap.fromTo(
        ".ts-text",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 30%",
            scrub: 1,
          },
        }
      );

      // Parallax & fade in for right text
      gsap.fromTo(
        ".ts-subtext",
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%", // slightly after left
            end: "top 20%",
            scrub: 1,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="transition-screen" ref={sectionRef}>
      <div className="ts-container">
        <div className="ts-left">
          <h2 className="ts-text">
            Showing up alone <br />
            might seem scary.
          </h2>
        </div>
        <div className="ts-right">
          <p className="ts-subtext">
            But showing up when <br />
            a friend is waiting? <br />
            That changes everything.
          </p>
        </div>
      </div>
    </section>
  );
}
