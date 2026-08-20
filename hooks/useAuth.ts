// hooks/useAuth.ts
import { useMutation } from "@tanstack/react-query";
import {
  authService,
  AdminLoginPayload,
  AdminLoginResponse,
} from "@/services/auth.service";
import { useEffect, useState } from "react";

export function useLogin() {
  return useMutation<AdminLoginResponse, Error, AdminLoginPayload>({
    mutationFn: (payload: AdminLoginPayload) => authService.adminLogin(payload),
    onSuccess: (data) => {
      if (data.token) {
        document.cookie = `admin_session=${data.token}; path=/; max-age=86400; SameSite=Lax; Secure`;
      }
      if (data.user) {
        localStorage.setItem("admin_user", JSON.stringify(data.user));
      }

      // 3. Redirect user back to requested page or home dashboard
      const searchParams = new URLSearchParams(window.location.search);
      const redirectTo = searchParams.get("from") || "/";

      window.location.href = redirectTo;
    },
  });
}

export function useAuth() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("admin_user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Failed to parse user from storage", err);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for storage changes in case of cross-tab logins/logouts
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return { user, isAuthenticated, isLoading };
}
