import { useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef, useState } from "react";
import { pictures } from "../content";
import { useMotionOn } from "../motion";

const rooms = [
  { ...pictures.olive, sizes: pictures.kitchen.sizes, name: "Olive sitting room", alt: "A green sofa beside a wooden coffee table." },
  { ...pictures.kitchen, name: "Timber kitchen", alt: "A kitchen with wooden cabinets and a large window." },
  { ...pictures.bedroom, name: "Linen bedroom", alt: "A bed with grey and white linen." },
];

/** Scrolling down walks sideways past the rooms. Without motion, and on phones, it is a row you can swipe. */
export function Rooms() {
  const on = useMotionOn();
  const ref = useRef<HTMLElement>(null);
  const row = useRef<HTMLUListElement>(null);
  const [travel, setTravel] = useState(0);
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const measure = () => {
      setTravel(row.current ? Math.max(0, row.current.scrollWidth - innerWidth) : 0);
      setDesktop(matchMedia("(min-width: 761px) and (min-height: 520px)").matches);
    };
    measure();
    addEventListener("resize", measure);
    return () => removeEventListener("resize", measure);
  }, []);
  const { scrollYProgress: t } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(t, (v) => -v * travel);
  const wide = travel > 0 && on && desktop;
  return (
    <section className="rooms" ref={ref}>
      <div className="rooms-pin" tabIndex={0} role="region" aria-label="Room concepts, scrolls sideways">
        <m.ul ref={row} style={wide ? { x } : undefined}>
          {rooms.map(({ name, ...img }) => (
            <li key={name}>
              <img {...img} loading="lazy" />
              <span>{name}</span>
            </li>
          ))}
        </m.ul>
      </div>
    </section>
  );
}
