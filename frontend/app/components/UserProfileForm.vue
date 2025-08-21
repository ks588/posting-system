<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { navigateTo } from '#app'
import { useSubscription } from '../composables/useSubscription'
import { useCustomerPortal } from '../composables/useCustomerPortal'

// Get user from sessionStorage
const userStr = sessionStorage.getItem('user')
const user = userStr ? JSON.parse(userStr) : { UserId: 0, username: '', email: '', role: '' }

// Subscription composable
const { subscription, loading, error, fetchSubscription } = useSubscription()

// Customer Portal composable
const { portalUrl, loading: portalLoading, error: portalError, fetchPortal } = useCustomerPortal()

// Local state to open subscription card
const showSubscriptionCard = ref(false)

// Fetch subscription for the current user
onMounted(() => {
  if (user.UserId) fetchSubscription(user.UserId)
})

// Function to navigate to admin dashboard
function goToAdminDashboard() {
  navigateTo('/admin/dashboard')
}

// Open Stripe Customer Portal
async function openCustomerPortal() {
  if (!user.UserId || portalLoading.value) return
  await fetchPortal(user.UserId)
  if (portalUrl.value) window.open(portalUrl.value, '_blank')
}

// Open subscription card
function openSubscriptionCard() {
  showSubscriptionCard.value = true
}
</script>

<template>
  <div class="flex flex-col gap-6 w-full max-w-md bg-white p-6 rounded-lg shadow-md">
    <!-- User Details -->
    <div>
      <h2 class="text-xl font-semibold mb-3">User Details</h2>

      <div class="flex justify-between">
        <span class="font-semibold">Username:</span>
        <span>{{ user.username }}</span>
      </div>

      <div class="flex justify-between">
        <span class="font-semibold">Email:</span>
        <span>{{ user.email }}</span>
      </div>

      <div class="flex justify-between items-center">
        <span class="font-semibold">Role:</span>
        <span>{{ user.role }}</span>
        <button
          v-if="user.role === 'admin'"
          @click="goToAdminDashboard"
          class="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Admin Dashboard
        </button>
      </div>
    </div>

    <!-- Subscription Details Card -->
    <div class="relative transition transform hover:scale-105 bg-yellow-100 rounded-lg shadow-md p-4">
      <!-- Info Icon -->
      <img
        v-if="subscription"
        src="/infor.png"
        alt="Info"
        class="w-6 h-6 absolute top-2 right-2 cursor-pointer hover:opacity-80"
        @click="openCustomerPortal"
        :title="portalLoading ? 'Opening Stripe portal...' : 'View in Stripe Portal'"
      />

      <h2 class="text-xl font-semibold mb-3">Subscription Details</h2>

      <div v-if="loading" class="text-sm text-gray-600">Loading subscription...</div>
      <div v-else-if="error" class="text-sm text-red-600">{{ error }}</div>

      <!-- Subscription exists -->
      <div v-else-if="subscription" class="text-xs">
        <div class="flex justify-between">
          <span class="font-semibold">Plan:</span>
          <span class="text-white bg-blue-600 border rounded-md px-1">{{ subscription.plan.name }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold">Posting Allowance:</span>
          <span>{{ subscription.plan.maxPosts }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold">Posts Used:</span>
          <span>{{ subscription.userSubscription.postsUsed }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold">Remaining Posts:</span>
          <span class="text-red-600">{{ subscription.remainingPosts }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold">Valid Till:</span>
          <span>{{ new Date(subscription.userSubscription.expiresAt).toLocaleDateString() }}</span>
        </div>
      </div>

      <!-- No subscription -->
      <div v-else class="text-sm text-gray-600 flex flex-col gap-2">
        <span>No active subscription currently available.</span>
        <button
          @click="openSubscriptionCard"
          class="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 w-max"
        >
          Subscribe to ThoughtPad
        </button>
      </div>

      <!-- Portal Loading/Error -->
      <div v-if="portalLoading" class="text-xs text-gray-600 mt-2">Opening Stripe portal...</div>
      <div v-if="portalError" class="text-xs text-red-600 mt-2">{{ portalError }}</div>
    </div>

    <!-- Subscription Card Popup -->
    <SubscriptionCard
      v-if="showSubscriptionCard"
      @close="showSubscriptionCard = false"
    />
  </div>
</template>
