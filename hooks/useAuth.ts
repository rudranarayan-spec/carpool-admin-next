// hooks/useAuth.ts
import { useMutation } from "@tanstack/react-query";
import { authService, LoginPayload, LoginResponse } from "@/services/auth.service";

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
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