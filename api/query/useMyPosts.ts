import { useQuery } from '@tanstack/react-query';
import { getClips, getMyClips } from '../api';
import { useUser } from '@/hooks/useAuthState';

export const useMyPosts = () => {
  const user = useUser();

  return useQuery({
    queryKey: ['myPosts'],
    queryFn: async () => {
      const res = await getMyClips(user?.uid ?? '');

      console.log('res', res);
      return res;
    },
  });
};
