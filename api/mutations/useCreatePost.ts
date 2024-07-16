import { useMutation } from '@tanstack/react-query';
import { addClip } from '../api';

type MutationPayload = {
  name: string;
  description: string;
  video: string;
  userId: string;
};

export const useCreatePost = () => {
  return useMutation({
    mutationFn: async ({
      name,
      description,
      video,
      userId,
    }: MutationPayload) => {
      await addClip(name, description, video, userId);
    },
  });
};
