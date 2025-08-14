<script setup lang="ts">
import { reactive, ref } from 'vue'
import { z } from 'zod'
import { useLogin } from '../composables/useLogin'


const emit = defineEmits(['close'])

const { login, loading, error } = useLogin()

function close() {
  emit('close')
}

// Zod schema
const schema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
})

const form = reactive({
  email: '',
  password: '',
})

const validationErrors = reactive({
  email: '',
  password: '',
})

const serverError = ref('')

async function onSubmit() {
  validationErrors.email = ''
  validationErrors.password = ''
  serverError.value = ''

  const result = schema.safeParse(form)
  if (!result.success) {
    result.error.errors.forEach(err => {
      if (err.path[0] === 'email') validationErrors.email = err.message
      if (err.path[0] === 'password') validationErrors.password = err.message
    })
    return
  }

  const success = await login(form.email, form.password)

  if (success) {
    close()
  } else {
    serverError.value = error.value || 'Login failed'
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
      <h3 class="text-xl font-semibold mb-4">Login</h3>

      <form @submit.prevent="onSubmit" class="flex flex-col gap-3 w-full sm:w-80">
        <label class="text-sm ml-2">Email</label>
        <input
          type="email"
          v-model="form.email"
          class="border border-gray-300 rounded-md p-2"
        />
        <p v-if="validationErrors.email" class="text-red-600 text-sm ml-2">
          {{ validationErrors.email }}
        </p>

        <label class="text-sm ml-2">Password</label>
        <input
          type="password"
          v-model="form.password"
          class="border border-gray-300 rounded-md p-2"
        />
        <p v-if="validationErrors.password" class="text-red-600 text-sm ml-2">
          {{ validationErrors.password }}
        </p>

        <p v-if="serverError" class="text-red-600 ml-2 text-sm">{{ serverError }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="border border-black bg-black text-white px-8 mx-10 mt-5 py-2 rounded-md tracking-wider hover:border-black hover:bg-white hover:text-black transition disabled:opacity-50"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>
