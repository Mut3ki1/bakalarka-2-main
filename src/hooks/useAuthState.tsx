import {
  useState,
  useEffect,
  useContext,
  createContext,
  useMemo,
  Dispatch,
  SetStateAction,
} from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import React from 'react';
import { auth } from '../../firebase';
import { useRouter } from 'next/navigation';

const useAuthState = (setUserParent: Dispatch<SetStateAction<null | User>>) => {
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('currentUser', currentUser);
      if (currentUser) {
        setUser(currentUser);
        setUserParent(currentUser);
      } else {
        setUser(null);
        setUserParent(null);
        router.push('/');
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ctx = useMemo(
    () => ({
      user,
    }),
    [user]
  );

  return ctx;
};

const AuthContext = createContext<User | null>(null);

export const AuthProvider = ({ setUser, children }: any) => {
  const user = useAuthState(setUser);

  return (
    <AuthContext.Provider value={user.user}>{children}</AuthContext.Provider>
  );
};

export const useUser = () => useContext(AuthContext);
