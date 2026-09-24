import { z } from "zod";

export const postSchema = z.object({
  id: z.number().int(),
  userId: z.number().int(),
  title: z.string(),
  body: z.string(),
});

export type Post = z.infer<typeof postSchema>;

export const createPostSchema = z.object({
  title: z
    .string({ error: "Заголовок обязателен" })
    .trim()
    .min(3, { error: "Заголовок — минимум 3 символа" })
    .max(120, { error: "Заголовок — максимум 120 символов" }),
  body: z
    .string({ error: "Текст обязателен" })
    .trim()
    .min(10, { error: "Текст — минимум 10 символов" })
    .max(2000, { error: "Текст — максимум 2000 символов" }),
  userId: z.coerce
    .number({ error: "Выберите автора" })
    .int({ error: "Выберите автора" })
    .min(1, { error: "Выберите автора" })
    .max(10, { error: "Выберите автора" }),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
