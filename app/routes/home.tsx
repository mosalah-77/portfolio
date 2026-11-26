import { Link } from "react-router";
import { Chapters } from "../components/chapters";
import { Hero } from "../components/hero";
import { Thread } from "../components/thread";
import { answers, pageTitle, person } from "../content";

export const meta = () => [
  { title: pageTitle() },
  { name: "description", content: person.intro },
  { property: "og:title", content: pageTitle() },
  { property: "og:description", content: person.intro },
];

export default function Home() {
  return (
    <>
      <Hero />
      <Chapters />
      <section className="how">
        <Thread items={answers.slice(0, 2)} />
        <Link className="btn" to="/how-i-work">More about how I work</Link>
      </section>
    </>
  );
}
