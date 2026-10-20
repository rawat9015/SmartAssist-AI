import dotenv from "dotenv"; //used to access env file

import z from "zod"; // zod is used for validation 

dotenv.config();

const envSchema = z.object({
    NODE_ENV : z
    .enum(['development', 'production','test'])
    .default("development"),

    PORT : z.coerce.number().default(5000),

    MONGO_URI : z.string().min(1, "MONGO_URI is required"),

    JWT_ACCESS_SECRET : z
    .string()
    .min(8, "JWT_ACCESS_SECRET must be at least 8 characters"),

    JWT_REFRESH_SECRET: z
    .string()
    .min(8, "JWT_REFRESH_SECRET must be at least 8 characters"),

    GEMINI_API_KEY:z.string().min(1, "GEMINI_API_KEY is required")
});

const env = envSchema.parse(process.env);



export default env;