<template>
  <div>
      <div
        class="fixed inset-0 bg-black/50 flex justify-end items-start z-50 pt-10"
        @click.self="close"
      >
        <div class="bg-white rounded-lg p-6 w-72 shadow-lg relative mt-6 mr-6">
          <!-- Close button -->
          <button
            @click="close"
            class="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            aria-label="Close"
          >
            ✕
          </button>

          <!-- Title -->
          <h3 class="text-lg font-semibold mb-2">Already have an account?</h3>
          <p class="text-sm text-gray-600 mb-5">Choose an option below to continue.</p>

          <!-- Two buttons in one row -->
          <div class="flex gap-4">
            <button @click="handleLogin"
              class="flex-1 bg-black text-white px-4 py-1 rounded-md hover:bg-white border border-black hover:text-black hover:border border-black transition"
            >
              Login
            </button>
            <button @click="handleRegister"
              class="flex-1 border border-black text-black px-4 py-1 rounded-md hover:bg-black hover:text-white transition"
            >
              Register
            </button>
          </div>
        </div>
        <RegisterCard v-if="registeropen" @close="registeropen = false" />
        <LoginCard v-if="loginopen" @close="loginopen = false" />
      </div>
  </div>
</template>
<script setup>
import { defineEmits } from 'vue'
import RegisterCard from './RegisterCard.vue'
import LoginCard from './LoginCard.vue'

const emit = defineEmits(['close'])
const loginopen = ref(false)
const registeropen = ref(false)

function close() {
  emit('close')
}

//function to handle login and register actions
function handleLogin() {
  // Logic for login action
  
  loginopen.value = !loginopen.value
}
function handleRegister() {
  // Logic for register action
  
  registeropen.value = !registeropen.value
  
}
</script>

