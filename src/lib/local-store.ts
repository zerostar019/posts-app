import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { postSchema, type Post } from "./schemas";

const FIRST_LOCAL_ID = 1001;

function storeFile(): string {
  const dir = process.env.DATA_DIR ?? path.join(process.cwd(), "data");
  return path.join(dir, "posts.json");
}

export async function readLocalPosts(): Promise<Post[]> {
  try {
    const raw = await readFile(storeFile(), "utf8");
    return z.array(postSchema).parse(JSON.parse(raw));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

let queue: Promise<unknown> = Promise.resolve();

export function addLocalPost(data: Omit<Post, "id">): Promise<Post> {
  const task = queue.then(async () => {
    const posts = await readLocalPosts();
    const id = Math.max(FIRST_LOCAL_ID - 1, ...posts.map((p) => p.id)) + 1;
    const post: Post = { ...data, id };
    await save([post, ...posts]);
    return post;
  });
  queue = task.catch(() => {});
  return task;
}

async function save(posts: Post[]): Promise<void> {
  const file = storeFile();
  await mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  await writeFile(tmp, JSON.stringify(posts, null, 2), "utf8");
  await rename(tmp, file);
}
