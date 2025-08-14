<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useUsers } from '../../composables/useAllUserAdmin'

const { users, loading, error, fetchUsers } = useUsers()
const roleFilter = ref('all') // 'all', 'admin', 'user'

onMounted(() => {
  fetchUsers()
})

// Filtered users based on dropdown
const filteredUsers = computed(() => {
  if (roleFilter.value === 'all') return users.value
  return users.value.filter(user => user.role === roleFilter.value)
})

// Dummy handlers for update/delete (replace with actual logic)
function updateUser(userId: number) {
  alert(`Update user ${userId}`)
}

function deleteUser(userId: number) {
  alert(`Delete user ${userId}`)
}
</script>

<template>
  <div class="flex justify-center mt-10 px-4">
    <div class="w-full max-w-4xl">
      <h2 class="text-2xl font-bold mb-4 text-center">Users</h2>

      <!-- Role Filter -->
      <div class="mb-4 text-right">
        <label class="mr-2 font-medium">Filter by Role:</label>
        <select v-model="roleFilter" class="border px-2 py-1 rounded">
          <option value="all">All</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      <div v-if="loading" class="text-center text-gray-600">Loading...</div>
      <div v-if="error" class="text-center text-red-600">{{ error }}</div>

      <table
        v-else
        class="min-w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden"
      >
        <thead class="bg-gray-100">
          <tr>
            <th class="py-3 px-6 text-left">ID</th>
            <th class="py-3 px-6 text-left">Username</th>
            <th class="py-3 px-6 text-left">Role</th>
            <th class="py-3 px-6 text-left">Email</th>
            <th class="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="user in filteredUsers"
            :key="user.UserId"
            class="border-b hover:bg-gray-50 transition"
          >
            <td class="py-3 px-6">{{ user.UserId }}</td>
            <td class="py-3 px-6">{{ user.username }}</td>
            <td class="py-3 px-6">
              <span
                class="px-2 py-1 rounded text-white font-semibold text-sm"
                :class="user.role === 'admin' ? 'bg-yellow-500' : 'bg-green-500'"
              >
                {{ user.role }}
              </span>
            </td>
            <td class="py-3 px-6">{{ user.email }}</td>
            <td class="py-3 px-6 text-center space-x-2">
              <button
                @click="updateUser(user.UserId)"
                class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
              >
                Update
              </button>
              <button
                @click="deleteUser(user.UserId)"
                class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredUsers.length === 0 && !loading" class="text-center mt-4 text-gray-500">
        No users found.
      </div>
    </div>
  </div>
</template>
