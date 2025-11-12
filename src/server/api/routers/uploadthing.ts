import { getSession } from "@/server/better-auth/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const uploadRouter = {
  profileImageUpload: f({
    "image/png": {
      maxFileSize: "2MB",
      maxFileCount: 1,
      minFileCount: 1,
    },
    "image/jpeg": {
      maxFileSize: "2MB",
      maxFileCount: 1,
      minFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await getSession();

      if (!session?.user) throw new UploadThingError("Unauthorized") as Error;

      return { userId: session.user.id };
    })
    .onUploadError(({ error }) => {
      console.error("Upload error:", error);
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.ufsUrl);

      return { fileUrl: file.ufsUrl, uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
