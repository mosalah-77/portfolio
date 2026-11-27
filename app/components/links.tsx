import { newTab, type Project } from "../content";

export function ProjectLinks({ project }: { project: Project }) {
  return (
    <p className="links">
      {project.demo && <a className="btn" href={project.demo} {...newTab}>Live demo<span className="sr"> of {project.name}</span></a>}
      <a className={project.demo ? "text-link" : "btn"} href={project.code} {...newTab}>Code<span className="sr"> for {project.name}</span></a>
    </p>
  );
}
