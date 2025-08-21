// composables/useSubscription.ts
import { ref } from "vue";

interface UserSubscription {
  postsUsed: number;
  planId: number;
  id: number;
  startedAt: string;
  expiresAt: string;
}

interface Plan {
  name: string;
  maxPosts: number | null;
}

interface SubscriptionResponse {
  status: boolean;
  path: string;
  message: string;
  statusCode: number;
  data: {
    userSubscription: UserSubscription;
    plan: Plan;
    remainingPosts: number;
  };
  timestamp: string;
}

export function useSubscription() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const subscription = ref<SubscriptionResponse["data"] | null>(null);

  const fetchSubscription = async (userId: number) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await $fetch<SubscriptionResponse>(
        `http://localhost:3000/subscription/${userId}`
      );

      // Fallback for when maxPosts is null (treat as unlimited)
      const maxPosts = res.data.plan.maxPosts ?? Infinity;
      const remainingPosts = maxPosts - res.data.userSubscription.postsUsed;

      subscription.value = {
        ...res.data,
        remainingPosts: remainingPosts < 0 ? 0 : remainingPosts,
      };
    } catch (err: any) {
      error.value =
        err?.data?.message || err.message || "Failed to fetch subscription";
      subscription.value = null;
    } finally {
      loading.value = false;
    }
  };

  return { subscription, loading, error, fetchSubscription };
}
