// hooks/useAuth.ts
import { useMutation } from "@tanstack/react-query";
import { authService, AdminLoginPayload, AdminLoginResponse } from "@/services/auth.service";

export function useLogin() {
  return useMutation<AdminLoginResponse, Error, AdminLoginPayload>({
    mutationFn: (payload: AdminLoginPayload) => authService.adminLogin(payload),
    onSuccess: (data) => {
      if (data.token) {
        document.cookie = `admin_session=${data.token}; path=/; max-age=3600; SameSite=Lax; Secure`;
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