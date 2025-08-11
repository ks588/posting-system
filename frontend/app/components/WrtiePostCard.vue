<script setup>
import { defineEmits } from 'vue'
const emit = defineEmits(['close'])
import { Form } from '@primevue/forms';


function close() {
  emit('close')
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
      <h3 class="text-xl font-semibold mb-4">Create Post,</h3>
      
        <Form :initialValues="{}" :resolver="zodUserNameResolver" @submit="onFormSubmit" class="flex flex-col gap-2 w-full sm:w-80 ">
            <p class="text-sm ml-2">Title</p>
            <FormField v-slot="$field" name="title" initialValue="" :resolver="zodUserNameResolver" class="flex flex-col gap-3 border border-gray-300 rounded-md">
                <InputText type="text" />
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
            </FormField>

            <p class="text-sm ml-2">Description</p>
            <FormField v-slot="$field" name="Description" class="flex flex-col gap-3 border border-gray-300 rounded-md">
                <Textarea class="h-32"/>
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
            </FormField>
            
            <p class="text-sm ml-2 mt-5">Image Upload</p>
            <FormField v-slot="$field" name="image" class="flex flex-col gap-3 text-sm">
            <input
                type="file"
                accept="image/*"
                @change="$field.handleChange($event)"
                class="border border-gray-300 rounded-md p-2"
            />
            <Message
                v-if="$field?.invalid"
                severity="error"
                size="small"
                variant="simple"
            >
                {{ $field.error?.message }}
            </Message>
            </FormField>
            <Button unstyled class="border border-black bg-black text-white px-8 mx-10 mt-5 py-2 rounded-md tracking-wider hover:border border-black hover:bg-white hover:text-black transition">
                Submit Post
            </Button>
        </Form>

      <slot />
      
    </div>
  </div>
</template>
