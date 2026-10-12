import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://jugglingbear.github.io",
  base: "/books",
  output: "static",
  trailingSlash: "always",
});
