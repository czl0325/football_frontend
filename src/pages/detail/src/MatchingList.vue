<template>
  <van-tabs ref="xTabs" v-model:active="activeTab" animated swipeable title-active-color="#FF5600">
    <van-tab v-for="(item, index) in allData" :key="item.tab" :name="index" :title="item.tab">
      <div style="height: 70vh;">
        <vxe-table class="match-list-table" :data="item.data" border align="center" stripe height="100%" :row-class-name="rowClassName">
          <vxe-column title="赛事" field="0">
            <template #default="{row}">
              <a :href="isMobile()?`https://live.m.500.com/detail/football/${row[6]}/analysis/record?render=local&extendchannel=10002`:`https://odds.500.com/fenxi/shuju-${row[6]}.shtml`" target="_blank">
                {{ row[0] }}
              </a>
            </template>
          </vxe-column>
          <vxe-column title="主队" field="1" />
          <vxe-column title="客队" field="2" />
          <vxe-column title="比分" field="3" />
          <vxe-column title="赛果" field="4" />
          <vxe-column title="开盘公司" field="5" />
        </vxe-table>
      </div>
    </van-tab>
  </van-tabs>
</template>

<script lang="ts" setup>
import { IMatchInfo } from "@/models/match.ts"
import { computed, nextTick, ref, watch } from "vue"
import { isMobile, mergeSameMatch } from "@/utils/tools.ts"
import { VxeTablePropTypes } from "vxe-table"
import { TabsInstance } from "vant"

defineOptions({
  name: "MatchingList"
})
const props = defineProps<{
  type: number,
  match: IMatchInfo
}>()
const xTabs = ref<TabsInstance>()
const activeTab = ref(0)
const allData = ref<any>([])
const match = computed<IMatchInfo>(() => props.match)
const rowClassName: VxeTablePropTypes.CellClassName<IMatchInfo> = ({ row }) => {
  return row[0].includes(match.value.match_category) ? "match-highlight" : ""
}
watch(() => props.type, (val) => {
  allData.value = []
  const matches: string[] = (val === 1 ? match.value.europe_matches : (val === 2 ? match.value.asia_matches : match.value.size_matches)) || []
  const arr1: string[][] = []
  const arr2: string[][] = []
  const arr3: string[][] = []
  const newMatches = props.type === 1 ? matches : mergeSameMatch(matches)
  newMatches?.forEach((item: string) => {
    const arr = item.split("_")
    if (arr.length >= 6) {
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
  allData.value.push({
    tab: (val === 1 ? "胜" : (val === 2 ? "赢" : "大")) + `(${arr1.length})`,
    data: arr1
  })
  allData.value.push({
    tab: (val === 1 ? "平" : "走") + `(${arr2.length})`,
    data: arr2
  })
  allData.value.push({
    tab: (val === 1 ? "负" : (val === 2 ? "输" : "小")) + `(${arr3.length})`,
    data: arr3
  })
  nextTick(() => {
    activeTab.value = 0
  })
}, { immediate: true, deep: true })
</script>

<style scoped>
::v-deep(.match-list-table.vxe-table .vxe-body--row.match-highlight) {
  background-color: #F9CDAD;
}
</style>
