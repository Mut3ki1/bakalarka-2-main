"use client";

import { useState, useEffect } from "react";

import { useUser } from "@/hooks/useAuthState";
import { getClip } from "../../../../api/api";
import { useUpdatePost } from "../../../../api/mutations/useUpdatePost";
import { useParams } from "next/navigation";

export default function EditPost() {
  const params = useParams();
  const postId = params?.postId as string;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [existingVideoUrl, setExistingVideoUrl] = useState("");

  const { mutateAsync: updatePost } = useUpdatePost();
  const user = useUser();

  // TODO: Rework this to useQuery
  useEffect(() => {
    const fetchPost = async () => {
      const doc = await getClip(postId);
      if (doc.exists()) {
        const data = doc.data();
        setName(data.name);
        setDescription(data.description);
        setExistingVideoUrl(data.video);
      }
    };

    fetchPost();
  }, [postId]);

  const uploadVideo = async () => {
    await updatePost({
      postId,
      name,
      description,
      video: existingVideoUrl,
      userId: user?.uid ?? "",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
      <input
        type="text"
        className="mb-2 p-2 border border-gray-300 rounded w-full"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        className="mb-2 p-2 border border-gray-300 rounded w-full"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <video controls className="w-full rounded-md">
        <source src={existingVideoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <button onClick={uploadVideo}>Save changes</button>
    </div>
  );
}
