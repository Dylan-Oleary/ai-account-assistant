declare module "bun" {
  interface Env {
    OPENAI_ACCOUNT_ASSISTANT_ID: string;
    OPENAI_API_KEY: string;
    PORT?: string;
  }
}

declare module "*.m4a" {}
