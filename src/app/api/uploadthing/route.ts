import { createRouteHandler } from "uploadthing/next";

import { uploadRouter } from "@/server/api/routers/uploadthing";

export const { GET, POST } = createRouteHandler({
  router: uploadRouter,
});
