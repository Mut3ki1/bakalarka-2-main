import { useUser } from '@/hooks/useAuthState';
import { signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth, provider } from '../../../firebase';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

export const Login = () => {
  const login = async () => {
    await signInWithPopup(auth, provider);
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen gap-4'>
      <div className='text-[24px]'>Login</div>
      <Button variant='outline' onClick={login}>
        Button
      </Button>
    </div>
  );
};
