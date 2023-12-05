<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="cachedViews">
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <van-tabbar v-model="route.meta.num" active-color="#ff6500" inactive-color="#333" v-show="route.meta.showTab" route fixed placeholder>
    <van-tabbar-item to="/home" icon="todo-list">实时</van-tabbar-item>
    <van-tabbar-item to="/reanalyze" icon="browsing-history">复盘</van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useCacheViewsStore } from "@/store/cacheViews.ts"
import { useRoute } from "vue-router"

const store = useCacheViewsStore()
const cachedViews = computed(() => store.cachedViews)
const route = useRoute()
</script>

<style scoped>
:deep(.van-tabbar-item) {
  background-color: white;
}
:deep(.van-tabbar-item--active) {
  background-color: white;
}
</style>
