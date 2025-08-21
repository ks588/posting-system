<script setup lang="ts">
import { onMounted } from 'vue'
import { useSubscriptions } from '../../composables/useAllSubscriptions'

const { subscriptions, loading, error, fetchSubscriptions } = useSubscriptions()

onMounted(() => {
  fetchSubscriptions()
})

</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Admin Dashboard</h1>
    <p class="mb-6">Here you can manage subscriptions and view details.</p>

    <div v-if="loading" class="text-gray-500">Loading subscriptions...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>

    <table v-else class="w-full border border-gray-300 rounded-lg shadow-sm">
      <thead>
        <tr class="bg-gray-100 text-left">
          <th class="p-3 border-b">Subscription ID</th>
          <th class="p-3 border-b">User ID</th>
          <th class="p-3 border-b">Status</th>
          <th class="p-3 border-b">Plan Name</th>
          <th class="p-3 border-b">Type</th>
          <th class="p-3 border-b">Price (USD)</th>
          <th class="p-3 border-b">Expires At</th>

        </tr>
      </thead>
      <tbody>
        <tr v-for="sub in subscriptions" :key="sub.id" class="hover:bg-gray-50">
          <td class="p-3 border-b">{{ sub.id }}</td>
          <td class="p-3 border-b">{{ sub.userId }}</td>
          <td class="p-3 border-b">
            <span
              class="px-2 py-1 rounded text-white text-sm"
              :class="{
                'bg-green-600': sub.status === 'active',
                'bg-yellow-500': sub.status === 'trialing',
                'bg-red-600': sub.status === 'canceled',
                'bg-gray-500': !['active','trialing','canceled'].includes(sub.status)
              }"
            >
              {{ sub.status }}
            </span>
          </td>
          <td class="p-3 border-b"><p class="bg-blue-600 mx-10 text-center text-white rounded-md p-1">{{ sub.planName || 'No Plan' }}</p></td>
          <td class="p-3 border-b">{{ sub.planType || '-' }}</td>
          <td class="p-3 border-b">${{ sub.planPrice || 0 }}</td>
          <td class="p-3 border-b">{{ new Date(sub.expiresAt).toLocaleDateString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
