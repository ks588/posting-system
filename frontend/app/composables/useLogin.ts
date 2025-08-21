interface LoginApiResponse {
  status: boolean;
  path: string;
  message: string;
  statusCode: number;
  data: {
    access_token: string;
    user?: {
      id: number;
      name: string;
      email: string;
      role?: string;
    };
  };
  timestamp: string;
}

export function useLogin() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    loading.value = true;
    error.value = null;

    try {
      const res = await $fetch<LoginApiResponse>("http://localhost:3000/auth/login", {
        method: "POST",
        body: { email, password }
      });

      if (!res.status) {
        // backend says login failed
        error.value = res.message || "Login failed";
        return false;
      }

      // Save token
      sessionStorage.setItem("authtoken", res.data.access_token);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));

      // Save user only if backend returns it
      if (res.data.user) {
        sessionStorage.setItem("user", JSON.stringify(res.data.user));
      }

      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message;
      } else if (typeof err === "object" && err !== null && "data" in err) {
        error.value = (err as any).data?.message || "Login failed";
      } else {
        error.value = "Login failed";
      }
      return false;
    } finally {
      loading.value = false;
    }
  };

  return { login, loading, error };
}
