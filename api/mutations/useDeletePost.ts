import { useMutation } from "@tanstack/react-query";
import { deleteClip } from "../api";

type MutationPayload = {
  id: string;
};

export const useDeletePost = () => {
  return useMutation({
    mutationFn: async ({ id }: MutationPayload) => {
      await deleteClip(id);
    },
  });
};
