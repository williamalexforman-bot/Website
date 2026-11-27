// California State Roleplay on Netlify: handles /api/* and /auth/*; Netlify serves public/ for everything else.
import { getStore } from "@netlify/blobs";
import { handle } from "../../server/core.js";
import { blobStore } from "../../server/blobstore.js";

let st;
export default async req => {
  st ||= blobStore(getStore({ name: "csrp", consistency: "strong" }));
  return (await handle(req, process.env, st)) || new Response("Not found", { status: 404 });
};

export const config = { path: ["/api/*", "/auth/*"] };
