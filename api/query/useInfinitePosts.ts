import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getClips } from "../api";
import { useCallback, useState } from "react";

export function useInfinitePosts(
  searchTerm: string,
  sortOption: string,
  batchSize = 1
) {
  return useInfiniteQuery({
    queryKey: ["posts", searchTerm, sortOption, batchSize],
    queryFn: async ({ pageParam }) => {
      const res = await getClips(searchTerm, sortOption, pageParam, batchSize);
      return res;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.lastDoc : undefined;
    },
  });
}
