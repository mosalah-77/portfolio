import { motionValue, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { person, reviewSteps } from "../content";
import { Letters, useMotionOn, useRange } from "../motion";
import { cubicBezier } from "motion";
import { ReviewScene } from "./review-scene";

const still = motionValue(0.45); // the circled moment, for the version without motion
const ease = cubicBezier(0.65, 0, 0.35, 1);

/** Layout position, ignoring any transform in progress. */
function offsetIn(el: HTMLElement, ancestor: string) {
  let left = 0;
  let top = 0;
  for (let e: HTMLElement | null = el; e && !e.matches(ancestor); e = e.offsetParent as HTMLElement | null) {
    left += e.offsetLeft;
    top += e.offsetTop;
  }
  return { left, top };
}

/**
 * The screen starts as a small window inside the name. Scrolling grows it out of the
 * headline while the two names part, then plays the review.
 */
export function Hero() {
  const on = useMotionOn();
  const section = useRef<HTMLElement>(null);
  const slot = useRef<HTMLSpanElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: section, offset: ["start start", "end end"] });

  const open = useRange(p, [0.02, 0.34], [0, 1], ease);
  const story = useRange(p, [0.36, 0.96], [0, 1]);
  const x0 = useMotionValue(0);
  const y0 = useMotionValue(0);
  const s0 = useMotionValue(0.2);
  const x = useTransform(() => x0.get() * (1 - open.get()));
  const y = useTransform(() => y0.get() * (1 - open.get()));
  const scale = useTransform(() => s0.get() + (1 - s0.get()) * open.get());
  const first = useRange(open, [0, 1], ["0%", "-115%"]);
  const second = useRange(open, [0, 1], ["0%", "115%"]);
  const lead = useRange(p, [0, 0.12], [1, 0]);
  const leadY = useRange(p, [0, 0.14], [0, -40]);

  useEffect(() => {
    if (!on) return;
    const measure = () => {
      if (!slot.current || !frame.current) return;
      const { left, top } = offsetIn(slot.current, ".hero-pin");
      const { offsetWidth: w, offsetHeight: h, offsetLeft: fl, offsetTop: ft } = frame.current;
      x0.set(left + slot.current.offsetWidth / 2 - (fl + w / 2));
      y0.set(top + slot.current.offsetHeight / 2 - (ft + h / 2));
      s0.set(slot.current.offsetWidth / w);
      frame.current.dataset.ready = "1";
    };
    measure();
    document.fonts.ready.then(measure);
    addEventListener("resize", measure);
    return () => removeEventListener("resize", measure);
  }, [on]);

  const [step, setStep] = useState(0);
  useMotionValueEvent(story, "change", (v) => setStep(v < 0.14 ? 0 : v < 0.6 ? 1 : 2));
  const captions = useRange(open, [0.75, 1], [0, 1]);

  return (
    <section className="hero" ref={section}>
      <div className="hero-pin">
        <h1 aria-label={person.name}>
          <m.span className="hero-line" aria-hidden="true" style={on ? { x: first } : undefined}>
            <Letters text="Mohamed" /><span className="slot-wrap"><span className="slot" ref={slot} /></span>
          </m.span>{" "}
          <m.span className="hero-line" aria-hidden="true" style={on ? { x: second } : undefined}>
            <Letters text="Elmorshedy" />
          </m.span>
        </h1>
        <m.div className="hero-lead" style={on ? { opacity: lead, y: leadY } : undefined}>
          <p>{person.intro}</p>
          <p className="links">
            <a className="btn" href="#projects">See the projects</a>
            <Link className="text-link" to="/how-i-work">How I work</Link>
          </p>
        </m.div>
        <m.div className="hero-frame" ref={frame} style={on ? { x, y, scale } : undefined}>
          <ReviewScene key={String(on)} t={on ? story : still} />
        </m.div>
        <m.div className="hero-steps" style={on ? { opacity: captions } : undefined}>
          <ol>
            {reviewSteps.map((s, i) => (
              <li key={s} data-on={i === step}>{s}</li>
            ))}
          </ol>
          <p className="fine">Redrawn for this page. The companies are made up.</p>
        </m.div>
      </div>
    </section>
  );
}
