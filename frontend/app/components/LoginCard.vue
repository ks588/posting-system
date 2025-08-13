<script setup>
import { defineEmits, reactive, ref } from 'vue'
import { z } from 'zod'

const emit = defineEmits(['close'])

function close() {
  emit('close')
}

// Zod schema for login form
const schema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
})

const initialValues = reactive({
  email: '',
  password: '',
})

const loading = ref(false)
const serverError = ref('')

async function onFormSubmit(values) {
  loading.value = true
  serverError.value = ''

  try {
    const result = await login(values.email, values.password)

    if (result.success) {
      //show success toast or store token globally here
      close()
    } else {
      serverError.value = result.message || 'Login failed'
    }
  } catch (err) {
    serverError.value = err.message || 'Unexpected error'
  } finally {
    loading.value = false
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

      <Form
        :initialValues="initialValues"
        :resolver="schema"
        @submit="onFormSubmit"
        class="flex flex-col gap-2 w-full sm:w-80"
      >
        <p class="text-sm ml-2">Email</p>
        <FormField
          v-slot="$field"
          name="email"
          class="flex flex-col gap-3 border border-gray-300 rounded-md"
        >
          <InputText type="email" v-model="initialValues.email" />
          <Message
            v-if="$field?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $field.error?.message }}
          </Message>
        </FormField>

        <p class="text-sm ml-2">Password</p>
        <FormField
          v-slot="$field"
          name="password"
          class="flex flex-col gap-3 border border-gray-300 rounded-md"
        >
          <Password class="mb-3 ml-2" v-model="initialValues.password" toggleMask />
          <Message
            v-if="$field?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $field.error?.message }}
          </Message>
        </FormField>

        <p v-if="serverError" class="text-red-600 ml-2 text-sm mb-2">{{ serverError }}</p>

        <Button
          unstyled
          type="submit"
          :disabled="loading"
          class="border border-black bg-black text-white px-8 mx-10 mt-5 py-2 rounded-md tracking-wider hover:border-black hover:bg-white hover:text-black transition disabled:opacity-50"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </Button>
      </Form>
    </div>
  </div>
</template>

