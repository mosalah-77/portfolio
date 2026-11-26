import { Link } from "react-router";
import { Chapters } from "../components/chapters";
import { Hero } from "../components/hero";
import { Thread } from "../components/thread";
import { answers, person, pageMeta } from "../content";

export const meta = () => pageMeta("/", "portfolio", person.intro);

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
