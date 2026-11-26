import { Facts, ProjectPage, Story } from "../components/project-page";
import { Rooms } from "../components/rooms";
import { pageTitle, pictures, projects, fontLinks } from "../content";

const { oriel, fixcity } = projects;
export const links = fontLinks("bodoni-moda-500", "hanken-grotesk-400");
export const meta = () => [{ title: pageTitle(oriel.name) }, { name: "description", content: oriel.line }];

export default function Oriel() {
  return (
    <ProjectPage
      project={oriel}
      next={fixcity}
      image={{ ...pictures.living, alt: "A cream living room with a sofa, round mirrors and pampas grass." }}
    >
      <Story title="A studio that doesn't exist">
        <p>Oriel & Reed is a made-up interior design studio. The site has room concepts, a gallery you can filter by room, an image viewer that works from the keyboard and a consultation form that is clearly a demo: nothing is sent or saved.</p>
      </Story>
      <Rooms />
      <Facts
        title="Worth a look"
        items={[
          { name: "The image viewer", text: "It opens as a native dialog, keeps keyboard focus inside and returns it to the picture you opened." },
          { name: "The form", text: "It checks each field, shows when it is sending, and has a state for failure as well as success." },
          { name: "Motion", text: "The hero moves with the scroll in plain CSS. Phones and reduced-motion visitors get it still." },
        ]}
      />
      <Story title="My decisions">
        <p>I chose the project, set the goals and the visual design, then made CSS and TypeScript changes by hand and checked each one in the browser.</p>
        <p className="fine">Photographs by Spacejoy and Ali Moradi on Unsplash, used as reference images.</p>
      </Story>
    </ProjectPage>
  );
}
