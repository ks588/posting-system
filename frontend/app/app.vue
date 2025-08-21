<script setup lang="ts">
</script>

<template>
  <div>
    <TopNavBar v-if="$route.path !== '/'" />
    <PostSearch v-if="!$route.path.startsWith('/admin') && $route.path !== '/'" />
    <AdminTopNavBar v-if="$route.path.startsWith('/admin')" />
    <div class="pt-16">
      <NuxtPage />
    </div>
  </div>
</template>
