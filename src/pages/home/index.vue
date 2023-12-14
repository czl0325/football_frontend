<template>
  <div class="app-container">
    <van-nav-bar title="所有比赛" fixed class="w-full" />
    <van-cell title="比赛筛选" is-link @click="showMatchTypes=true"/>
    <van-pull-refresh class="list-container" v-model="isLoading" @refresh="onRefreshList">
      <match-item v-for="match in matchList" :key="match.fid" :match="match" />
    </van-pull-refresh>
    <van-popup v-model:show="showMatchTypes" position="bottom">
      <div class="w-full p-3">
        <van-checkbox-group v-model="selectMatchTypes" shape="square" class="flex flex-row flex-wrap" @change="onChangeMatchType">
          <van-checkbox class="w-1/3 mb-5" v-for="item in matchGroups" :key="item" :name="item" square>{{ item }}</van-checkbox>
        </van-checkbox-group>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import MatchItem from "@/pages/home/src/MatchItem.vue"
import { getMatchList } from "@/http/api/football.ts"
import { IMatchInfo } from "@/models/match.ts"
import { ASIA_COMPANY, EUROPE_COMPANY, SIZE_COMPANY } from "@/config.ts"
import { useLocalStorage } from "@vueuse/core"
import { closeToast, showLoadingToast } from "vant"
import { getAllMatchGroup } from "@/utils/tools.ts"

defineOptions({
  name: "Home"
})
const isLoading = ref(false)
const matchList = ref<IMatchInfo[]>([])
const matchGroups = ref<string[]>([])
const showMatchTypes = ref(false)
const selectMatchTypes = ref<string[]>([])
const onRefreshList = () => {
  showLoadingToast({
    message: "加载比赛...",
    duration: 0
  })
  isLoading.value = true
  getMatchList().then((res:IMatchInfo[]) => {
    matchList.value = res
    matchGroups.value = getAllMatchGroup(res)
    if (selectMatchTypes.value.length === 0) {
      selectMatchTypes.value = matchGroups.value
    }
  }).finally(() => {
    closeToast()
    isLoading.value = false
  })
}
const onChangeMatchType = () => {
  matchList.value = matchList.value.filter(item => selectMatchTypes.value.includes(item.match_category))
}
onRefreshList()
</script>

<style lang="less" scoped>
.list-container {
  flex: 1;
  width: 100%;
  height: 0;
}
.filter-text {
  font-size: 14px;
  color: #ff6500;
}
</style>
