import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { deleteClip, likeOrDislikePost } from "../api";
import { useUser } from "@/hooks/useAuthState";

type MutationPayload = {
  postId: string;
};

export const useLikeAction = () => {
  const user = useUser();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId }: MutationPayload) => {
      await likeOrDislikePost(postId, user?.uid ?? "");
      qc.invalidateQueries({
        queryKey: ["myPosts"],
      });

      qc.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
};
