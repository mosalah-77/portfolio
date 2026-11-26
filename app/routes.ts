import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("samepage", "routes/samepage.tsx"),
  route("oriel-and-reed", "routes/oriel-and-reed.tsx"),
  route("fixcity", "routes/fixcity.tsx"),
  route("how-i-work", "routes/how-i-work.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
