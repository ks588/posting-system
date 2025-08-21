<script setup lang="ts">
import { ref } from 'vue';
import { useCreatePost } from '../composables/useCreatePost';
import { defineEmits } from 'vue';

const emit = defineEmits(['close']);

// Form fields reactive refs
const title = ref('');
const description = ref('');
const imageFile = ref<File | null>(null); // <- file ref

const { createPost } = useCreatePost();

const loading = ref(false);
const error = ref<string | null>(null);

function close() {
  emit('close');
}

// Form submit handler
async function onFormSubmit() {
  error.value = null;
  loading.value = true;

  try {
    if (!imageFile.value) {
      error.value = 'Please select an image for the post';
      return;
    }

    // Ensure user is logged in
    const token = sessionStorage.getItem('authtoken');
    if (!token) {
      alert('You must be logged in to create a post.');
      return;
    }

    // Call createPost with form data
    const data = await createPost(title.value, description.value, imageFile.value);
    console.log('Post created:', data);

    // Reset form fields
    title.value = '';
    description.value = '';
    imageFile.value = null;

    // Close modal on success
    close();
  } catch (err) {
    error.value =
      typeof err === 'object' && err !== null && 'message' in err
        ? (err as { message: string }).message
        : 'Failed to create post';
  } finally {
    loading.value = false;
  }
}

// File change handler
function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0] || null;
  imageFile.value = file;
}
</script>

<template>
  <div
    class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
    @click.self="close"
  >
    <div class="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative">
      <button
        @click="close"
        class="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        aria-label="Close"
      >
        ✕
      </button>
      <h3 class="text-xl font-semibold mb-4">Create Post</h3>

      <form @submit.prevent="onFormSubmit" class="flex flex-col gap-4 w-full sm:w-80">
        <label class="flex flex-col gap-1">
          <span class="text-sm ml-2">Title</span>
          <input
            v-model="title"
            type="text"
            class="border border-gray-300 rounded-md p-2"
            required
            placeholder="Enter post title"
          />
        </label>

        <label class="flex flex-col gap-1">
          <span class="text-sm ml-2">Description</span>
          <textarea
            v-model="description"
            class="border border-gray-300 rounded-md p-2 h-32 resize-none"
            required
            placeholder="Enter post description"
          ></textarea>
        </label>

        <!-- Image upload -->
        <label class="flex flex-col gap-1">
          <span class="text-sm ml-2">Upload Image</span>
          <input
            type="file"
            accept="image/*"
            @change="onFileChange"
            class="border border-gray-300 rounded-md p-2"
            required
          />
        </label>

        <button
          type="submit"
          :disabled="loading"
          class="border border-black bg-black text-white px-8 py-2 rounded-md tracking-wider hover:border hover:bg-white hover:text-black transition disabled:opacity-50"
        >
          {{ loading ? 'Submitting...' : 'Submit Post' }}
        </button>

        <p v-if="error" class="text-red-600 text-sm mt-2">{{ error }}</p>
      </form>

      <slot />
    </div>
  </div>
</template>
