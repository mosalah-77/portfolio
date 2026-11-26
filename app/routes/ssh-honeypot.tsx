import { useScroll } from "motion/react";
import { useRef } from "react";
import { Session } from "../components/chapters";
import { Facts, ProjectPage, Story } from "../components/project-page";
import { pageTitle, pictures, projects, fontLinks } from "../content";
import { useMotionOn } from "../motion";

const { honeypot, samepage } = projects;
export const links = fontLinks("jetbrains-mono");
export const meta = () => [{ title: pageTitle(honeypot.name) }, { name: "description", content: honeypot.line }];

export default function Honeypot() {
  return (
    <ProjectPage
      project={honeypot}
      next={samepage}
      image={{ ...pictures.dashboard, alt: "The honeypot's dashboard: counts of login attempts and commands, the most tried usernames and passwords, and a live feed." }}
    >
      <Story title="One visit, start to finish">
        <p>A wrong password is refused, as a real server would refuse it. A weak one is let in on purpose. From then on the visitor is typing into a decoy that looks each command up in a short list and prints text back.</p>
        <Visit />
        <p className="fine">Redrawn for this page from a test on my own machine.</p>
      </Story>
      <Facts
        title="Worth a look"
        items={[
          { name: "It passes for a real server", text: "The scanner nmap reports it as OpenSSH 9.6 on Ubuntu, and the fake shell's answers match that release." },
          { name: "It fools a brute-force tool", text: "Hydra reports the weak passwords as valid logins, so the attacker's own tooling thinks it got in." },
          { name: "Nothing typed is ever run", text: "The shell has no way to run a command. It only matches what was typed against its list." },
          { name: "The dashboard can't be turned on its owner", text: "Whatever an attacker types is shown as text, never as HTML. A password written as a script tag is only characters on the screen." },
          { name: "Only my own machine can reach it", text: "It listens on 127.0.0.1, so nothing on the network or the internet gets to it." },
        ]}
      />
      <Story title="Where it stops">
        <p>This is a small learning project. A person poking at the shell would see through it quickly: there are no files to read and only a handful of commands answer.</p>
        <p>It has only run on my own machine, so nothing here was caught from a real attacker. The README lists the other limits and what it would take to put it on the internet safely.</p>
      </Story>
      <Story title="My decisions">
        <p>I wanted a small security project I could run and explain. I chose a real SSH handshake over a plain socket, because nothing less gets far enough to see a password, and I set the rule that it stays on my own machine.</p>
        <p>I decided how far the decoy goes and set the dashboard's look. I tested each version by hand in a terminal: guessing passwords, getting cut off, logging in with a weak one and typing into the fake shell while the log filled up.</p>
      </Story>
    </ProjectPage>
  );
}

function Visit() {
  const on = useMotionOn();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "start 0.2"] });
  return <div ref={ref}><Session t={on ? scrollYProgress : undefined} /></div>;
}
