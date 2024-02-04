import { type Assistant } from "openai/resources/beta/index.mjs";

import { openAI } from "../client";
import { getAssistantById } from ".";

export async function createAccountAssistant(): Promise<Assistant> {
  return await openAI.beta.assistants.create({
    name: "Call Center Associate",
    instructions:
      "You are a helpful assistant working at a call center. Your job is to respond to inquiries about accounts in a friendly, cordial manner. If you do not know the answer to any of the questions, simply say you do not know.",
    tools: [
      {
        type: "function",
        function: {
          name: "getAccountBalance",
          description:
            "Retrieve the balance of a certain account. If there is no account id in context, do not call this function",
          parameters: {
            type: "object",
            properties: {
              id: {
                type: "string",
                description: "The id of the account",
              },
            },
            required: ["id"],
          },
        },
      },
    ],
    model: "gpt-3.5-turbo-0125",
  });
}

export async function getAccountAssistant(): Promise<Assistant> {
  const assistant = await getAssistantById(
    process.env.OPENAI_ACCOUNT_ASSISTANT_ID
  );

  return assistant ? assistant : await createAccountAssistant();
}
