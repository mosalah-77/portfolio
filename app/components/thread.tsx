import { inView } from "motion";
import { animate } from "motion/mini";
import { useEffect, useId, useRef, useState } from "react";
import type { QA } from "../content";
import { easeOut, useMotionOn } from "../motion";

/** Each question is its own chat. Picking one opens it, and the answers arrive after typing dots. */
export function Thread({ items }: { items: QA[] }) {
  const id = useId();
  const [open, setOpen] = useState(0);
  const [picked, setPicked] = useState(false);
  const pick = (n: number) => (setOpen(n), setPicked(true));
  const keys = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = ({ ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 } as Record<string, number>)[e.key];
    if (!step) return;
    e.preventDefault();
    const next = (open + step + items.length) % items.length;
    pick(next);
    (e.currentTarget.children[next] as HTMLElement).focus();
  };
  return (
    <div className="thread">
      <div className="chat-tabs" role="tablist" aria-label="Questions" onKeyDown={keys}>
        {items.map((item, n) => (
          <button key={item.q} type="button" role="tab" id={`${id}t${n}`} aria-controls={`${id}p${n}`} aria-selected={n === open} tabIndex={n === open ? 0 : -1} onClick={() => pick(n)}>
            {item.q}
          </button>
        ))}
      </div>
      {items.map((item, n) => (
        <Exchange key={item.q} {...item} id={`${id}p${n}`} tab={`${id}t${n}`} open={n === open} picked={picked} />
      ))}
    </div>
  );
}

function Exchange({ q, a, id, tab, open, picked }: QA & { id: string; tab: string; open: boolean; picked: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useMotionOn();
  useEffect(() => {
    const el = ref.current;
    // The chat that is on screen when the page loads is left alone; it plays when scrolled to or picked.
    if (!el || !on || !open || (!picked && el.getBoundingClientRect().top < innerHeight * 0.9)) return;
    const bubbles = [...el.querySelectorAll<HTMLElement>(".bubble")];
    const dots = el.querySelector<HTMLElement>(".typing")!;
    let live = true;
    const show = () => bubbles.forEach((b) => b.removeAttribute("style"));
    bubbles.forEach((b) => (b.style.opacity = "0"));
    const pop = (b: HTMLElement, x: number) =>
      animate(
        b,
        { opacity: [0, 1], transform: [`translate(${x}px, 22px) scale(0.86)`, "translate(0px, 0px) scale(1)"] },
        { duration: 0.4, ease: easeOut },
      );
    const stop = inView(
      el,
      () => {
        void (async () => {
          await pop(bubbles[0], -14);
          for (const b of bubbles.slice(1)) {
            if (!live) return;
            b.before(dots);
            dots.hidden = false;
            await new Promise((r) => setTimeout(r, 300));
            dots.hidden = true;
            if (!live) return;
            await pop(b, 14);
          }
        })();
      },
      { margin: "0px 0px -22% 0px" },
    );
    return () => {
      live = false;
      stop();
      show();
      dots.hidden = true;
    };
  }, [on, open, picked]);
  return (
    <div className={`exchange${open ? " is-open" : ""}`} ref={ref} role="tabpanel" id={id} aria-labelledby={tab}>
      <h2 className="bubble">{q}</h2>
      {a.map((line) => <p key={line} className="bubble is-me">{line}</p>)}
      <p className="typing" hidden aria-hidden="true"><i /><i /><i /></p>
    </div>
  );
}
