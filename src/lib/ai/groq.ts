import { env } from "@/env";
import { createGroq } from "@ai-sdk/groq";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const groq = createGroq({
  apiKey: env.GROQ_API_KEY,
});

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

export const loadFileChunks = async (file: File): Promise<string[]> => {
  try {
    const loader = new PDFLoader(file);
    const docs = await loader.load();
    const chunks = await splitter.splitDocuments(docs);
    return chunks.map((chunk) => chunk.pageContent);
  } catch (err) {
    console.error("Error loading file:", err);
    return [];
  }
};
