import { type Transcription } from "openai/resources/audio/transcriptions.mjs";
import { type Uploadable } from "openai/uploads.mjs";

import { openAI } from "../client";

export async function createTranscriptFromAudio({
  file,
}: {
  file: Uploadable;
}): Promise<Transcription> {
  return await openAI.audio.transcriptions.create({ file, model: "whisper-1" });
}
