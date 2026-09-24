import Link from "next/link";
import { getPosts } from "@/lib/posts";

const PAGE_SIZE = 10;

export async function PostList({ page }: { page: number }) {
  const posts = await getPosts();
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const current = Math.min(Math.max(1, page), totalPages);
  const visible = posts.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <section aria-labelledby="posts-heading" className="space-y-4">
      <h2 id="posts-heading" className="sr-only">
        Посты
      </h2>

      <ul className="space-y-3">
        {visible.map((post) => (
          <li
            key={post.id}
            className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            {post.id > 100 && (
              <span className="mb-1 inline-block rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                новый
              </span>
            )}
            <h3 className="font-medium wrap-anywhere first-letter:uppercase">{post.title}</h3>
            <p className="mt-1 whitespace-pre-line wrap-anywhere text-sm text-zinc-600 dark:text-zinc-400">
              {post.body}
            </p>
          </li>
        ))}
      </ul>

      <nav
        aria-label="Страницы"
        className="flex items-center justify-between text-sm"
      >
        <PageLink page={current - 1} disabled={current <= 1}>
          ← Назад
        </PageLink>
        <span className="text-zinc-500">
          {current} / {totalPages}
        </span>
        <PageLink page={current + 1} disabled={current >= totalPages}>
          Вперёд →
        </PageLink>
      </nav>
    </section>
  );
}

function PageLink({
  page,
  disabled,
  children,
}: {
  page: number;
  disabled: boolean;
  children: React.ReactNode;
}) {
  const base = "rounded-md border px-3 py-1.5";
  if (disabled) {
    return (
      <span
        className={`${base} cursor-not-allowed border-zinc-200 text-zinc-400 dark:border-zinc-800`}
      >
        {children}
      </span>
    );
  }
  return (
    <Link
      href={page === 1 ? "/" : `/?page=${page}`}
      className={`${base} border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800`}
    >
      {children}
    </Link>
  );
}

export function PostListSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Загрузка постов">
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className="h-24 animate-pulse rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
        />
      ))}
    </div>
  );
}
