"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createPost } from "@/lib/posts";
import { createPostSchema } from "@/lib/schemas";
import type { CreatePostState } from "@/lib/form-state";

export async function createPostAction(
  _prevState: CreatePostState,
  formData: FormData,
): Promise<CreatePostState> {
  const values = {
    title: String(formData.get("title") ?? ""),
    body: String(formData.get("body") ?? ""),
    userId: String(formData.get("userId") ?? ""),
  };

  const parsed = createPostSchema.safeParse(values);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Проверьте поля формы",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      values,
    };
  }

  try {
    const post = await createPost(parsed.data);
    revalidatePath("/");
    return { status: "success", message: `Пост «${post.title}» опубликован` };
  } catch (error) {
    console.error("createPostAction failed", error);
    return {
      status: "error",
      message: "Не удалось создать пост, попробуйте ещё раз",
      values,
    };
  }
}
