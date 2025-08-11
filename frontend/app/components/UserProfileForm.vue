<script setup lang="ts">
import { reactive } from 'vue'
import { z, ZodType } from 'zod'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Message from 'primevue/message'

// Define Zod schema
const schema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  username: z.string().min(1, { message: 'Username is required' }),
  email: z.string().email({ message: 'Invalid email' }).min(1, { message: 'Email is required' }),
})

// Initial form values
const initialValues = reactive({
  name: 'Kasun Jayamaha',
  username: '@Ksn1234',
  email: 'samplemail@email.com',
})

// Form errors reactive state
const errors = reactive<{ [key: string]: string | null }>({
  name: null,
  username: null,
  email: null,
})

// Helper to validate single field on input change (optional)
function validateField(field: keyof typeof initialValues) {
  try {
    (schema.shape[field] as ZodType<any>).parse(initialValues[field])
    errors[field] = null
  } catch (err) {
    if (err instanceof z.ZodError) {
      errors[field] = err.errors[0]?.message || 'Invalid'
    }
  }
}

// Form submission handler
function onFormSubmit() {
  try {
    schema.parse(initialValues)
    // Clear errors
    Object.keys(errors).forEach(key => (errors[key] = null))
    console.log('Form submitted with:', initialValues)
    // Add your submit logic here, e.g. API call
  } catch (err) {
    if (err instanceof z.ZodError) {
      err.errors.forEach(e => {
        const field = e.path[0] as keyof typeof errors
        errors[field] = e.message
      })
    }
  }
}
</script>

<template>
  <form @submit.prevent="onFormSubmit" class="flex flex-col gap-4 w-full max-w-md">
    <div class="flex flex-col gap-1">
      <label for="name" class="font-semibold">Name</label>
      <InputText
        id="name"
        v-model="initialValues.name"
        @input="validateField('name')"
        class="w-full"
        placeholder="Enter your name"
      />
      <Message
        v-if="errors.name"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ errors.name }}
      </Message>
    </div>

    <div class="flex flex-col gap-1">
      <label for="username" class="font-semibold">User Name</label>
      <InputText
        id="username"
        v-model="initialValues.username"
        @input="validateField('username')"
        class="w-full"
        placeholder="Enter your username"
      />
      <Message
        v-if="errors.username"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ errors.username }}
      </Message>
    </div>

    <div class="flex flex-col gap-1">
      <label for="email" class="font-semibold">Email</label>
      <InputText
        id="email"
        type="email"
        v-model="initialValues.email"
        @input="validateField('email')"
        class="w-full"
        placeholder="Enter your email"
      />
      <Message
        v-if="errors.email"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ errors.email }}
      </Message>
    </div>

    <Button type="submit" label="Update Profile" class="mt-4" />
  </form>
</template>
