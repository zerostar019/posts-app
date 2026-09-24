"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="text-xl font-semibold">Не удалось загрузить посты</h1>
      <p className="mt-2 text-sm text-zinc-500">
        Внешний API недоступен или вернул некорректные данные.
      </p>
      <button
        onClick={() => retry()}
        className="mt-6 rounded-md border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
      >
        Попробовать снова
      </button>
    </main>
  );
}
