import { AnimatePresence, LazyMotion, domAnimation } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Links, Meta, Scripts, useLocation, useNavigationType, useOutlet } from "react-router";
import { Footer } from "./components/footer";
import { Nav } from "./components/nav";
import { routeColor } from "./content";
import { easeOut, useMotionOn } from "./motion";
import "./app.css";

export const links = () => [
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "preload", href: "/fonts/figtree.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" as const },
];

// Runs before first paint. Without it (no JavaScript, or reduced motion) the page is the plain layout.
const motionFlag = `document.documentElement.classList.add("js");matchMedia("(prefers-reduced-motion: reduce), (max-height: 479px)").matches||document.documentElement.classList.add("motion");history.scrollRestoration="manual"`;

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#eef4fc" />
        <Meta />
        <Links />
        <noscript><style>{".nav{position:static;translate:none;margin:12px auto}.nav nav{display:flex!important}.nav-toggle{display:none!important}"}</style></noscript>
        <script dangerouslySetInnerHTML={{ __html: motionFlag }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  return (
    <main id="main" className="how is-page">
      <h1>Something went wrong</h1>
      <p className="links"><a className="btn" href="/">Go to the home page</a></p>
    </main>
  );
}

const scrolls = new Map<string, number>();

function goTo(hash: string, y: number) {
  const target = hash && document.getElementById(hash.slice(1));
  if (target) target.scrollIntoView();
  else window.scrollTo({ top: y, behavior: "instant" });
}

export default function App() {
  const location = useLocation();
  const type = useNavigationType();
  const on = useMotionOn();
  const outlet = useOutlet();
  const first = useRef(true);
  const color = routeColor(location.pathname);

  useEffect(() => {
    document.documentElement.classList.toggle("motion", on);
  }, [on]);

  // Same-page links (#projects, #contact), and the very first load.
  const path = useRef(location.pathname);
  useEffect(() => {
    if (first.current || path.current === location.pathname) goTo(location.hash, type === "POP" ? (scrolls.get(location.key) ?? 0) : scrollY);
    first.current = false;
    path.current = location.pathname;
  }, [location.key]);

  return (
    <LazyMotion features={domAnimation} strict>
      <a className="skip" href="#main">Skip to content</a>
      <Nav />
      <AnimatePresence mode="wait" initial={false} custom={color}>
        <Page
          key={location.pathname}
          color={color}
          on={on}
          id={location.key}
          arrive={() => goTo(location.hash, type === "POP" ? (scrolls.get(location.key) ?? 0) : 0)}
        >
          {outlet}
        </Page>
      </AnimatePresence>
    </LazyMotion>
  );
}

const curtain = {
  covered: { clipPath: "inset(0% 0% 0% 0%)" },
  open: { clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 0.6, ease: easeOut, delay: 0.05 } },
  leave: (to: string) => ({
    backgroundColor: to,
    clipPath: ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"],
    transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1] as const, backgroundColor: { duration: 0 } },
  }),
};

/** One route. Leaving, the next page's colour rises over it; arriving, that colour lifts away. */
type PageProps = { children: React.ReactNode; id: string; color: string; on: boolean; arrive: () => void };
function Page({ children, id, color, on, arrive }: PageProps) {
  const [frozen] = useState(children); // keeps the old page on screen while it leaves
  const [key] = useState(id);
  useLayoutEffect(() => {
    if (document.documentElement.dataset.ready) {
      arrive();
      document.getElementById("main")?.focus({ preventScroll: true });
    }
    document.documentElement.dataset.ready = "1";
    const save = () => scrolls.set(key, scrollY);
    addEventListener("scroll", save, { passive: true });
    return () => removeEventListener("scroll", save);
  }, []);
  return (
    <m.div className="page">
      <main id="main" tabIndex={-1}>{frozen}</main>
      <Footer />
      {on && (
        <m.div
          className="curtain"
          aria-hidden="true"
          style={{ backgroundColor: color }}
          variants={curtain}
          initial="covered"
          animate="open"
          exit="leave"
        />
      )}
    </m.div>
  );
}
