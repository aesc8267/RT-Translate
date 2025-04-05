import {
  type RouteConfig,
  index,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route(
    "/hello",
    "routes/hello.tsx",
    [index("routes/say.tsx"), route("/hello/do", "routes/do.tsx")],
  ),
  route("/test", "routes/test.tsx")
] satisfies RouteConfig;
