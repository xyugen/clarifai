export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
}

export const models: Array<Model> = [
  {
    id: "llama-3.3-70b-versatile",
    label: "Llama 3.1",
    apiIdentifier: "llama-3.3-70b-versatile",
    description: "Designed to handle a wide range of tasks effectively.",
  },
  {
    id: "gpt-oss-120b",
    label: "GPT OSS 120B",
    apiIdentifier: "gpt-oss-120b",
    description: " Designed for high-capability agentic use.",
  },
] as const;

export const DEFAULT_MODEL_NAME = "llama-3.3-70b-versatile";
