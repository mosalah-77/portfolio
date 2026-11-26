import { Link } from "react-router";
import { pageTitle } from "../content";

export const meta = () => [{ title: pageTitle("Page not found") }, { name: "robots", content: "noindex" }];

export default function NotFound() {
  return (
    <section className="how is-page">
      <h1>Page not found</h1>
      <p>That address isn't on this site.</p>
      <p className="links"><Link className="btn" to="/">Go to the home page</Link></p>
    </section>
  );
}
