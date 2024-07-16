import { useMutation } from "@tanstack/react-query";
import { updateClip } from "../api";

type MutationPayload = {
  postId: string;
  name: string;
  description: string;
  video: string;
  userId: string;
};

export const useUpdatePost = () => {
  return useMutation({
    mutationFn: async ({
      postId,
      name,
      description,
      video,
      userId,
    }: MutationPayload) => {
      await updateClip(postId, name, description, video, userId);
    },
  });
};
