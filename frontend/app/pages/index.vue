<template>
  <div class="flex flex-col justify-center items-center h-screen bg-white text-center">
    <img src="/logo.png" alt="App Icon" class="w-32 sm:w-40 md:w-48 lg:w-60 xl:w-72 mb-3" />
    
    <ProgressBar :value="progress" unstyled class="w-64 h-4 bg-gray-200 rounded overflow-hidden">
      <template #content>
        <span unstyled class="text-black font-semibold">{{ progress }}%</span>
      </template>
    </ProgressBar>
    
    <p class="text-s font-semibold mt-3">Write what you feel here ..!</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ProgressBar from 'primevue/progressbar';

const router = useRouter()
const progress = ref(0)

onMounted(() => {
  let value = 0
  const stepTime = 2000 / 100 // 2s for 100%
  const timer = setInterval(() => {
    value++
    progress.value = value
    if (value >= 100) {
      clearInterval(timer)
      router.push('/home')
    }
  }, stepTime)
})
</script>

