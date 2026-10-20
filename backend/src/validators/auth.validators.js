import {email, z} from "zod";

const registerSchema = z.object({
    name : z
    .string()
    .trim()
    .min(2,"Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),

    email : z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .toLowerCase(),

    password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password cannot exceed 72 characters"),
});

const loginSchema = z.object({
    email : z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .toLowerCase(),

    password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password cannot exceed 72 characters"),
});

const refreshSchema = z.object({
    refreshToken:z.
    string()
    .min(1,"Refresh is required"),
})

export{
    registerSchema,
    loginSchema,
    refreshSchema
}

// {
//   "name": "Test12345",
//   "email": "test12345@gmail.com",
//   "password": "mypassword123"
// }