import { useApi } from '@/hooks/useApi';
import { Skeleton } from '@/components/ui/skeleton';

interface UserData {
  id: number;
  username: string;
  email: string;
  displayName: string;
  level: number;
  xp: number;
  xpass: number;
  title: string;
  streak: number;
  lastLoginDate: string;
  lastTaskGenerationDate: string | null;
  isLocked: boolean;
  createdAt: string;
}

export function UserStatusBar() {
  const { useUser } = useApi();
  const { data, isLoading } = useUser();
  const user = data as UserData | undefined;

  if (isLoading) {
    return (
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Skeleton className="w-12 h-12 rounded-lg mr-3" />
          <div>
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-8 w-16 rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  // Get first two characters of display name for avatar or use 'US' as fallback
  const initials = user.displayName ? user.displayName.substring(0, 2).toUpperCase() : 'US';

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-lg bg-secondary/20 border border-secondary/30 flex items-center justify-center overflow-hidden mr-3">
          {/* Placeholder avatar with user initials */}
          <div className="font-rajdhani font-bold text-lg text-secondary">
            {initials}
          </div>
        </div>
        <div>
          <h2 className="font-rajdhani font-bold text-xl text-foreground">
            {user.displayName || 'User'}
          </h2>
          <div className="flex items-center">
            <span className="font-orbitron text-sm text-primary mr-2">
              LEVEL {user.level || 1}
            </span>
            <span className="text-xs text-muted-foreground">
              {user.title || 'Novice'}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <div className="flex items-center bg-muted px-3 py-1 rounded-full border border-primary/20">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-primary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-orbitron text-sm ml-1 text-secondary">
            {user.xpass || 0}
          </span>
        </div>
      </div>
    </div>
  );
}
