<template>
  <van-tabs v-model:active="activeTab">
    <van-tab v-for="item in allData" :key="item.tab" :title="item.tab">
      <table class="table-1">
        <thead>
        <tr>
          <th>赛事</th>
          <th>主队</th>
          <th>客队</th>
          <th>比分</th>
          <th>赛果</th>
        </tr>
        </thead>
        <thead>
        <tr v-for="match in item.data" :key="match">
          <th>{{ match[0] }}</th>
          <th>{{ match[1] }}</th>
          <th>{{ match[2] }}</th>
          <th>{{ match[3] }}</th>
          <th>{{ match[4] }}</th>
        </tr>
        </thead>
      </table>
    </van-tab>
  </van-tabs>
</template>

<script lang="ts" setup>
import { IMatchInfo } from "@/models/match.ts"
import { ref, watch } from "vue"

defineOptions({
  name: "MatchingList"
})
const props = defineProps<{
  type: number,
  match: IMatchInfo
}>()
const activeTab = ref(0)
const allData = ref<any>([])
watch(() => props.match, (val) => {
  const matches = props.type === 1 ? val.europe_matches : (props.type === 2 ? val.asia_matches : val.size_matches)
  const arr1: string[][] = []
  const arr2: string[][] = []
  const arr3: string[][] = []
  matches.forEach((item: string) => {
    const arr = item.split("_")
    if (arr.length === 5) {
      if (props.type === 1) {
        if (arr[4] === "胜") {
          arr1.push(arr)
        } else if (arr[4] === "平") {
          arr2.push(arr)
        } else if (arr[4] === "负") {
          arr3.push(arr)
        }
      } else if (props.type === 2) {
        if (arr[4] === "赢") {
          arr1.push(arr)
        } else if (arr[4] === "走") {
          arr2.push(arr)
        } else if (arr[4] === "输") {
          arr3.push(arr)
        }
      } else if (props.type === 3) {
        if (arr[4] === "大") {
          arr1.push(arr)
        } else if (arr[4] === "走") {
          arr2.push(arr)
        } else if (arr[4] === "小") {
          arr3.push(arr)
        }
      }
    }
  })
  if (arr1.length > 0) {
    allData.value.push({
      tab: props.type === 1 ? "胜" : (props.type === 2 ? "赢" : "大"),
      data: arr1
    })
  }
  if (arr2.length > 0) {
    allData.value.push({
      tab: props.type === 1 ? "平" : "走",
      data: arr2
    })
  }
  if (arr3.length > 0) {
    allData.value.push({
      tab: props.type === 1 ? "负" : (props.type === 2 ? "输" : "小"),
      data: arr3
    })
  }
}, {immediate: true, deep: true})
</script>

<style scoped>

</style>
