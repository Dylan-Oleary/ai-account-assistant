import { type Assistant } from "openai/resources/beta/index.mjs";

import { openAI } from "../client";

export async function getAssistantById(id: string): Promise<Assistant> {
  return await openAI.beta.assistants.retrieve(id);
}
