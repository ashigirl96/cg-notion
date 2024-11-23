import * as v from "valibot";

export const envSchema = v.object({
  NOTION_TOKEN: v.string(),
  DAILY_DATABASE_ID: v.string(),
  ARCHITECT_DATABASE_ID: v.string(),
  WORD_DATABASE_ID: v.string(),
});

export type Env = v.InferOutput<typeof envSchema>;
export const env = v.parse(envSchema, process.env);
