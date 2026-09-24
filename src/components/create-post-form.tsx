"use client";

import { useActionState } from "react";
import { createPostAction } from "@/app/actions";
import { initialCreatePostState, type FieldName } from "@/lib/form-state";

const inputClass =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 aria-[invalid=true]:border-red-500 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-800";

export function CreatePostForm() {
  const [state, formAction, pending] = useActionState(
    createPostAction,
    initialCreatePostState,
  );

  const errorOf = (field: FieldName) => state.fieldErrors?.[field]?.[0];

  return (
    <form
      action={formAction}
      noValidate
      className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <h2 className="text-lg font-semibold">Новый пост</h2>

      <Field label="Заголовок" htmlFor="title" error={errorOf("title")}>
        <input
          id="title"
          name="title"
          defaultValue={state.values?.title}
          aria-invalid={!!errorOf("title")}
          aria-describedby="title-error"
          className={inputClass}
        />
      </Field>

      <Field label="Текст" htmlFor="body" error={errorOf("body")}>
        <textarea
          id="body"
          name="body"
          rows={5}
          defaultValue={state.values?.body}
          aria-invalid={!!errorOf("body")}
          aria-describedby="body-error"
          className={inputClass}
        />
      </Field>

      <Field label="Автор" htmlFor="userId" error={errorOf("userId")}>
        <select
          id="userId"
          name="userId"
          defaultValue={state.values?.userId ?? ""}
          aria-invalid={!!errorOf("userId")}
          aria-describedby="userId-error"
          className={inputClass}
        >
          <option value="" disabled>
            Выберите…
          </option>
          {Array.from({ length: 10 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              Пользователь {i + 1}
            </option>
          ))}
        </select>
      </Field>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {pending ? "Отправка…" : "Опубликовать"}
      </button>

      <p
        aria-live="polite"
        className={
          state.status === "success"
            ? "text-sm text-emerald-700 dark:text-emerald-400"
            : "text-sm text-red-600 dark:text-red-400"
        }
      >
        {state.message}
      </p>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className="block text-sm font-medium">
        {label}
      </label>
      {children}
      <p
        id={`${htmlFor}-error`}
        className="min-h-5 text-xs text-red-600 dark:text-red-400"
      >
        {error}
      </p>
    </div>
  );
}
