import { getAccountBalance } from "../../actions";

export enum OpenAIFunctionName {
  getAccountBalance = "getAccountBalance",
}

export function isValidOpenAIFunctionName(
  name: string
): name is OpenAIFunctionName {
  return Object.values(OpenAIFunctionName).includes(name as OpenAIFunctionName);
}
export const openAIFunctionMap: Record<OpenAIFunctionName, Function> = {
  getAccountBalance,
};
