import type { Project } from "../content";

export function ProjectLinks({ project }: { project: Project }) {
  return (
    <p className="links">
      <a className="btn" href={project.demo}>Live demo<span className="sr"> of {project.name}</span></a>
      <a className="text-link" href={project.code}>Code<span className="sr"> for {project.name}</span></a>
    </p>
  );
}
