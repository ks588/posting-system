interface ApiUser {
  UserId: number;
  email: string;
  username: string;
  role: string;
}

interface RegisterApiResponse {
  status: boolean;
  path: string;
  message: string;
  statusCode: number;
  data: {
    access_token: string;
    user: ApiUser;
  };
  timestamp: string;
}

export function useRegister() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    loading.value = true;
    error.value = null;

    try {
      const res = await $fetch<RegisterApiResponse>("http://localhost:3000/auth/register", {
        method: "POST",
        body: { username, email, password },
      });

      // Store token & user in session storage
      // sessionStorage.setItem("authtoken", res.data.access_token);
      // sessionStorage.setItem("user", JSON.stringify(res.data.user));

      // Save temp_userId for later use (e.g., Stripe subscription)
      sessionStorage.setItem("temp_userId", res.data.user.UserId.toString());

      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message;
      } else if (typeof err === "object" && err !== null && "data" in err) {
        error.value = (err as any).data?.message || "Registration failed";
      } else {
        error.value = "Registration failed";
      }
      return false;
    } finally {
      loading.value = false;
    }
  };

  return { register, loading, error };
}
