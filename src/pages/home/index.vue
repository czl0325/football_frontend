<template>
  <div class="app-container padding-tabbar">
    <van-nav-bar title="所有比赛" fixed class="w-full" />
    <van-cell title="比赛筛选" is-link @click="showMatchTypes=true"/>
    <van-pull-refresh class="list-container" v-model="isLoading" @refresh="onRefreshList">
      <match-item v-for="match in matchList" :key="match.fid" :match="match" />
    </van-pull-refresh>
    <van-popup v-model:show="showMatchTypes" position="bottom" round>
      <div class="w-full p-3 overflow-y-auto flex flex-col" style="max-height: 500px">
        <div class="top-select">
          <van-button size="small" plain round @click="onSelectType(1)">全选</van-button>
          <van-button size="small" plain round @click="onSelectType(2)">反选</van-button>
          <van-button size="small" plain round @click="onSelectType(3)">五大联赛</van-button>
          <van-button size="small" plain round @click="onSelectType(4)">热门</van-button>
        </div>
        <van-checkbox-group v-model="selectMatchTypes" shape="square" class="flex flex-row flex-wrap mt-4" @change="onChangeMatchType">
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
let originMatchList:IMatchInfo[] = []
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
    originMatchList = res
    matchGroups.value = getAllMatchGroup(res)
    if (selectMatchTypes.value.length === 0) {
      selectMatchTypes.value = matchGroups.value
    }
    onChangeMatchType()
  }).finally(() => {
    closeToast()
    isLoading.value = false
  })
}
const onChangeMatchType = () => {
  matchList.value = originMatchList.filter(item => selectMatchTypes.value.includes(item.match_category))
}
const onSelectType = (type: number) => {
  if (type === 1) {
    selectMatchTypes.value = matchGroups.value
  } else if (type === 2) {
    selectMatchTypes.value = []
  } else if (type === 3) {
    selectMatchTypes.value = ["英超", "意甲", "德甲", "西甲", "法甲"]
  } else if (type === 4) {
    selectMatchTypes.value = ["英超", "意甲", "德甲", "西甲", "法甲", "欧冠", "欧罗巴", "亚冠"]
  }
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
.top-select {
  display: flex;
  flex-direction: row;
  .van-button + .van-button {
    margin-left: 10px;
  }
}
</style>
