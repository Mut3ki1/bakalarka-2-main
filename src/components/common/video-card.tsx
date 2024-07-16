"use client";

import { Post } from "@/constants/types";
import { Button } from "../ui/button";
import { useLikeAction } from "../../../api/mutations/useLikeAction";
import { useUser } from "@/hooks/useAuthState";

type VideoCardProps = {
  post: Post;
};

export const VideoCard = ({ post }: VideoCardProps) => {
  const { mutateAsync } = useLikeAction();
  const user = useUser();

  const getFileType = (url: string) => {
    const urlObject = new URL(url);
    const pathname = urlObject.pathname;
    const extension = pathname.split(".").pop();
    return extension;
  };

  const renderMedia = () => {
    const fileType = getFileType(post.video);
    switch (fileType) {
      case "mp4":
      case "webm":
      case "ogg":
        return (
          <video controls className="w-full">
            <source src={post.video} type={`video/${fileType}`} />
            Your browser does not support the video tag.
          </video>
        );
      case "mp3":
        return (
          <audio controls className="w-full">
            <source src={post.video} type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>
        );
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <img src={post.video} alt={post.name} className="w-full" />;
      default:
        return <p>Unsupported media type</p>;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
      {renderMedia()}
      <div className="p-4">
        <h2 className="text-xl font-bold">{post.name}</h2>
        <p className="text-gray-700">{post.description}</p>

        {post?.likedByUsers?.length}

        <Button onClick={async () => await mutateAsync({ postId: post?.id })}>
          {post?.likedByUsers?.includes(user?.uid ?? "") ? "Unlike" : "Like"}
        </Button>
      </div>
    </div>
  );
};
