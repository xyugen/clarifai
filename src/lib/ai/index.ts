import { groq } from "@ai-sdk/groq";
import { wrapLanguageModel } from "ai";
import { customMiddleware } from "./custom-middleware";
import { DEFAULT_MODEL_NAME, type Model } from "./models";

export const customModel = (apiIdentifier?: Model["apiIdentifier"]) => {
  return wrapLanguageModel({
    model: groq(apiIdentifier ?? DEFAULT_MODEL_NAME),
    middleware: customMiddleware,
  });
};
