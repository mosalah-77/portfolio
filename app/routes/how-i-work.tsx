import { Thread } from "../components/thread";
import { answers, pageTitle } from "../content";
import { Letters } from "../motion";

export const meta = () => [
  { title: pageTitle("How I work") },
  { name: "description", content: "Questions I get asked about how I build software, and my answers." },
];

export default function HowIWork() {
  return (
    <section className="how is-page">
      <h1><Letters text="How I work" /></h1>
      <Thread items={answers} />
    </section>
  );
}
