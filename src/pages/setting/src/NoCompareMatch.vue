<template>
  <van-checkbox-group v-model="noCompareMatches">
    <van-index-bar v-for="key in Object.keys(matches)" :key="key">
      <van-index-anchor :index="key"/>
      <van-cell v-for="item in matches[key]" :key="item" :title="item" >
        <template #right-icon>
          <van-checkbox :name="item" />
        </template>
      </van-cell>
    </van-index-bar>
  </van-checkbox-group>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { pinyin } from "pinyin-pro"
import { ALL_COMPETITION } from "@/config.ts"
import { useLocalStorage } from "@vueuse/core"

defineOptions({
  name: "NoCompareMatch"
})
const matches = computed(() => {
  const grouped: any = { }
  ALL_COMPETITION.forEach(item => {
    const firstLetter = pinyin(item, { toneType: 'none' }).substring(0, 1)
    if (firstLetter) {
      if (!grouped[firstLetter.toUpperCase()]) {
        grouped[firstLetter.toUpperCase()] = []
      } else {
        grouped[firstLetter.toUpperCase()].push(item)
      }
    }
  })
  const newGrouped = Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0]))
  return Object.fromEntries(newGrouped);
})
const noCompareMatches = useLocalStorage<string[]>("no_compare_match", [])
</script>

<style lang="less" scoped>

</style>
