import { useInView, useScroll, useTransform, type MotionValue } from "motion/react";
import * as m from "motion/react-m";
import { useRef } from "react";
import { Link } from "react-router";
import { fixcityStages, honeypotSession, pictures, projects, type Project } from "../content";
import { useMotionOn, useRange } from "../motion";
import { ProjectLinks } from "./links";

/** Full-screen projects. Each pins, and the next one slides over it while the covered one falls back. */
export function Chapters() {
  const marks = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  return (
    <div className="chapters" id="projects">
      <div ref={marks[0]} />
      <Samepage mark={marks[0]} next={marks[1]} />
      <div ref={marks[1]} />
      <Oriel mark={marks[1]} next={marks[2]} />
      <div ref={marks[2]} />
      <FixCity mark={marks[2]} next={marks[3]} />
      <div ref={marks[3]} />
      <Honeypot mark={marks[3]} />
      <div className="chapter-hold" />
    </div>
  );
}

type Mark = React.RefObject<HTMLDivElement | null>;
const full = { get: () => 1 };

/** 0 to 1 while the chapter slides in. */
const useEnter = (mark: Mark) => useScroll({ target: mark, offset: ["start end", "start start"] }).scrollYProgress;

function Cover({ next, slug, className, children }: { next?: Mark; slug: string; className: string; children: React.ReactNode }) {
  const on = useMotionOn();
  const own = useRef<HTMLDivElement>(null); // the last chapter is never covered
  // Each chapter brings its words in its own way (app.css). The attribute only exists once motion is on,
  // so the words are never hidden in the HTML.
  const box = useRef<HTMLElement>(null);
  const seen = useInView(box, { amount: 0.3, once: true });
  const covered = useScroll({ target: next ?? own, offset: ["start end", "start start"] }).scrollYProgress;
  const scale = useRange(covered, [0, 1], [1, 0.9]);
  const opacity = useRange(covered, [0.2, 1], [1, 0.35]);
  // Once the next chapter covers this one it lets go of the screen and sits back in the page above. Left pinned,
  // Safari colours its toolbar from the first pinned layer it finds, even a hidden one.
  const position = useTransform(covered, (v) => (v >= 1 ? "relative" : "sticky"));
  return (
    <m.article style={on && next ? { position } : undefined} ref={box} data-nav={slug} data-in={on ? (seen ? "1" : "0") : undefined} className={`chapter ${className}${next ? "" : " is-last"}`}>
      <m.div className="chapter-in" style={on && next ? { scale, opacity } : undefined}>{children}</m.div>
      {!next && <div ref={own} />}
    </m.article>
  );
}

function Copy({ project }: { project: Project }) {
  return (
    <div className="chapter-copy">
      <h2><Link to={`/${project.slug}`}>{project.name}</Link></h2>
      <p>{project.line}</p>
      <p className="stack">{project.stack}</p>
      <ProjectLinks project={project} />
      <Link className="text-link more" to={`/${project.slug}`}>How I made {project.name}</Link>
    </div>
  );
}

function Samepage({ mark, next }: { mark: Mark; next: Mark }) {
  const on = useMotionOn();
  const t = useEnter(mark);
  const rotateX = useRange(t, [0, 1], [38, 0]);
  const y = useRange(t, [0, 1], [220, 0]);
  const scale = useRange(t, [0, 1], [0.82, 1]);
  return (
    <Cover next={next} slug={projects.samepage.slug} className="is-samepage">
      <Copy project={projects.samepage} />
      <div className="persp">
        <m.img style={on ? { rotateX, y, scale } : undefined} {...pictures.samepage} loading="lazy" alt="Samepage: the studio's questions on the left, the client's answers on the right and a panel showing how many answers are left." />
      </div>
    </Cover>
  );
}

