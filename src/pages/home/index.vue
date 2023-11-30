<template>
  <div class="app-container">
    <van-nav-bar title="所有比赛" fixed placeholder class="w-full"/>
    <van-pull-refresh class="list-container" v-model="isLoading" @refresh="onRefreshList">
      <match-item v-for="match in matchList" :key="match.fid" :match="match" />
    </van-pull-refresh>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import MatchItem from "@/pages/home/src/MatchItem.vue"
import { getMatchList } from "@/http/api/football.ts"
import { IMatchInfo } from "@/models/match.ts"

defineOptions({
  name: "Home"
})
const isLoading = ref(false)
const matchList = ref<IMatchInfo[]>([])
const onRefreshList = () => {
  isLoading.value = true
  getMatchList().then(res => {
    matchList.value = res
  }).finally(() => {
    isLoading.value = false
  })
}
onRefreshList()
</script>

<style lang="less" scoped>
.list-container {
  flex: 1;
  width: 100%;
}
</style>
