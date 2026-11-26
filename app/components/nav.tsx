import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { person, projects } from "../content";

const items = [
  ...Object.values(projects).map((p) => ({ to: `/${p.slug}`, label: p.name })),
  { to: "/how-i-work", label: "How I work" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const { key } = useLocation();
  useEffect(() => setOpen(false), [key]);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", close);
    return () => removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className={open ? "nav is-open" : "nav"}>
      <Link to="/" className="nav-name">{person.name}</Link>
      <button type="button" className="nav-toggle" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(!open)}>
        {open ? "Close" : "Menu"}
      </button>
      <nav id="menu" aria-label="Main">
        {items.map((i) => (
          <NavLink key={i.to} to={i.to}>{i.label}</NavLink>
        ))}
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
}
