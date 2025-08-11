<template>
  <div>
      <nav class="fixed top-0 left-0 w-full bg-white shadow-md px-4 py-1 pt-2 flex items-center justify-between z-50">
        <!-- Left: Logo + Thought PAD + Search -->
        <div class="flex items-center space-x-3">
          <img src="/smlogo.png" alt="App Icon" class="w-10" />
          <span class="font-bold text-xl whitespace-nowrap">Thought PAD</span>

          <!-- Search bar container -->
          <div class="flex items-center space-x-2 ml-5">
            <img
              src="/searchicon.png"
              alt="Search"
              class="w-4 h-4 "
            />
            <InputText
              type="text"
              v-model="search"
              placeholder="Search posts..."
              unstyled class=" py-1 rounded-xl border border-gray-300 text-sm pl-2"
            />
          </div>

        </div>

        <!-- Center: Navigation Links -->
        <ul class="hidden md:flex space-x-10 font-medium text-gray-700 text-sm">
          <li>
            <NuxtLink to="/home" class="hover:underline">Home</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/about" class="hover:underline">About</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/favourite" class="hover:underline">Favourite</NuxtLink>
          </li>
        </ul>

        <!-- Right: Write Button + User Icon -->
        <div class="flex items-center space-x-4">
          <button @click="writeCard" class=" px-4 py-1 rounded transition-transform duration-300 hover:scale-105 flex">
            <img src="/writeicon.png" alt="App Icon" class="w-5 h-5 pr-1" />
            Write
          </button>
          
            <NuxtLink to="/profilepg" class="hover:underline">
                <img src="/user.png" alt="App Icon" class="w-7 pb-1 transition-transform duration-300 hover:scale-105" />
            </NuxtLink>         
        </div>
      </nav>
      <WritePostCard v-if="showWriteCard" @close="writeCard"></WritePostCard>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import WritePostCard from '~/components/WrtiePostCard.vue'

const search = ref('')
const showWriteCard = ref(false)
function writeCard(){
  showWriteCard.value = !showWriteCard.value
}

</script>
