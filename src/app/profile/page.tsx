"use client";

import { Post } from "@/constants/types";
import Image from "next/image";
import { useMyPosts } from "../../../api/query/useMyPosts";
import { useUser } from "@/hooks/useAuthState";
import { useDeletePost } from "../../../api/mutations/useDeletePost";
import { useQueryClient } from "@tanstack/react-query";

const VideoComponent = ({ item }: { item: Post }) => {
  const { mutate, mutateAsync: deletePost } = useDeletePost();
  const qc = useQueryClient();

  return (
    <div className="mb-4">
      <video controls className="w-full rounded-md">
        <source src={item.video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <h3 className="text-lg font-bold">{item.name}</h3>
      <p>{item.description}</p>
      <button
        onClick={async () => {
          await deletePost({ id: item.id });
          qc.invalidateQueries({
            queryKey: ["myPosts"],
          });
        }}
      >
        delete
      </button>

      <a href={`/edit/${item.id}`}>Edit post</a>
    </div>
  );
};

export default function Profile() {
  const user = useUser();
  const { data, isLoading } = useMyPosts();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center min-h-screen p-8 bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 flex flex-col items-center mb-6">
        <Image
          src={user?.photoURL ?? "/default-profile.png"}
          alt="Profile Picture"
          width={100}
          height={100}
          className="rounded-full mb-4"
        />
        <h2 className="text-2xl font-bold">{user?.displayName}</h2>
        <p className="text-gray-600">@{user?.displayName}</p>
        <div className="mt-4 text-center">
          <p>Posts: {data?.length}</p>
        </div>
      </div>
      <div className="w-full md:w-2/3 lg:w-1/2">
        {data?.map((item, index) => (
          <VideoComponent key={index} item={item} />
        ))}
      </div>
    </main>
  );
}
