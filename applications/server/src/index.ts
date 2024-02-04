import { Hono } from "hono";
import { type RunSubmitToolOutputsParams } from "openai/resources/beta/threads/index.mjs";
import { type Uploadable } from "openai/uploads.mjs";

import {
  addMessageToThread,
  createThread,
  createThreadRun,
  createTranscriptFromAudio,
  getAccountAssistant,
  getThreadMessages,
  getThreadRun,
  isValidOpenAIFunctionName,
  openAIFunctionMap,
  submitOutputToThread,
} from "./open-ai";

const app = new Hono();

app.get("/", async (ctx) => {
  try {
    // Step 1 – Convert Audio
    // Upload your own audio files in the /audio folder
    const file = Bun.file(
      `${process.cwd()}/audio/ai-test-female.m4a`
    ) as Uploadable;
    const { text } = await createTranscriptFromAudio({ file });

    // Step 2 – Fetch Account Assistat
    const assistant = await getAccountAssistant();

    // Step 3 – Create Message Thread
    const { id: threadId } = await createThread();

    // Step 4 – Add Message
    await addMessageToThread({
      data: { role: "user", content: text },
      threadId,
    });

    // Step 5 – Create Thread Run
    const { id: runId } = await createThreadRun({
      data: { assistant_id: assistant.id },
      threadId,
    });

    let isRunComplete = false;
    let maxRetryCount = 3;
    let retries = 0;

    while (!isRunComplete && retries <= maxRetryCount) {
      const run = await getThreadRun({ runId, threadId });

      if (run.status === "completed") {
        isRunComplete = true;
      } else if (run.status === "requires_action") {
        const { required_action } = run;
        const { submit_tool_outputs } = required_action ?? {};
        const { tool_calls = [] } = submit_tool_outputs ?? {};

        if (tool_calls.length > 0) {
          const outputs: RunSubmitToolOutputsParams.ToolOutput[] = [];

          for (const call of tool_calls) {
            const { function: aiFunc, id: tool_call_id } = call;
            if (!isValidOpenAIFunctionName(aiFunc.name)) continue;

            const executor = openAIFunctionMap[aiFunc.name];
            const output = await executor(JSON.parse(aiFunc.arguments));

            outputs.push({ tool_call_id, output });
          }

          await submitOutputToThread({ outputs, threadId, runId });
        }
      } else {
        retries++;
        await Bun.sleep(1000);
      }
    }

    if (!isRunComplete) return ctx.text("An error has occurred", 500);

    const messages = await getThreadMessages({ threadId });
    return ctx.json({ message: messages.data }, 200);
  } catch (error: any) {
    console.error(error);
    return ctx.json({ message: error.message }, 500);
  }
});

export default app;
