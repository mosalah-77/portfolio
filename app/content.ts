// Every fact, link and line of copy that could change lives here.
const go = (key: string) => `https://go.mosalah-77.workers.dev/${key}`;

export const person = {
  name: "Mohamed Elmorshedy",
  email: "m.elmorshedy635@gmail.com",
  linkedin: "https://www.linkedin.com/in/mohamed-elmorshedy",
  github: "https://github.com/mosalah-77",
  // The file lives in public/. Set to null to show the button without a file.
  cv: "/mohamed-elmorshedy-cv.pdf" as string | null,
  intro:
    "Junior web developer in Cairo. I'm looking for a fully remote role in development, technical support or software implementation.",
};

export type Project = {
  slug: string;
  name: string;
  line: string;
  stack: string;
  demo: string;
  code: string;
  /** Page colour, used by the page itself and by the transition into it. */
  color: string;
};

export const projects = {
  samepage: {
    slug: "samepage",
    name: "Samepage",
    line: "A studio collects a website brief from a client as a chat, then approves it or sends it back.",
    stack: "React and TypeScript on Cloudflare",
    demo: go("samepage"),
    code: go("samepage-code"),
    color: "#2553cc",
  },
  oriel: {
    slug: "oriel-and-reed",
    name: "Oriel & Reed",
    line: "A site for a made-up interior design studio, with a gallery you can filter by room.",
    stack: "React, TypeScript and plain CSS",
    demo: go("oriel"),
    code: go("oriel-code"),
    color: "#f4f0e7",
  },
  fixcity: {
    slug: "fixcity",
    name: "FixCity",
    line: "Report a problem with a road or a streetlight and follow it through to the repair. In Arabic and English, with made-up data.",
    stack: "Flutter, Dart and Supabase",
    demo: go("fixcity"),
    code: go("fixcity-code"),
    color: "#16293d",
  },
} satisfies Record<string, Project>;

/** The review that is replayed in the hero and on the Samepage page. */
export const reviewSteps = [
  "A design for Samepage, as the client sees it.",
  "Reviewing it, I noticed the menu listed other clients' projects.",
  "That came out before release. The server refuses the request too.",
];

export const fixcityStages = [
  { name: "Pending", text: "A resident reports the problem and staff check it." },
  { name: "Sent to district", text: "Staff hand it to the district team." },
  { name: "In progress", text: "The crew starts and adds notes as it goes." },
  { name: "Resolved", text: "A note and a photo close the report." },
];

/** Two sizes of a picture; the browser takes the one that fits. `sizes` is how wide it is shown. */
const picture = (name: string, small: number, width: number, height: number, sizes = "100vw") => ({
  src: `/img/${name}-${width}.webp`,
  srcSet: `/img/${name}-${small}.webp ${small}w, /img/${name}-${width}.webp ${width}w`,
  sizes,
  width,
  height,
});
export const pictures = {
  samepage: picture("samepage-light", 800, 1600, 1000, "(max-width: 760px) 640px, 70vw"),
  living: picture("oriel-living-room", 640, 1280, 853),
  olive: picture("oriel-olive-room", 640, 1280, 853),
  kitchen: picture("oriel-timber-kitchen", 640, 1280, 853, "(max-width: 760px) 93vw, 60vw"),
  bedroom: picture("oriel-linen-bedroom", 640, 1280, 853, "(max-width: 760px) 93vw, 60vw"),
  phone: picture("fixcity-phone", 390, 780, 1688, "(max-width: 760px) 66vw, 330px"),
};

export type QA = { q: string; a: string[] };
export const answers: QA[] = [
  {
    q: "How do you build something?",
    a: [
      "I start with who it's for and what they need to get done.",
      "Then I write down what it has to do and what it has to refuse, build it, and test it as each kind of user.",
      "If it isn't good enough it goes back, with the reason.",
    ],
  },
  {
    q: "Where does AI come in?",
    a: [
      "I work with AI coding tools like Claude Code and Codex. They're fast, and they get things wrong.",
      "What to build, how it should work and whether it's ready are my decisions. I test everything myself.",
      "Each project's README explains how it was made.",
    ],
  },
  {
    q: "Has testing it yourself ever mattered?",
    a: [
      "Yes. Reviewing a design for one of my apps, I saw the client's screen listed every other client's project.",
      "It came out before release. A client now sees one project, and the server refuses the rest.",
      "That app also started as a form. People had to guess what to do next, so I turned it into a conversation.",
    ],
  },
  {
    q: "What did you do before this?",
    a: [
      "Customer service, B2B sales and account management. At BPOHive I managed a client account and led its team.",
      "It taught me to turn what a client says into something a team can build. I also co-run a small web studio, Halvern, with a technical co-founder.",
      "I have a BSc in Business Information Systems from Badr University in Cairo. It covered programming, web development, databases and cybersecurity, among other subjects.",
      "I'm working through The Odin Project to refresh the web side and keep good developer practices in mind.",
      "Arabic is my first language and my English is fluent.",
    ],
  },
];

export const pageTitle = (t?: string) =>
  t ? `${t} | ${person.name}` : `${person.name} | Junior web developer`;

/** Background each route opens on, so the transition can arrive in the same colour. */
export const routeColor = (path: string) =>
  Object.values(projects).find((p) => path.startsWith(`/${p.slug}`))?.color ?? "#eef4fc";
