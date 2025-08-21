<script setup lang="ts">
import { ref, watch } from 'vue'
import { useUpdateUser } from '../composables/useUpdateUser' 
import { useDeleteUser } from '../composables/useDeleteUser' 

interface User {
  id: number
  username: string
  email: string
  role: string
}

const props = defineProps<{
  user: User | null
}>()

const emits = defineEmits<{
  (e: 'close'): void
  (e: 'refresh'): void
}>()

const { updateUser } = useUpdateUser()
const { deleteUser } = useDeleteUser()

const username = ref('')
const email = ref('')
const role = ref('user')
const loading = ref(false)
const error = ref<string | null>(null)

watch(
  () => props.user,
  (user) => {
    if (user) {
      username.value = user.username
      email.value = user.email
      role.value = user.role
    } else {
      username.value = ''
      email.value = ''
      role.value = 'user'
    }
  },
  { immediate: true }
)

async function onFormSubmit() {
  if (!props.user) return
  error.value = null
  loading.value = true

  try {
    await updateUser(props.user.id, username.value, email.value, role.value)
    emits('refresh')
    emits('close')
  } catch (err) {
    error.value = (err as Error).message || 'Failed to update user'
  } finally {
    loading.value = false
  }
}

async function onDeleteUser() {
  if (!props.user) return
  if (!confirm('Are you sure you want to delete this user?')) return

  loading.value = true
  try {
    await deleteUser(props.user.id)
    emits('refresh')
    emits('close')
  } catch (err) {
    error.value = (err as Error).message || 'Failed to delete user'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    v-if="user"
    class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
      <button
        @click="$emit('close')"
        class="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        title="Cancel edit"
      >
        ✕
      </button>

      <form @submit.prevent="onFormSubmit" class="flex flex-col gap-4">
        <h3 class="text-xl font-semibold mb-4">Edit User</h3>

        <label class="flex flex-col gap-1">
          <span class="text-sm ml-2">Username</span>
          <input
            v-model="username"
            type="text"
            class="border border-gray-300 rounded-md p-2"
            required
          />
        </label>

        <label class="flex flex-col gap-1">
          <span class="text-sm ml-2">Email</span>
          <input
            v-model="email"
            type="email"
            class="border border-gray-300 rounded-md p-2"
            required
          />
        </label>

        <label class="flex flex-col gap-1">
          <span class="text-sm ml-2">Role</span>
          <select
            v-model="role"
            class="border border-gray-300 rounded-md p-2"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <div class="flex gap-3">
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 border border-black bg-black text-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition disabled:opacity-50"
          >
            {{ loading ? 'Saving...' : 'Update User' }}
          </button>
          <button
            type="button"
            @click="onDeleteUser"
            class="flex-1 border border-red-600 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-white hover:text-red-600 transition"
          >
            Delete
          </button>
        </div>

        <p v-if="error" class="text-red-600 text-sm mt-2">{{ error }}</p>
      </form>
    </div>
  </div>
</template>
