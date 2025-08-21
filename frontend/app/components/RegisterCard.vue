<script setup lang="ts">
import { reactive, ref } from 'vue'
import { z, ZodError } from 'zod'
import { useRegister } from '../composables/useRegister' // adjust path
const emit = defineEmits(['close', 'showSubscription'])



function close() {
  emit('close')
}
function ShowSubscription() {
  emit('showSubscription')
}

// Zod schema
const schema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Confirm password is required' }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

// Form state
const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

// Validation errors
const validationErrors = reactive<Record<string, string>>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const serverError = ref('')

// Register composable
const { register, loading, error } = useRegister()

async function onSubmit() {
  // Reset errors
  Object.keys(validationErrors).forEach(key => validationErrors[key] = '')
  serverError.value = ''

  // Validate form with Zod
  const result = schema.safeParse(form)
  if (!result.success) {
    result.error.errors.forEach(err => {
      const key = err.path[0] as string | undefined
      if (key && key in validationErrors) validationErrors[key] = err.message
    })
    return
  }

  // Call register composable
  const success = await register(form.username, form.email, form.password)
  if (success) {
    close()
    ShowSubscription()
  } else {
    serverError.value = error.value || 'Registration failed'
  }
}
</script>

<template>
  <div
    class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
    @click.self="close"
  >
    <div class="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative">
      <button
        @click="close"
        class="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        aria-label="Close"
      >
        ✕
      </button>
      <h3 class="text-xl font-semibold mb-4">Register</h3>

      <form @submit.prevent="onSubmit" class="flex flex-col gap-3 w-full sm:w-80">
        <!-- Username -->
        <label class="flex flex-col gap-1">
          <span class="text-sm ml-2">Username</span>
          <input
            v-model="form.username"
            type="text"
            placeholder="Enter username"
            class="border border-gray-300 rounded-md p-2"
          />
          <p v-if="validationErrors.username" class="text-red-600 text-sm ml-2">
            {{ validationErrors.username }}
          </p>
        </label>

        <!-- Email -->
        <label class="flex flex-col gap-1">
          <span class="text-sm ml-2">Email</span>
          <input
            v-model="form.email"
            type="email"
            placeholder="Enter email"
            class="border border-gray-300 rounded-md p-2"
          />
          <p v-if="validationErrors.email" class="text-red-600 text-sm ml-2">
            {{ validationErrors.email }}
          </p>
        </label>

        <!-- Password -->
        <label class="flex flex-col gap-1">
          <span class="text-sm ml-2">Password</span>
          <input
            v-model="form.password"
            type="password"
            placeholder="Enter password"
            class="border border-gray-300 rounded-md p-2"
          />
          <p v-if="validationErrors.password" class="text-red-600 text-sm ml-2">
            {{ validationErrors.password }}
          </p>
        </label>

        <!-- Confirm Password -->
        <label class="flex flex-col gap-1">
          <span class="text-sm ml-2">Confirm Password</span>
          <input
            v-model="form.confirmPassword"
            type="password"
            placeholder="Confirm password"
            class="border border-gray-300 rounded-md p-2"
          />
          <p v-if="validationErrors.confirmPassword" class="text-red-600 text-sm ml-2">
            {{ validationErrors.confirmPassword }}
          </p>
        </label>

        <!-- Server error -->
        <p v-if="serverError" class="text-red-600 text-sm ml-2">{{ serverError }}</p>

        <!-- Submit button -->
        <button
          type="submit"
          :disabled="loading"
          class="border border-black bg-black text-white px-8 mx-10 mt-5 py-2 rounded-md tracking-wider hover:border-black hover:bg-white hover:text-black transition disabled:opacity-50"
        >
          {{ loading ? 'Registering...' : 'Register' }}
        </button>
      </form>
    </div>
  </div>
</template>
