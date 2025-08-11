<script setup>
import { ref } from 'vue'
import WritePostCard from '~/components/WrtiePostCard.vue'

const showModal = ref(false)

function writeCard() {
  showModal.value = !showModal.value
}
</script>

<template>
  <div>
    <button  @click="writeCard" class="m-10 hover:underline" >Show Card</button>

    <WritePostCard v-if="showModal" @close="writeCard">
      
    </WritePostCard>
  </div>
</template>
