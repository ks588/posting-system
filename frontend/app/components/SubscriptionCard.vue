<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { usePlans, type Plan } from '../composables/useAllPlans'
import { useCheckout } from '../composables/useSubscriptionCheckout'

const emit = defineEmits(['close', 'selectPlan'])

const { plans, fetchPlans, loading, error } = usePlans()
const { startCheckout } = useCheckout()

const selectedPlan = ref<Plan | null>(null)

function choosePlan(plan: Plan) {
  selectedPlan.value = plan
}

async function proceed() {
  if (!selectedPlan.value) return
  emit('selectPlan', selectedPlan.value)
  emit('close')

  // 🔑 Trigger Stripe Checkout
  try {
    await startCheckout(selectedPlan.value.id)
  } catch (err) {
    console.error('Failed to start checkout:', err)
  }
}

onMounted(() => {
  fetchPlans()
})

// Separate monthly and yearly plans, sorted ascending by price
const monthlyPlans = computed(() =>
  plans.value
    .filter(p => p.type === 'monthly')
    .sort((a, b) => a.priceUsd - b.priceUsd)
)
const yearlyPlans = computed(() =>
  plans.value
    .filter(p => p.type === 'yearly')
    .sort((a, b) => a.priceUsd - b.priceUsd)
)
</script>

<template>
  <div
    class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
  >
    <div class="bg-white rounded-lg p-6 max-w-4xl w-full shadow-lg relative">
      <h3 class="text-2xl font-semibold mb-6 text-center">Choose Your Plan</h3>

      <div v-if="loading" class="text-center py-6">Loading plans...</div>
      <div v-else-if="error" class="text-red-600 text-center py-6">{{ error }}</div>
      <div v-else class="grid grid-cols-2 gap-6">
        <!-- Monthly Plans -->
        <div>
          <h4 class="font-semibold mb-3 text-center">Monthly Plans</h4>
          <div
            v-for="plan in monthlyPlans"
            :key="plan.id"
            class="p-4 border rounded-lg mb-3 cursor-pointer hover:bg-gray-100 transition"
            :class="selectedPlan?.id === plan.id ? 'border-black' : 'border-gray-300'"
            @click="choosePlan(plan)"
          >
            <h5 class="font-semibold">{{ plan.name }}</h5>
            <p class="text-sm text-gray-600">${{ plan.priceUsd }} / month</p>
            <p class="text-xs text-gray-500">{{ plan.description }}</p>
            <p class="text-xs text-gray-400 mt-1">Max Posts: {{ plan.maxPosts }}</p>
          </div>
        </div>

        <!-- Yearly Plans -->
        <div>
          <h4 class="font-semibold mb-3 text-center">Yearly Plans</h4>
          <div
            v-for="plan in yearlyPlans"
            :key="plan.id"
            class="p-4 border rounded-lg mb-3 cursor-pointer hover:bg-gray-100 transition"
            :class="selectedPlan?.id === plan.id ? 'border-black' : 'border-gray-300'"
            @click="choosePlan(plan)"
          >
            <h5 class="font-semibold">{{ plan.name }}</h5>
            <p class="text-sm text-gray-600">${{ plan.priceUsd }} / year</p>
            <p class="text-xs text-gray-500">{{ plan.description }}</p>
            <p class="text-xs text-gray-400 mt-1">Max Posts: {{ plan.maxPosts }}</p>
          </div>
        </div>
      </div>

      <button
        class="mt-6 w-full border border-black bg-black text-white py-2 rounded-md hover:bg-white hover:text-black transition disabled:opacity-50"
        :disabled="!selectedPlan"
        @click="proceed"
      >
        Continue
      </button>
    </div>
  </div>
</template>
