import { useScroll } from "motion/react";
import * as m from "motion/react-m";
import { useRef } from "react";
import { Link } from "react-router";
import type { Project } from "../content";
import { Letters, useMotionOn, useRange, useRise } from "../motion";
import { ProjectLinks } from "./links";

type Img = { src: string; srcSet?: string; sizes?: string; alt: string; width: number; height: number };

export function ProjectPage({ project, image, next, still, children }: { project: Project; image: Img; next: Project; still?: boolean; children: React.ReactNode }) {
  return (
    <div data-nav={project.slug} className={`project is-${project.slug}`} style={{ "--page": project.color } as React.CSSProperties}>
      <section className="project-hero">
        <div className="project-head">
          <h1 aria-label={project.name}><Letters text={project.name} /></h1>
          <div className="project-lead">
            <p>{project.line}</p>
            <p className="stack">{project.stack}</p>
            <ProjectLinks project={project} />
          </div>
        </div>
        <GrowImage image={image} on={useMotionOn() && !still} />
      </section>
      <div className="project-body">{children}</div>
      <Link data-nav={next.slug} className={`next is-${next.slug}`} to={`/${next.slug}`} style={{ "--page": next.color } as React.CSSProperties}>
        <span>Next project</span>
        <strong>{next.name}</strong>
      </Link>
    </div>
  );
}

function GrowImage({ image, on }: { image: Img; on: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: t } = useScroll({ target: ref, offset: ["start end", "start 0.1"] });
  const scale = useRange(t, [0, 1], [0.78, 1]);
  const rotateX = useRange(t, [0, 1], [24, 0]);
  return (
    <div className="persp project-image" ref={ref}>
      <m.img style={on ? { scale, rotateX } : undefined} {...image} fetchPriority="high" />
    </div>
  );
}

export function Facts({ title, items }: { title: string; items: { name: string; text: string }[] }) {
  const ref = useRise<HTMLElement>();
  return (
    <section className="facts" ref={ref}>
      <h2 data-rise>{title}</h2>
      <dl>
        {items.map((i) => (
          <div key={i.name} data-rise>
            <dt>{i.name}</dt>
            <dd>{i.text}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function Story({ title, children }: { title: string; children: React.ReactNode }) {
  const ref = useRise<HTMLElement>();
  return (
    <section className="story" ref={ref}>
      <h2 data-rise>{title}</h2>
      <div data-rise>{children}</div>
    </section>
  );
}
