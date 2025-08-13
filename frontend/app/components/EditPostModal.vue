<script setup lang="ts">
import { ref, watch } from 'vue'
import { useUpdatePost } from '../composables/useUpdatePost'   // <-- import update composable
import { useDeletePost } from '../composables/deletePost'

interface Post {
  id: number
  title: string
  description: string
  imageUrl: string
}

const props = defineProps<{
  post: Post | null
}>()

const emits = defineEmits<{
  (e: 'close'): void
  (e: 'refresh'): void
}>()

const { updatePost } = useUpdatePost()   // <-- use updatePost here
const { deletePost } = useDeletePost()

const title = ref('')
const description = ref('')
const imageUrl = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

watch(
  () => props.post,
  (post) => {
    if (post) {
      title.value = post.title
      description.value = post.description
      imageUrl.value = post.imageUrl
    } else {
      title.value = ''
      description.value = ''
      imageUrl.value = ''
    }
  },
  { immediate: true }
)

async function onFormSubmit() {
  if (!props.post) return
  error.value = null
  loading.value = true

  try {
    // Call updatePost with id and new data
    await updatePost(props.post.id, title.value, description.value, imageUrl.value)
    emits('refresh')
    emits('close')
  } catch (err) {
    error.value = (err as Error).message || 'Failed to save post'
  } finally {
    loading.value = false
  }
}

async function onDeletePost() {
  if (!props.post) return
  if (!confirm('Are you sure you want to delete this post?')) return

  loading.value = true
  try {
    await deletePost(props.post.id)
    emits('refresh')
    emits('close')
  } catch (err) {
    error.value = (err as Error).message || 'Failed to delete post'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    v-if="post"
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
        <h3 class="text-xl font-semibold mb-4">Edit Post</h3>

        <label class="flex flex-col gap-1">
          <span class="text-sm ml-2">Title</span>
          <input
            v-model="title"
            type="text"
            class="border border-gray-300 rounded-md p-2"
            required
          />
        </label>

        <label class="flex flex-col gap-1">
          <span class="text-sm ml-2">Description</span>
          <textarea
            v-model="description"
            class="border border-gray-300 rounded-md p-2 h-32 resize-none"
            required
          ></textarea>
        </label>

        <label class="flex flex-col gap-1">
          <span class="text-sm ml-2">Image URL</span>
          <input
            v-model="imageUrl"
            type="url"
            class="border border-gray-300 rounded-md p-2"
          />
        </label>

        <div class="flex gap-3">
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 border border-black bg-black text-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition disabled:opacity-50"
          >
            {{ loading ? 'Saving...' : 'Update Post' }}
          </button>
          <button
            type="button"
            @click="onDeletePost"
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
