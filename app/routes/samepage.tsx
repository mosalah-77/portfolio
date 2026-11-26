import { Facts, ProjectPage, Story } from "../components/project-page";
import { ReviewReplay } from "../components/review-replay";
import { pictures, projects, pageMeta } from "../content";

const { samepage, oriel } = projects;
export const meta = () => pageMeta(`/${samepage.slug}`, "samepage", samepage.line, samepage.name);

export default function Samepage() {
  return (
    <ProjectPage
      project={samepage}
      next={oriel}
      image={{ ...pictures.samepage, alt: "The client's side of a brief: the studio's questions, the answers so far and a panel showing what is left." }}
    >
      <Story title="From a form to a conversation">
        <p>The first version showed the brief, requests, history and activity on one screen, and you had to work out the order yourself. I threw it out.</p>
        <p>Now the studio asks six questions and the client answers one at a time. The studio approves one version or sends it back with a note, and an approved brief becomes a handoff with a first-jobs list.</p>
      </Story>
      <Story title="A short walkthrough">
        <p>A client answers the studio's questions and sends the brief. The studio asks for a change, then approves the next version. No sound.</p>
        <video controls playsInline preload="none" poster="/img/samepage-walkthrough.webp" width={1920} height={1080} aria-label="Screen recording of Samepage, from the first question to the approved brief">
          <source src="/media/samepage-walkthrough.mp4" type="video/mp4" />
        </video>
      </Story>
      <Story title="What I noticed in review">
        <p>While reviewing a later design I noticed the client's screen listed other clients' projects, so that came out before release. The server refuses that access.</p>
        <ReviewReplay />
      </Story>
      <Facts
        title="Worth a look"
        items={[
          { name: "One client can't see another's work", text: "Every read and write is checked on the server. Someone else's project gets the same 404 as one that doesn't exist." },
          { name: "Two saves at once can't overwrite each other", text: "Each change carries the version it last saw. One save wins and the other is asked to send again." },
          { name: "A retry can't save twice", text: "If the reply is lost and the browser tries again, the server returns the first result." },
          { name: "Approval points at one version", text: "Answers are never edited in place, so the handoff reads exactly what was approved." },
        ]}
      />
      <Story title="My decisions">
        <p>I set the scope, picked the stack, took the design through several rounds and decided what shipped.</p>
        <p className="fine">The people and companies in the demo are made up.</p>
      </Story>
    </ProjectPage>
  );
}
