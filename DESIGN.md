# Design

`app/app.css` is the source of truth. This page records the choices behind it.

## The idea

The hero replays a Samepage design review, and each project then takes the whole screen in its own colours. The site itself stays in Samepage's palette and typeface so it matches the LinkedIn banner and PDF.

## Colour

| Token | Value | Used for |
| --- | --- | --- |
| `--bg` | `#eef4fc` | Page, chat background |
| `--ink` | `#0f1b40` | Text, contact section |
| `--blue` | `#2553cc` | Actions, answers, Samepage |
| `--mark` | `#cf420e` | Review marks only |
| `--cream`, `--olive` | `#f4f0e7`, `#4b4f38` | Oriel & Reed |
| `--navy`, `--gold` | `#16293d`, `#d6b25e` | FixCity |
| `--night`, `--cyan`, `--pink` | `#0b0e17`, `#4fe3f2`, `#ff5c93` | SSH Honeypot, taken from its dashboard |

## Type

The site is set in Figtree, self-hosted, 400 to 600. Each project's chapter and page title use the typefaces of the project itself: Figtree for Samepage, Bodoni Moda and Hanken Grotesk for Oriel & Reed, Work Sans for FixCity, and JetBrains Mono for the honeypot, whose dashboard is monospace. The home page fetches the project typefaces only after it has loaded, and each project page asks for its own early.

## Motion

| Where | What happens |
| --- | --- |
| Hero, on load | The name rises letter by letter (CSS, so it does not wait for JavaScript) |
| Hero, on scroll | The two names part, the small screen grows out of the headline, and the review plays. It runs backwards too |
| Projects | Each pins; the next slides over while the covered one falls back. Samepage tilts up, the Oriel photo opens from a small window, the FixCity phone rises and its four stages fill in, and the honeypot types out one visit beside the log it leaves |
| Top bar | Takes the colours, typeface and corners of the project behind it, and goes back to the site's own look elsewhere. The colour eases across while the words dip out to change typeface. The bar is lightly frosted on the site's own look and on FixCity, and solid on Oriel & Reed and the honeypot |
| Chapter words | Each chapter's words arrive in the project's own manner. Samepage is quick and exact. Oriel & Reed fades slowly while its name settles into its spacing. FixCity pops in with a small overshoot, like a phone app. The honeypot uses no easing: its name is typed, the lines switch on and the panels flicker up |
| Chat | Each question is its own chat. Picking one opens it, and the answers arrive one at a time after typing dots |
| Project pages | Title letters, arriving as the chapter does (risen, faded, dropped or typed), the picture growing into place, section reveals. Oriel & Reed walks sideways through its rooms |
| Project pages, below the title | The rest of the page keeps the project's colours, typeface and corners, and the top bar stays dressed for it |
| Between pages | The next page's colour rises over this one, then lifts |
| Contact | The name slides up from below the edge |

The page scrolls normally and no readable text is hidden in the HTML, apart from the last step of the redrawn review. The plain layout is used for reduced motion, for screens under 480px tall, and without JavaScript.

Scroll ranges go through `useRange` in `app/motion.tsx`. Passing a range straight to Motion's `useTransform` lets it use browser scroll timelines, which misplaced the pinned chapters.

## References

[Halvern](https://halvern.studio), for its pinned title and stacked cards, and [The Renaissance Edition on Awwwards](https://www.awwwards.com/inspiration/hero-the-renaissance-edition), for keeping the frame still while chapters change under it. I took ideas from both, and no code or pictures.
