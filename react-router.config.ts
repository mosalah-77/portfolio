import type { Config } from "@react-router/dev/config";

// Every page is written out as plain HTML at build time, so the site reads without JavaScript
// and deploys as static files.
export default {
  ssr: false,
  prerender: ["/", "/samepage", "/oriel-and-reed", "/fixcity", "/ssh-honeypot", "/how-i-work", "/404"],
} satisfies Config;
