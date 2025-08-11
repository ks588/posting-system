<script setup lang="ts">
</script>

<template>
  <div>
    <TopNavBar v-if="$route.path !== '/'" />
    <div class="pt-16">
      <NuxtPage />
    </div>
  </div>
</template>
