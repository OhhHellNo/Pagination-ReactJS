import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useGetPostsQuery } from "./Redux/Features/postsApi";

const PER_PAGE = 10;

const App = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useGetPostsQuery({
    page,
    perPage: PER_PAGE,
  });

  if (isLoading) return <p className="p-6">Loading...</p>;

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Posts (Page {page})</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.posts.map((post) => (
          <div
            key={post.id}
            className="rounded-lg border p-4 shadow-sm space-y-2"
          >
            <span className="text-xs font-medium text-muted-foreground">
              ID: {post.id}
            </span>

            <h3 className="font-semibold">{post.title}</h3>

            <p className="text-sm text-muted-foreground line-clamp-3">
              {post.body}
            </p>
          </div>
        ))}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={
                page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
              }
            />
          </PaginationItem>

          {Array.from({ length: data?.totalPages ?? 0 })
            .slice(0, 5)
            .map((_, index) => {
              const pageNumber = index + 1;

              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    isActive={page === pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className="cursor-pointer"
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

          <PaginationItem>
            <PaginationNext
              onClick={() => setPage((p) => Math.min(data!.totalPages, p + 1))}
              className={
                page === data?.totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {isFetching && (
        <p className="text-sm text-muted-foreground">Loading next page...</p>
      )}
    </div>
  );
};

export default App;
