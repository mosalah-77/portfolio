import { Thread } from "../components/thread";
import { answers, pageMeta } from "../content";
import { Letters } from "../motion";

export const meta = () => pageMeta("/how-i-work", "portfolio", "Questions I get asked about how I build software, and my answers.", "How I work");

export default function HowIWork() {
  return (
    <section className="how is-page">
      <h1 aria-label="How I work"><Letters text="How I work" /></h1>
      <Thread items={answers} />
    </section>
  );
}