function Oriel({ mark, next }: { mark: Mark; next: Mark }) {
  const on = useMotionOn();
  const t = useEnter(mark);
  const clipPath = useRange(t, [0.15, 1], ["inset(22% 34% 22% 34% round 16px)", "inset(0% 0% 0% 0% round 0px)"]);
  const scale = useRange(t, [0.15, 1], [1.35, 1]);
  return (
    <Cover next={next} slug={projects.oriel.slug} className="is-oriel">
      <m.div className="oriel-photo" style={on ? { clipPath } : undefined}>
        <m.img style={on ? { scale } : undefined} {...pictures.olive} loading="lazy" alt="An olive sofa and a reading chair by a window." />
      </m.div>
      <Copy project={projects.oriel} />
    </Cover>
  );
}

function FixCity({ mark, next }: { mark: Mark; next: Mark }) {
  const on = useMotionOn();
  const t = useEnter(mark);
  const { scrollYProgress: hold } = useScroll({ target: mark, offset: ["start 0.5", "start -0.6"] });
  const y = useRange(t, [0.2, 1], [360, 0]);
  const rotate = useRange(t, [0.2, 1], [9, 0]);
  return (
    <Cover next={next} slug={projects.fixcity.slug} className="is-fixcity">
      <div className="phone-wrap">
        <m.img className="phone" style={on ? { y, rotate } : undefined} {...pictures.phone} loading="lazy" alt="FixCity's home screen, with a button to report a problem and a grid of problem types." />
      </div>
      <div>
        <Copy project={projects.fixcity} />
        <Stages t={on ? hold : undefined} />
      </div>
    </Cover>
  );
}

function Honeypot({ mark }: { mark: Mark }) {
  const on = useMotionOn();
  const { scrollYProgress: hold } = useScroll({ target: mark, offset: ["start 0.45", "start -0.5"] });
  return (
    <Cover slug={projects.honeypot.slug} className="is-ssh-honeypot">
      <Copy project={projects.honeypot} />
      <Session t={on ? hold : undefined} />
    </Cover>
  );
}

/** One visit, typed out as the page scrolls: the visitor's terminal, and the log beside it. Without motion it is all there. */
export function Session({ t }: { t?: MotionValue<number> }) {
  const { seen, logged } = honeypotSession;
  const k = t ? "on" : "off";
  return (
    <div className="session">
      <figure>
        <figcaption>What the visitor sees</figcaption>
        <ol>{seen.map((s, i) => <Line key={i + k} t={t} at={i} of={seen.length}>{s}</Line>)}</ol>
      </figure>
      <figure className="is-log">
        <figcaption>What the log keeps</figcaption>
        <ol>
          {logged.map((l) => (
            <Line key={l.text + k} t={t} at={l.at} of={seen.length}>
              <b>{l.kind}</b> {l.text}{l.note && <i> {l.note}</i>}
            </Line>
          ))}
        </ol>
      </figure>
    </div>
  );
}

function Line({ t, at, of, children }: { t?: MotionValue<number>; at: number; of: number; children: React.ReactNode }) {
  const opacity = useTransform(() => ((t ?? full).get() * (of + 1) > at + 0.5 ? 1 : 0.16));
  return <m.li style={{ opacity }}>{children}</m.li>;
}

/** A report's four stages, filled in as the chapter scrolls. Without motion they are simply all filled in. */
export function Stages({ t }: { t?: MotionValue<number> }) {
  return (
    <ol className="stages">
      {fixcityStages.map((s, i) => (
        <Stage key={`${s.name}-${t ? "on" : "off"}`} t={t} i={i} {...s} />
      ))}
    </ol>
  );
}

function Stage({ t, i, name, text }: { t?: MotionValue<number>; i: number; name: string; text: string }) {
  const n = fixcityStages.length;
  const fill = useTransform(() => {
    const v = (t ?? full).get();
    return Math.min(1, Math.max(0, v * n - i));
  });
  const dim = useRange(fill, [0, 0.4], [0.45, 1]);
  return (
    <li>
      <span className="stage-track"><m.span style={{ scaleX: fill }} /></span>
      <m.span className="stage-text" style={{ opacity: dim }}><strong>{name}</strong>{text}</m.span>
    </li>
  );
}
