import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Post {
  id: number;
  title: string;
  body: string;
}

export interface PaginatedPostsResponse {
  posts: Post[];
  totalPosts: number;
  totalPages: number;
  currentPage: number;
}

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com/",
  }),
  endpoints: (builder) => ({
    getPosts: builder.query<
      PaginatedPostsResponse,
      { page: number; perPage: number }
    >({
      query: ({ page, perPage }) => {
        const offset = (page - 1) * perPage;
        return `posts?_start=${offset}&_limit=${perPage}`;
      },

      transformResponse: (response: Post[], meta, arg) => {
        const totalPosts = Number(
          meta?.response?.headers.get("X-Total-Count") ?? 0,
        );

        return {
          posts: response,
          totalPosts,
          totalPages: Math.ceil(totalPosts / arg.perPage),
          currentPage: arg.page,
        };
      },
    }),
  }),
});

export const { useGetPostsQuery } = postsApi;
