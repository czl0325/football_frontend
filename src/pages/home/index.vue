<template>
  <div class="app-container padding-tabbar">
    <van-nav-bar title="所有比赛" fixed class="w-full">
      <template #right>
        <span class="text-white" @click="onChangeMatchList">{{ matchType === "all" ? "全部" : "竞彩" }}</span>
      </template>
    </van-nav-bar>
    <div v-if="requestError" class="flex flex-col w-full flex-1">
      <van-notice-bar class="w-full" wrapable :scrollable="false" text="由于我的服务器IP被对方封了，暂时只支持输入fid来进行比赛分析。有没有好心人可以提供代理服务器的。" color="#fff" background="#ff5252"/>
      <van-form @submit="onSubmit" class="w-full mt-4">
        <van-cell-group inset>
          <van-field v-model="fid" name="fid" label="fid" placeholder="请输入fid" :rules="[{ required: true, message: '请填写fid' }]" />
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit">分析</van-button>
        </div>
      </van-form>
      <van-cell title="历史查询" />
      <van-cell v-for="match in historyMatches" :title="`${match.home} vs ${match.visit}`" :label="`${match.group}(${match.time})`" is-link value="分析" :to="`/match/detail?fid=${match.fid}`"/>
    </div>
    <div v-else class="flex flex-col w-full flex-1">
      <van-sticky class="w-full" :offset-top="46">
        <van-cell title="比赛筛选" is-link @click="showMatchTypes=true"/>
      </van-sticky>
      <van-pull-refresh class="list-container" v-model="isLoading" @refresh="onRefreshList">
        <match-item v-for="match in matchList" :key="match.fid" :match="match" />
      </van-pull-refresh>
      <van-popup v-model:show="showMatchTypes" position="bottom" round>
        <div class="w-full p-3 overflow-y-auto flex flex-col" style="max-height: 500px">
          <div class="top-select">
            <van-button size="small" plain round @click="onSelectType(1)">全选</van-button>
            <van-button size="small" plain round @click="onSelectType(2)">全不选</van-button>
            <van-button size="small" plain round @click="onSelectType(3)">五大联赛</van-button>
            <van-button size="small" plain round @click="onSelectType(4)">热门</van-button>
          </div>
          <van-checkbox-group v-model="selectMatchTypes" shape="square" class="flex flex-row flex-wrap mt-4" @change="onChangeMatchType">
            <van-checkbox class="w-1/3 mb-5" v-for="item in matchGroups" :key="item" :name="item" square>{{ item }}</van-checkbox>
          </van-checkbox-group>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import MatchItem from "@/pages/home/src/MatchItem.vue"
import { getGithubToken, getMatchList } from "@/http/api/football.ts"
import { IMatchInfo } from "@/models/match.ts"
import { useLocalStorage } from "@vueuse/core"
import { closeToast, showLoadingToast } from "vant"
import { getAllMatchGroup } from "@/utils/tools.ts"

defineOptions({
  name: "Home"
})
const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
let originMatchList:IMatchInfo[] = []
const requestError = ref(false)
const fid = ref("")
const matchType = useLocalStorage<string>("match_type", "all")
const matchList = ref<IMatchInfo[]>([])
const matchGroups = ref<string[]>([])
const showMatchTypes = ref(false)
const selectMatchTypes = ref<string[]>([])
const onRefreshList = () => {
  showLoadingToast({
    message: "加载比赛...",
    duration: 0,
    forbidClick: true
  })
  isLoading.value = true
  getMatchList(matchType.value)
  .then((res:IMatchInfo[]) => {
    originMatchList = res
    matchGroups.value = getAllMatchGroup(res) as string[]
    if (selectMatchTypes.value.length === 0) {
      selectMatchTypes.value = matchGroups.value
    }
    onChangeMatchType()
    requestError.value = false
  }).catch(() => {
    originMatchList = []
    requestError.value = true
  }).finally(() => {
    closeToast()
    isLoading.value = false
  })
}
const onChangeMatchType = () => {
  matchList.value = originMatchList.filter(item => selectMatchTypes.value.includes(item.match_category))
}
const onChangeMatchList = () => {
  matchType.value = matchType.value === "all" ? "jingcai" : "all"
  onRefreshList()
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
const historyMatches = useLocalStorage<any[]>("history_matches", [])
if (route.query.code) {
  getGithubToken(route.query.code as string).then(res => {
    if (res.access_token) {
      localStorage.setItem("token", res.access_token as string)
    }
  })
}
onRefreshList()
const onSubmit = (values: any) => {
  router.push(`/match/detail?fid=${values.fid}`)
}
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
