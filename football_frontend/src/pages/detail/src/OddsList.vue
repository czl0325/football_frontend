<template>
  <table class="table-1">
    <thead>
    <tr>
      <th>公司</th>
      <th v-for="item in tableHeader" :key="item">{{ item }}</th>
    </tr>
    </thead>
    <tbody v-if="type===1">
    <tr v-for="item in match.europe_odds_items" :key="item.company_en">
      <td>{{ item.company_zh }}</td>
      <td>{{ item.origin_win_odds }}</td>
      <td>{{ item.origin_even_odds }}</td>
      <td>{{ item.origin_lose_odds }}</td>
      <td>{{ item.instant_win_odds }}</td>
      <td>{{ item.instant_even_odds }}</td>
      <td>{{ item.instant_lose_odds }}</td>
    </tr>
    </tbody>
    <tbody v-if="type===2">
    <tr v-for="item in match.asia_odds_items" :key="item.company_en">
      <td>{{ item.company_zh }}</td>
      <td>{{ item.origin_odds_home }}</td>
      <td>{{ item.origin_odds }}</td>
      <td>{{ item.origin_odds_visit }}</td>
      <td>{{ item.instant_odds_home }}</td>
      <td>{{ item.instant_odds }}</td>
      <td>{{ item.instant_odds_visit }}</td>
    </tr>
    </tbody>
    <tbody v-else-if="type===3">
    <tr v-for="item in match.size_odds_items" :key="item.company_en">
      <td>{{ item.company_zh }}</td>
      <td>{{ item.origin_odds_big }}</td>
      <td>{{ item.origin_size }}</td>
      <td>{{ item.origin_odds_small }}</td>
      <td>{{ item.instant_odds_big }}</td>
      <td>{{ item.instant_size }}</td>
      <td>{{ item.instant_odds_small }}</td>
    </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue"
import { IMatchInfo } from "@/models/match.ts"

defineOptions({
  name: "OddsList"
})
const props = defineProps<{
  type: number,
  match: IMatchInfo
}>()
const tableHeader = ref<string[]>([])
watch(() => props.type, (val) => {
  switch (val) {
    case 1:
      tableHeader.value = ["初赔(胜)", "初赔(平)", "初赔(负)", "即时(胜)", "即时(平)", "即时(负)"]
      break
    case 2:
      tableHeader.value = ["初盘(主)", "初盘", "初盘(客)", "即时(主)", "即时", "即时(客)"]
      break
    case 3:
      tableHeader.value = ["初盘(大)", "初盘", "初盘(小)", "即时(大)", "即时", "即时(小)"]
      break
  }
}, { immediate: true })
</script>

<style scoped>

</style>
