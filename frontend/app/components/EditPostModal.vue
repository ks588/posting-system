<script setup lang="ts">
import { ref, watch } from 'vue'
import { useUpdatePost } from '../composables/useUpdatePost'
import { useDeletePost } from '../composables/deletePost'

interface Post {
  id: number
  title: string
  description: string
  imageUrl: string
}

const props = defineProps<{ post: Post | null }>()
const emits = defineEmits<{ (e: 'close'): void; (e: 'refresh'): void }>()

const { updatePost } = useUpdatePost()
const { deletePost } = useDeletePost()

const title = ref('')
const description = ref('')
const imageFile = ref<File | null>(null)
const imageUrl = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

// Populate form when post prop changes
watch(
  () => props.post,
  (post) => {
    if (post) {
      title.value = post.title
      description.value = post.description
      imageUrl.value = post.imageUrl
      imageFile.value = null
    } else {
      title.value = ''
      description.value = ''
      imageUrl.value = ''
      imageFile.value = null
    }
  },
  { immediate: true }
)

function close() {
  emits('close')
}

// Submit updated post
async function onFormSubmit() {
  if (!props.post) return
  error.value = null
  loading.value = true

  try {
    // Wait for API call to finish (with optional new image)
    await updatePost(
      props.post.id,
      { title: title.value, description: description.value },
      imageFile.value
    )

    // Refresh parent list and close modal only on success
    emits('refresh')
    close()
  } catch (err) {
    error.value =
      typeof err === 'object' && err !== null && 'message' in err
        ? (err as { message: string }).message
        : 'Failed to update post'
  } finally {
    loading.value = false
  }
}

// Delete post
async function onDeletePost() {
  if (!props.post) return
  if (!confirm('Are you sure you want to delete this post?')) return

  loading.value = true
  try {
    await deletePost(props.post.id)
    emits('refresh')
    close()
  } catch (err) {
    error.value =
      typeof err === 'object' && err !== null && 'message' in err
        ? (err as { message: string }).message
        : 'Failed to delete post'
  } finally {
    loading.value = false
  }
}

// Handle file selection
function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  imageFile.value = target.files?.[0] || null
}
</script>

<template>
  <div
    v-if="props.post"
    class="fixed inset-0 bg-black/50 z-50 flex justify-center items-center"
    @click.self="close"
  >
    <div class="bg-white rounded-lg p-6 max-w-3xl w-full shadow-lg relative flex gap-6">
      <!-- Close button -->
      <button
        @click="close"
        class="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        aria-label="Close"
      >✕</button>

      <!-- Left: Form -->
      <form @submit.prevent="onFormSubmit" class="flex-1 flex flex-col gap-4">
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

        <!-- Image upload -->
        <label class="flex flex-col gap-1">
          <span class="text-sm ml-2">Replace Image</span>
          <input
            type="file"
            accept="image/*"
            class="border border-gray-300 rounded-md p-2"
            @change="onFileChange"
          />
        </label>

        <div class="flex gap-3 mt-2">
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 border border-black bg-black text-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition disabled:opacity-50"
          >
            {{ loading ? 'Submitting...' : 'Update Post' }}
          </button>

          <button
            type="button"
            @click="onDeletePost"
            :disabled="loading"
            class="flex-1 border border-red-600 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-white hover:text-red-600 transition disabled:opacity-50"
          >
            Delete
          </button>
        </div>

        <p v-if="error" class="text-red-600 text-sm mt-2">{{ error }}</p>
      </form>

      <!-- Right: Image Preview -->
      <div class="w-48 h-48 border rounded-md overflow-hidden">
        <img
          v-if="imageFile"
          :src="URL.createObjectURL(imageFile)"
          alt="New Image Preview"
          class="w-full h-full object-cover"
        />
        <img
          v-else
          :src="imageUrl"
          alt="Current Post Image"
          class="w-full h-full object-cover"
        />
      </div>
    </div>
  </div>
</template>
