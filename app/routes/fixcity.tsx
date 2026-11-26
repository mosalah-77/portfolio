import { useScroll } from "motion/react";
import { useRef } from "react";
import { Stages } from "../components/chapters";
import { Facts, ProjectPage, Story } from "../components/project-page";
import { pictures, projects, fontLinks, pageMeta } from "../content";
import { useMotionOn } from "../motion";

const { fixcity, honeypot } = projects;
export const links = fontLinks("work-sans");
export const meta = () => pageMeta(`/${fixcity.slug}`, "fixcity", fixcity.line, fixcity.name);

export default function FixCity() {
  return (
    <ProjectPage
      project={fixcity}
      next={honeypot}
      still
      image={{ ...pictures.phone, alt: "FixCity's home screen, with a button to report a problem and a grid of problem types." }}
    >
      <Story title="From a report to a repair">
        <p>A resident describes a problem, picks a location and follows the report through staff review and the district's repair.</p>
        <Journey />
      </Story>
      <Facts
        title="What I spotted"
        items={[
          { name: "Duties that overlapped", text: "Staff and district jobs ran into each other. Handing a report off and repairing it are now separate permissions." },
          { name: "A photo problem on a crew's first update", text: "Photos can now go with the first update, and stay beside the entry they belong to." },
        ]}
      />
      <Story title="A team project">
        <p>FixCity started as a six-person graduation project at my university. I worked on the user flow, shared the technical direction and built parts of the frontend, then extended it into a browser demo. The team and the original repository are credited in the README.</p>
        <p className="fine">A student prototype with made-up data. It is not an official government service.</p>
      </Story>
    </ProjectPage>
  );
}

function Journey() {
  const on = useMotionOn();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "start 0.25"] });
  return <div ref={ref}><Stages t={on ? scrollYProgress : undefined} /></div>;
}
