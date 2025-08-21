<template>
  <div class="fixed top-0 left-0 max-w-3xl z-60 ml-57 mt-3">
    <!-- Search bar container -->
    <div class="flex items-center space-x-2">
      <img src="/searchicon.png" alt="Search" class="w-4 h-4" />
      <InputText
        type="text"
        v-model="search"
        placeholder="Search posts..."
        unstyled
        class="py-1 rounded-xl border border-gray-300 text-sm pl-2"
        @focus="showResults = true"
      />
    </div>

    <!-- Search results dropdown -->
    <transition name="fade">
      <section
        v-if="showResults && (hits.length > 0 || (search.trim() !== '' && !loading))"
        class="absolute top-full left-0 right-0 z-60 bg-white shadow-lg rounded max-w-3xl mx-auto mt-1 p-4 w-200"
        @click.stop
      >
        <p v-if="loading" class="text-gray-500">Loading...</p>
        <p v-if="error" class="text-red-600">{{ error }}</p>

        <div v-if="hits.length > 0" class="space-y-4 max-h-96 overflow-y-auto">
          <div
            v-for="hit in hits"
            :key="hit.document.id"
            class="border rounded p-4 shadow-sm cursor-pointer hover:bg-gray-50"
          >
            <h3
              v-html="hit.highlight?.title?.value || hit.document.title"
              class="text-lg font-semibold"
            ></h3>
            <img
              :src="hit.document.imageUrl"
              alt="Post image"
              class="w-full max-w-xs mt-2 rounded"
            />
            <p
              v-html="hit.highlight?.description?.value || hit.document.description"
              class="mt-2"
            ></p>
          </div>
        </div>

        <p v-else-if="!loading && search.trim() !== ''">No results found.</p>
      </section>
    </transition>

    <!-- Click outside overlay to close dropdown -->
    <div
      v-if="showResults"
      class="fixed inset-0 z-50"
      @click="showResults = false"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import InputText from 'primevue/inputtext'
import { usePostSearch } from '~/composables/usePostSearch'

const search = ref('')
const showResults = ref(false)
const { hits, loading, error, searchPosts } = usePostSearch()

let debounceTimeout: number | null = null
watch(
  search,
  (newQuery) => {
    if (debounceTimeout) clearTimeout(debounceTimeout)
    debounceTimeout = window.setTimeout(() => {
      if (newQuery.trim() !== '') {
        searchPosts(newQuery.trim())
        showResults.value = true
      } else {
        hits.value = []
        showResults.value = false
      }
    }, 300)
  }
)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
