<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useUsers } from '../../composables/useAllUserAdmin'
import UserModal from '../../components/UpdateUserByAdmin.vue'
import RegisterModal from '../../components/RegisterCard.vue'

const { users, loading, error, fetchUsers } = useUsers()
const roleFilter = ref('all') 

// For update modal
const selectedUser = ref(null)

// For add user modal
const showRegisterModal = ref(false)

onMounted(() => {
  fetchUsers()
})

// Computed filter
const filteredUsers = computed(() => {
  if (roleFilter.value === 'all') return users.value
  return users.value.filter(user => user.role === roleFilter.value)
})

// Open update modal
function openUpdateModal(user: any) {
  selectedUser.value = {
    id: user.UserId,
    username: user.username,
    email: user.email,
    role: user.role
  }
}

// Close update modal
function closeModal() {
  selectedUser.value = null
}

// Refresh after update/delete/add
function refreshUsers() {
  fetchUsers()
  showRegisterModal.value = false
}
</script>

<template>
  <div class="flex justify-center mt-10 px-4">
    <div class="w-full max-w-5xl">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Users</h2>

        <!-- Add User Button -->
        <button
          @click="showRegisterModal = true"
          class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          + Add User
        </button>
      </div>

      <!-- Role Filter -->
      <div class="mb-4 text-right">
        <label class="mr-2 font-medium">Filter by Role:</label>
        <select v-model="roleFilter" class="border px-2 py-1 rounded">
          <option value="all">All</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      <!-- Loading/Error -->
      <div v-if="loading" class="text-center text-gray-600">Loading...</div>
      <div v-if="error" class="text-center text-red-600">{{ error }}</div>

      <!-- Users Table -->
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
                @click="openUpdateModal(user)"
                class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
              >
                Update
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

  <!-- Update Modal -->
  <UserModal
    v-if="selectedUser"
    :user="selectedUser"
    @close="closeModal"
    @refresh="refreshUsers"
  />

  <!-- Register Modal -->
  <RegisterModal
    v-if="showRegisterModal"
    @close="showRegisterModal = false"
    @refresh="refreshUsers"
  />
</template>
