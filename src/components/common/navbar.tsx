import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { auth } from '../../../firebase';
import { useUser } from '@/hooks/useAuthState';

export const Menu = () => {
  const router = useRouter();
  const user = useUser();

  console.log(user);

  return (
    <div className='flex flex-col items-end justify-center border-2 border-green-500'>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>
            <Avatar>
              <AvatarImage src={user?.photoURL ?? ''} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => router.push('/')}>Home</MenubarItem>
            <MenubarItem onClick={() => router.push('/profile')}>
              My profile
            </MenubarItem>
            <MenubarItem onClick={() => router.push('/add')}>
              Add video
            </MenubarItem>
            <MenubarSeparator />

            <MenubarItem onClick={() => auth.signOut()}>Log out</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
};
