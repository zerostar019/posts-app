import { describe, expect, it } from "vitest";
import { z } from "zod";
import { createPostSchema } from "../schemas";

const valid = { title: "Hello world", body: "Some long enough text", userId: "3" };

describe("createPostSchema", () => {
  it("принимает валидные данные и приводит userId к числу", () => {
    const result = createPostSchema.parse(valid);
    expect(result).toEqual({ title: "Hello world", body: "Some long enough text", userId: 3 });
  });

  it("обрезает пробелы перед проверкой длины", () => {
    const result = createPostSchema.safeParse({ ...valid, title: "   ab   " });
    expect(result.success).toBe(false);
  });

  it("возвращает ошибки по каждому невалидному полю", () => {
    const result = createPostSchema.safeParse({ title: "", body: "short", userId: "" });
    expect(result.success).toBe(false);
    const { fieldErrors } = z.flattenError(result.error!);
    expect(Object.keys(fieldErrors).sort()).toEqual(["body", "title", "userId"]);
  });

  it("отклоняет несуществующего автора", () => {
    expect(createPostSchema.safeParse({ ...valid, userId: "11" }).success).toBe(false);
    expect(createPostSchema.safeParse({ ...valid, userId: "abc" }).success).toBe(false);
  });

  it("ограничивает максимальную длину", () => {
    expect(createPostSchema.safeParse({ ...valid, title: "x".repeat(121) }).success).toBe(false);
  });
});
