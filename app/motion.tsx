import { inView, stagger, transform } from "motion";
import { animate } from "motion/mini";
import { useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useSyncExternalStore } from "react";

// Screens too short for the pinned scenes (a phone on its side) get the plain layout as well.
const query = "(prefers-reduced-motion: reduce), (max-height: 479px)";
const subscribe = (cb: () => void) => {
  const mq = matchMedia(query);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/** False while prerendering, without JavaScript, on very short screens and for anyone who asked for less motion. */
export const useMotionOn = () =>
  useSyncExternalStore(subscribe, () => !matchMedia(query).matches, () => false);

export const easeOut = [0.22, 1, 0.36, 1] as const;

/**
 * useTransform over a range, always computed in JavaScript. Handing the range to useTransform directly lets Motion
 * move it onto a browser scroll timeline, which misplaces the zero-height marks the pinned chapters measure from.
 */
export function useRange<T>(value: MotionValue<number>, input: number[], output: T[], ease?: (t: number) => number) {
  const map = transform(input, output, ease ? { ease } : undefined);
  return useTransform(value, (v) => map(v));
}

/**
 * Brings the element's [data-rise] children in the first time it is scrolled to.
 * Nothing is hidden in the HTML: children are hidden here, and only when they are still below the fold.
 */
export function useRise<T extends HTMLElement>(from: { y?: number; scale?: number } = {}) {
  const ref = useRef<T>(null);
  const on = useMotionOn();
  const { y = 48, scale = 1 } = from;
  useEffect(() => {
    const el = ref.current;
    if (!el || !on || el.getBoundingClientRect().top < innerHeight * 0.9) return;
    const items = [...el.querySelectorAll<HTMLElement>("[data-rise]")];
    const reset = () => items.forEach((i) => i.removeAttribute("style"));
    items.forEach((i) => Object.assign(i.style, { opacity: "0", transform: `translateY(${y}px) scale(${scale})` }));
    const stop = inView(
      el,
      () => {
        animate(
          items,
          { opacity: [0, 1], transform: [`translateY(${y}px) scale(${scale})`, "translateY(0px) scale(1)"] },
          { duration: 0.8, ease: easeOut, delay: stagger(0.09) },
        ).then(reset);
      },
      { margin: "0px 0px -18% 0px" },
    );
    return () => {
      stop();
      reset();
    };
  }, [on, y, scale]);
  return ref;
}

/** Splits a title into letters for the CSS entrance. Words stay whole. Put the plain text on the heading as its aria-label. */
export function Letters({ text }: { text: string }) {
  let n = 0;
  return (
    <>
      <span aria-hidden="true">
        {text.split(" ").map((word, w) => (
          <span key={w}>
            {w > 0 && " "}
            <span className="word">
              {[...word].map((c, i) => (
                <span key={i} className="mask">
                  <span className="letter" style={{ "--i": n++ } as React.CSSProperties}>{c}</span>
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </>
  );
}
