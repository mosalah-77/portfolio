import { Link } from "react-router";
import { newTab, person } from "../content";
import { useRise } from "../motion";

export function Footer() {
  const ref = useRise<HTMLElement>();
  return (
    <footer id="contact" className="footer" ref={ref}>
      <h2 data-rise>I'm looking for a junior role, fully remote.</h2>
      <ul data-rise>
        <li><a href={`mailto:${person.email}`}>{person.email}</a></li>
        <li><a href={person.linkedin} {...newTab}>LinkedIn</a></li>
        <li><a href={person.github} {...newTab}>GitHub</a></li>
        <li><CvLink /></li>
      </ul>
      <p className="fine" data-rise>I work with AI coding tools. Each project's README explains how it was made, and <Link to="/how-i-work">how I work</Link> covers the rest.</p>
      <p className="giant" aria-hidden="true">{person.name}</p>
    </footer>
  );
}

/** Downloads the CV. Without a file in person.cv the button stays, switched off. */
export function CvLink({ className }: { className?: string }) {
  return person.cv ? (
    <a className={className} href={person.cv} download>Download CV</a>
  ) : (
    <button type="button" className={className ?? "plain"} aria-disabled="true">CV (being updated)</button>
  );
}
