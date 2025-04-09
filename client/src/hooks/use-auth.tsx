import { createContext, ReactNode, useContext, useState } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { User, Login, Register } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { WelcomeModal } from "@/components/modals/WelcomeModal";
import { InitializationModal } from "@/components/modals/InitializationModal";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, Login>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, Register>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showInitModal, setShowInitModal] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: Login) => {
      const res = await apiRequest("POST", "/api/auth/login", credentials);
      return await res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
      // First show the initialization modal 
      setIsNewUser(false);
      setShowInitModal(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: Register) => {
      const res = await apiRequest("POST", "/api/auth/register", credentials);
      return await res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
      // First show the initialization modal
      setIsNewUser(true);
      setShowInitModal(true); 
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handler for when initialization is complete
  const handleInitComplete = () => {
    setShowInitModal(false);
    // After init modal closes, show the welcome modal
    setShowWelcomeModal(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
      
      {/* Initialization Modal */}
      {showInitModal && user && (
        <InitializationModal 
          isOpen={showInitModal} 
          onComplete={handleInitComplete} 
        />
      )}
      
      {/* Welcome Modal */}
      {showWelcomeModal && user && (() => {
        try {
          return (
            <WelcomeModal 
              user={user} 
              isNewUser={isNewUser} 
              onClose={() => setShowWelcomeModal(false)} 
            />
          );
        } catch (error) {
          console.error("Error rendering welcome modal:", error);
          // If welcome modal fails, close it
          setShowWelcomeModal(false);
          return null;
        }
      })()}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}