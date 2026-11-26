import { person } from "../content";
import { useRise } from "../motion";

export function Footer() {
  const ref = useRise<HTMLElement>();
  return (
    <footer id="contact" className="footer" ref={ref}>
      <h2 data-rise>I'm looking for a junior role, fully remote.</h2>
      <ul data-rise>
        <li><a href={`mailto:${person.email}`}>{person.email}</a></li>
        <li><a href={person.linkedin}>LinkedIn</a></li>
        <li><a href={person.github}>GitHub</a></li>
        <li><CvLink /></li>
      </ul>
      <p className="giant" aria-hidden="true">{person.name}</p>
    </footer>
  );
}

/** Stays on the page without a file until the final CV is ready; then set person.cv. */
export function CvLink({ className }: { className?: string }) {
  return person.cv ? (
    <a className={className} href={person.cv} download>Download CV</a>
  ) : (
    <button type="button" className={className ?? "plain"} aria-disabled="true">CV (being updated)</button>
  );
}
