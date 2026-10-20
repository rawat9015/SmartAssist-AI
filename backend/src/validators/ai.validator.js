import {z} from "zod";

const aiGenerateSchema = z.object({
     action: z.enum([
    "rewrite",
    "summarize",
    "reply",
    "translate",
    "grammar",
    "explain",
    "action-items",
    "meeting-notes",
    "generate-sql",
    "generate-regex",
    "jira-ticket",
  ]),

    input: z
    .string()
    .min(1,"Input is required")
    .max(10000,"Input cannot exceed 10000 characters"),

    context : z
    .string()
    .max(20000, "Context cannot exceed 20000 characters")
    .optional(),

    options: z
    .object({
        tone:z.string().optional(),
        language:z.string().optional(),
    })
    .optional(),
});

export{
    aiGenerateSchema,
}