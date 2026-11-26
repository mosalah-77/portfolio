import { useInView, useMotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useMotionOn } from "../motion";
import { ReviewScene } from "./review-scene";

const length = 6000;

/** The same review, played once on its own clock when it comes into view. */
export function ReviewReplay() {
  const on = useMotionOn();
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { amount: 0.5 });
  const t = useMotionValue(0.45);
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (!on) return;
    t.set(0);
    if (!seen) return;
    const start = performance.now();
    let id = requestAnimationFrame(function tick(now) {
      const v = Math.min(1, (now - start) / length);
      t.set(v);
      if (v < 1) id = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(id);
  }, [on, seen, run]);
  return (
    <div className="replay" ref={ref}>
      <ReviewScene t={t} />
      <p className="fine">
        Redrawn for this page. The companies are made up.
        {on && <button type="button" className="text-link" onClick={() => setRun(run + 1)}>Play again</button>}
      </p>
    </div>
  );
}
