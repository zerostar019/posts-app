import { Suspense } from "react";
import { CreatePostForm } from "@/components/create-post-form";
import { PostList, PostListSkeleton } from "@/components/post-list";

export default async function Home({ searchParams }: PageProps<"/">) {
  const { page } = await searchParams;
  const pageNumber = Number(Array.isArray(page) ? page[0] : page) || 1;

  return (
    <main className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-10 md:grid-cols-[1fr_320px]">
      <header className="md:col-span-2">
        <h1 className="text-2xl font-bold tracking-tight">Посты</h1>
      </header>

      <div className="md:order-2">
        <div className="md:sticky md:top-6">
          <CreatePostForm />
        </div>
      </div>

      <div className="min-w-0 md:order-1">
        <Suspense key={pageNumber} fallback={<PostListSkeleton />}>
          <PostList page={pageNumber} />
        </Suspense>
      </div>
    </main>
  );
}
