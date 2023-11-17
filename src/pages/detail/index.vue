<template>
  <div class="app-container">
    <van-nav-bar title="详细分析" fixed placeholder left-arrow clickable @click-left="onBack"/>
    <span class="match-time">{{ match.match_time }}</span>
    <div class="top-view">
      <div class="team-item">
        <span>{{ match.home_team }}</span>
        <span class="rank" v-if="match.home_team_rank">排名{{ match.home_team_rank }}，积分{{ match.home_score }}</span>
      </div>
      <div class="score">{{ match.field_score ?? "vs" }}</div>
      <div class="team-item">
        <span>{{ match.visit_team }}</span>
        <span class="rank" v-if="match.visit_team_rank">排名{{ match.visit_team_rank }}，积分{{ match.visit_score }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { analysisMatch, getMatchInfo } from "@/http/api/football.ts"
import { IMatchInfo } from "@/models/match.ts"
import { closeToast, showLoadingToast } from "vant"

defineOptions({
  name: "MatchDetail"
})
const route = useRoute()
const router = useRouter()
const match = ref<IMatchInfo>({})
const onBack = () => {
  router.back()
}
if (route.query.fid) {
  showLoadingToast("加载基础数据...")
  getMatchInfo(route.query.fid as string).then(res1 => {
    match.value = res1
    showLoadingToast("比赛分析中...")
    analysisMatch(res1).then(res2 => {
      console.log(res2)
    })
  }).finally(() => {
    closeToast()
  })
}
</script>

<style lang="less" scoped>
.match-time {
  margin: 10px auto;
  color: red;
}
.top-view {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  width: 100%;
  .score {
    font-weight: bold;
    font-size: 20px;
    margin: 0 20px;
  }
  .team-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    color: #1890ff;
    font-size: 16px;
    font-weight: bold;
    .rank {
      color: orchid;
      font-size: 12px;
      font-weight: normal;
      margin-top: 5px;
    }
  }
}
</style>
