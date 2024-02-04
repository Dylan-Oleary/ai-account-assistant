import { type Thread } from "openai/resources/beta/index.mjs";
import {
  RunSubmitToolOutputsParams,
  type MessageCreateParams,
  type Run,
  type RunCreateParams,
  type ThreadMessage,
  type ThreadMessagesPage,
} from "openai/resources/beta/threads/index.mjs";

import { openAI } from "../client";

export async function addMessageToThread({
  data,
  threadId,
}: {
  data: MessageCreateParams;
  threadId: string;
}): Promise<ThreadMessage> {
  return await openAI.beta.threads.messages.create(threadId, data);
}

export async function createThread(): Promise<Thread> {
  return await openAI.beta.threads.create();
}

export async function createThreadRun({
  data,
  threadId,
}: {
  data: RunCreateParams;
  threadId: string;
}): Promise<Run> {
  return await openAI.beta.threads.runs.create(threadId, data);
}

export async function getThreadRun({
  runId,
  threadId,
}: {
  runId: string;
  threadId: string;
}): Promise<Run> {
  return await openAI.beta.threads.runs.retrieve(threadId, runId);
}

export async function getThreadMessages({
  threadId,
}: {
  threadId: string;
}): Promise<ThreadMessagesPage> {
  return await openAI.beta.threads.messages.list(threadId);
}

export async function submitOutputToThread({
  outputs = [],
  runId,
  threadId,
}: {
  outputs: RunSubmitToolOutputsParams.ToolOutput[];
  runId: string;
  threadId: string;
}): Promise<Run> {
  return await openAI.beta.threads.runs.submitToolOutputs(threadId, runId, {
    tool_outputs: outputs,
  });
}
