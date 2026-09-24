import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { addLocalPost, readLocalPosts } from "../local-store";

const draft = { userId: 1, title: "Заголовок", body: "Текст поста" };
let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "posts-"));
  process.env.DATA_DIR = dir;
});

afterEach(async () => {
  delete process.env.DATA_DIR;
  await rm(dir, { recursive: true, force: true });
});

describe("local-store", () => {
  it("возвращает пустой список, если файла ещё нет", async () => {
    expect(await readLocalPosts()).toEqual([]);
  });

  it("сохраняет пост в файл, новые — сверху", async () => {
    await addLocalPost(draft);
    await addLocalPost({ ...draft, title: "Второй" });
    const posts = await readLocalPosts();
    expect(posts.map((p) => [p.id, p.title])).toEqual([
      [1002, "Второй"],
      [1001, "Заголовок"],
    ]);
  });

  it("не теряет посты при одновременных запросах", async () => {
    await Promise.all(Array.from({ length: 10 }, () => addLocalPost(draft)));
    const ids = (await readLocalPosts()).map((p) => p.id);
    expect(new Set(ids).size).toBe(10);
  });
});
