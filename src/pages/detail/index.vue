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
    <div class="panel">
      <div >
        欧赔全网匹配结果：
      </div>
      <div class="flex flex-row items-center w-full">
        <div class="flex-horizontal-1 win_count">
          胜：{{ match.europe_win_all }}场
        </div>
        <div class="flex-horizontal-1 even_count">
          平：{{ match.europe_even_all }}场
        </div>
        <div class="flex-horizontal-1 lose_count">
          负：{{ match.europe_lose_all }}场
        </div>
      </div>
      <div id="chart_europe_all"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import * as echarts from "echarts"
import _ from "lodash"
import { analysisMatch, getMatchInfo } from "@/http/api/football.ts"
import { IMatchInfo } from "@/models/match.ts"
import { closeToast, showLoadingToast } from "vant"
import { defineChartOption } from "@/utils/tools.ts"

defineOptions({
  name: "MatchDetail"
})
const route = useRoute()
const router = useRouter()
const match = ref<IMatchInfo>({})
let chart_europe_all: any = null
const onBack = () => {
  router.back()
}
onMounted(() => {
  const dom1 = document.getElementById('chart_europe_all')
  if (dom1) {
    chart_europe_all = echarts.init(dom1)
    const options = _.cloneDeep(defineChartOption(1))
    chart_europe_all.setOption(options)
  }
  if (route.query.fid) {
    showLoadingToast("加载基础数据...")
    getMatchInfo(route.query.fid as string).then(res1 => {
      match.value = res1
      showLoadingToast("比赛分析中...")
      analysisMatch(res1).then(res2 => {
        match.value = res2
        const option1 = chart_europe_all.getOption()
        const total = res2.europe_win_all + res2.europe_even_all + res2.europe_lose_all
        option1.series[0].data = [res2.europe_win_all / total]
        option1.series[1].data = [res2.europe_even_all / total]
        option1.series[2].data = [res2.europe_lose_all / total]
        console.log(option1)
        chart_europe_all.setOption(option1)
      }).finally(() => {
        closeToast()
      })
    })
  }
})
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
.panel {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.flex-horizontal-1 {
  width: 0;
  flex: 1;
}
.win_count {
  color: #ff3200;
}
.even_count {
  color: #99cc33;
}
.lose_count {
  color: #1890ff;
}
#chart_europe_all {
  width: 100%;
  height: 100px;
}
</style>
