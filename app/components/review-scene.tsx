import { type MotionValue } from "motion/react";
import * as m from "motion/react-m";
import { useRange } from "../motion";

/**
 * The Samepage design review, redrawn. `t` runs 0 to 1:
 * 0.1-0.35 the circle and note arrive, 0.6-0.75 the other project and its menu go, 0.8 the fix is noted.
 */
export function ReviewScene({ t }: { t: MotionValue<number> }) {
  const circle = useRange(t, [0.14, 0.32], [0, 1]);
  const circleOpacity = useRange(t, [0.13, 0.14, 0.58, 0.64], [0, 1, 1, 0]);
  const note = useRange(t, [0.28, 0.36, 0.58, 0.64], [0, 1, 1, 0]);
  const noteX = useRange(t, [0.28, 0.38], [-24, 0]);
  const rowHeight = useRange(t, [0.6, 0.7], ["3.6em", "0em"]);
  const rowOpacity = useRange(t, [0.58, 0.66], [1, 0]);
  const menu = useRange(t, [0.7, 0.78], [1, 0]);
  const menuY = useRange(t, [0.7, 0.78], [0, -14]);
  const lift = useRange(t, [0.72, 0.84], ["0em", "-4.9em"]);
  const fixed = useRange(t, [0.82, 0.9], [0, 1]);
  const fixedScale = useRange(t, [0.82, 0.9], [0.86, 1]);
  return (
    <div className="scene" role="img" aria-label="A Samepage screen for Jackie's Auto Shop. Its project menu also lists Marsh Lane Vets, another client. A review note circles it, and the menu is removed.">
      <div className="scene-bar">
        <span className="chip">JA</span>Jackie's Auto Shop
        <m.span className="chev" style={{ opacity: menu }} />
      </div>
      <m.div className="scene-menu" style={{ opacity: menu, y: menuY }}>
        <div className="scene-row is-on"><span className="chip">JA</span>Jackie's Auto Shop</div>
        <m.div className="scene-row" style={{ height: rowHeight, opacity: rowOpacity }}>
          <span className="chip is-other">ML</span>Marsh Lane Vets
        </m.div>
      </m.div>
      <m.svg className="scene-circle" viewBox="0 0 300 84" style={{ opacity: circleOpacity }}>
        <m.path d="M44 18C116 0 270 4 290 36c14 32-74 44-154 42C62 76 8 66 10 40 14 18 80 6 156 8" style={{ pathLength: circle }} />
      </m.svg>
      <m.p className="scene-note" style={{ opacity: note, x: noteX }}>This is another client's project.</m.p>
      <m.p className="scene-note is-fixed" style={{ opacity: fixed, scale: fixedScale }}>Menu removed. The server refuses it too.</m.p>
      <m.div className="scene-thread" style={{ y: lift }}>
        <p className="bubble">What should the website do for the business?</p>
        <p className="bubble is-me">More bookings for servicing, and fewer calls asking for prices.</p>
        <p className="bubble">Who are you trying to reach?</p>
        <p className="bubble is-me">Drivers within a few miles of the shop.</p>
        <p className="bubble">Which pages do you want?</p>
      </m.div>
    </div>
  );
}
