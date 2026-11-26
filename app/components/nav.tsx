import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { person, projects } from "../content";
import { useMotionOn } from "../motion";

const items = [
  ...Object.values(projects).map((p) => ({ to: `/${p.slug}`, label: p.name })),
  { to: "/how-i-work", label: "How I work" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const { key, pathname } = useLocation();
  useEffect(() => setOpen(false), [key]);
  // The bar dresses as whichever project is behind it. A project page opens on its own colour, so start there.
  const top = useRef<HTMLDivElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState(() => Object.values(projects).find((p) => pathname.startsWith(`/${p.slug}`))?.slug);
  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const under = document.elementsFromPoint(innerWidth / 2, 42).find((e) => !e.closest(".nav"));
      setTheme(under?.closest<HTMLElement>("[data-nav]")?.dataset.nav);
      for (const edge of [top.current, bottom.current]) {
        if (!edge) continue;
        const box = edge.getBoundingClientRect();
        edge.style.backgroundColor = colourAt(Math.min(box.top + 1, innerHeight - 2));
      }
    };
    const queue = () => { frame ||= requestAnimationFrame(read); };
    read();
    // ponytail: the next page swaps in during the transition with no event to listen for, so look again after it.
    const later = [setTimeout(read, 450), setTimeout(read, 1100)];
    addEventListener("scroll", queue, { passive: true });
    addEventListener("resize", queue);
    return () => {
      cancelAnimationFrame(frame);
      later.forEach(clearTimeout);
      removeEventListener("scroll", queue);
      removeEventListener("resize", queue);
    };
  }, [key]);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", close);
    return () => removeEventListener("keydown", close);
  }, [open]);
  // The colours cross-fade straight away. The typeface can't, so the words dip out, change face and come back.
  const on = useMotionOn();
  const [face, setFace] = useState(theme);
  useEffect(() => {
    if (!on) return setFace(theme);
    const t = setTimeout(() => setFace(theme), 190);
    return () => clearTimeout(t);
  }, [theme, on]);
  return (
    <>
    <div ref={top} className="edge" aria-hidden="true" />
    <div ref={bottom} className="edge is-bottom" aria-hidden="true" />
    <header className={open ? "nav is-open" : "nav"} data-theme={theme} data-face={face} data-swap={theme !== face ? "" : undefined}>
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
    </>
  );
}

/**
 * The colour the page shows at the middle of one screen row. Safari colours its toolbars from a fixed layer at each
 * screen edge, and holds on to an old colour without one, so two thin strips carry what is behind them.
 */
function colourAt(y: number) {
  const under = document.elementsFromPoint(innerWidth / 2, y).filter((e) => !e.closest(".nav, .edge"));
  for (let e: Element | null = under[0] ?? null; e; e = e.parentElement) {
    const colour = getComputedStyle(e).backgroundColor;
    // Only what spans the screen counts, so a button or a panel passing the edge doesn't flash its colour.
    if (!/^(transparent|rgba\(.*, 0\))$/.test(colour) && e.clientWidth >= innerWidth - 1) return colour;
  }
  return "";
}
