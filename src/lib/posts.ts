import "server-only";
import { z } from "zod";
import { addLocalPost, readLocalPosts } from "./local-store";
import { postSchema, type CreatePostInput, type Post } from "./schemas";

const API_URL = "https://jsonplaceholder.typicode.com";

export async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${API_URL}/posts`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    throw new Error(`Не удалось загрузить посты: ${res.status}`);
  }
  const remote = z.array(postSchema).parse(await res.json());
  const local = await readLocalPosts();
  return [...local, ...remote];
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  const res = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify(input),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`API вернул ${res.status}`);
  }
  const { userId, title, body } = postSchema.parse(await res.json());
  return addLocalPost({ userId, title, body });
}
