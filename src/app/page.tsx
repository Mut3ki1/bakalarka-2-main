"use client";

import { useState, useRef, useCallback } from "react";
import { useUser } from "@/hooks/useAuthState";
import { VideoCard } from "@/components/common/video-card";
import React from "react";
import { useInfinitePosts } from "../../api/query/useInfinitePosts";

export default function Home() {
  const user = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfinitePosts(searchTerm, sortOption);

  const observer = useRef<HTMLDivElement>();
  const lastPostElementRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full md:w-2/3 lg:w-1/2">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        >
          <option value="name">Name</option>
          <option value="date">Date</option>
          <option value="likes">Likes</option>
        </select>
      </div>
      {data?.pages.map((page, pageIndex) => (
        <React.Fragment key={pageIndex}>
          {page.clips.map((post, index) => (
            <div
              key={post.id}
              ref={
                pageIndex === data.pages.length - 1 &&
                index === page.clips.length - 1
                  ? lastPostElementRef
                  : null
              }
              className="w-full md:w-2/3 lg:w-1/2"
            >
              <VideoCard post={post} />
            </div>
          ))}
        </React.Fragment>
      ))}
      {isFetchingNextPage && <div>Loading...</div>}
    </div>
  );
}
