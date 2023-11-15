<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="cachedViews">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useCacheViewsStore } from "@/store/cacheViews.ts"

const store = useCacheViewsStore()
const cachedViews = computed(() => store.cachedViews)
</script>

<style scoped>

</style>
