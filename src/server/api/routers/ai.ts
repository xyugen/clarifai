import { loadFileChunks } from "@/lib/ai/groq";
import { zfd } from "zod-form-data";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const aiRouter = createTRPCRouter({
  parsePDF: protectedProcedure
    .input(
      zfd.formData({
        file: zfd.file(),
      }),
    )
    .mutation(async ({ input }) => {
      const { file } = input;

      if (!file) {
        throw new Error("No file provided");
      }

      const text = await loadFileChunks(file);

      return { text };
    }),
});

export default aiRouter;
