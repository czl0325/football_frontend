<template>
  <div class="app-container">
    <van-nav-bar title="详细分析" fixed left-arrow clickable @click-left="router.back()"  class="w-full"/>
    <van-pull-refresh style="min-height: 100vh" v-model="isLoading" @refresh="onGetMatchInfo">
      <div class="content-container">
        <span class="match-group">{{ match.match_group }}</span>
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
        <van-notice-bar wrapable :scrollable="false" text="请注意，由于水位是实时在变化，每次分析的结果都不一样。越接近开赛时间越准确。分析结果仅供参考。" />
        <div class="panel" v-if="showEuropeAll">
          <div class="title">
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
          <div id="chart_europe_all" class="chart"></div>
        </div>
        <div class="panel" v-else>欧赔暂无匹配场次</div>
        <div class="panel" v-if="showEuropeLeague">
          <div class="title">
            欧赔本联赛匹配结果：
          </div>
          <div class="flex flex-row items-center w-full">
            <div class="flex-horizontal-1 win_count">
              胜：{{ match.europe_win_league }}场
            </div>
            <div class="flex-horizontal-1 even_count">
              平：{{ match.europe_even_league }}场
            </div>
            <div class="flex-horizontal-1 lose_count">
              负：{{ match.europe_lose_league }}场
            </div>
          </div>
          <div id="chart_europe_league" class="chart"></div>
        </div>
        <div class="panel" v-if="showEuropeAll&&europe_score_list.length">比分概率前三:<div v-for="score in europe_score_list" :key="score" v-html="score"></div></div>
        <div class="flex flex-row w-full justify-end mt-2" style="padding: 0 20px">
          <van-button type="primary" size="small" @click="currentOddsType=1;showOdds=true;">查看欧赔赔率</van-button>
          <van-button type="primary" size="small">查看匹配详情</van-button>
        </div>
        <van-notice-bar v-if="showAsiaAll" color="#1989fa" background="#ecf9ff" class="w-full mt-2" :scrollable="false">
          亚盘初盘：{{ match.origin_pan_most }}，亚盘即时盘：{{ match.instant_pan_most }}
        </van-notice-bar>
        <div class="panel" v-if="showAsiaAll">
          <div class="title">
            亚盘全网匹配结果：
          </div>
          <div class="flex flex-row items-center w-full">
            <div class="flex-horizontal-1 win_count">
              赢：{{ match.asia_win_all }}场
            </div>
            <div class="flex-horizontal-1 even_count">
              走：{{ match.asia_run_all }}场
            </div>
            <div class="flex-horizontal-1 lose_count">
              输：{{ match.asia_lose_all }}场
            </div>
          </div>
          <div id="chart_asia_all" class="chart"></div>
        </div>
        <div class="panel" v-else>亚盘暂无匹配场次</div>
        <div class="panel" v-if="showAsiaLeague">
          <div class="title">
            亚盘本联赛匹配结果：
          </div>
          <div class="flex flex-row items-center w-full">
            <div class="flex-horizontal-1 win_count">
              赢：{{ match.asia_win_league }}场
            </div>
            <div class="flex-horizontal-1 even_count">
              走：{{ match.asia_run_league }}场
            </div>
            <div class="flex-horizontal-1 lose_count">
              输：{{ match.asia_lose_league }}场
            </div>
          </div>
          <div id="chart_asia_league" class="chart"></div>
        </div>
        <div class="panel" v-if="showAsiaAll&&asia_score_list.length">比分概率前三:<div v-for="score in asia_score_list" :key="score" v-html="score"></div></div>
        <van-notice-bar v-if="showSizeAll" color="#1989fa" background="#ecf9ff" class="w-full" :scrollable="false">
          大小球初盘：{{ match.origin_size_most }}，大小球即时盘：{{ match.instant_size_most }}
        </van-notice-bar>
        <div class="panel" v-if="showSizeAll">
          <div class="title">
            大小球全网匹配结果：
          </div>
          <div class="flex flex-row items-center w-full">
            <div class="flex-horizontal-1 win_count">
              大：{{ match.size_big_all }}场
            </div>
            <div class="flex-horizontal-1 even_count">
              走：{{ match.size_run_all }}场
            </div>
            <div class="flex-horizontal-1 lose_count">
              小：{{ match.size_small_all }}场
            </div>
          </div>
          <div id="chart_size_all" class="chart"></div>
        </div>
        <div class="panel" v-else>大小球暂无匹配场次</div>
        <div class="panel" v-if="showSizeLeague">
          <div class="title">
            大小球本联赛匹配结果：
          </div>
          <div class="flex flex-row items-center w-full">
            <div class="flex-horizontal-1 win_count">
              大：{{ match.size_big_league }}场
            </div>
            <div class="flex-horizontal-1 even_count">
              走：{{ match.size_run_league }}场
            </div>
            <div class="flex-horizontal-1 lose_count">
              小：{{ match.size_small_league }}场
            </div>
          </div>
          <div id="chart_size_league" class="chart"></div>
        </div>
        <div class="panel" v-if="size_score_list.length">比分概率前三:<div v-for="score in size_score_list" :key="score" v-html="score"></div></div>
        <van-notice-bar v-if="match.remark" color="#fff" background="#f00" class="w-full" :text="match.remark" :scrollable="false" wrapable/>
      </div>
    </van-pull-refresh>
    <van-popup v-model:show="showOdds" position="bottom" round>
      <div class="w-full overflow-y-auto flex flex-col" style="max-height: 600px">
        <odds-list :match="match" :type="currentOddsType" />
      </div>
    </van-popup>
    <van-popup v-model:show="showMatching" position="bottom" round>
      <div class="w-full p-3 overflow-y-auto flex flex-col" style="max-height: 500px">
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref} from "vue"
import { useRoute, useRouter } from "vue-router"
import * as echarts from "echarts"
import _ from "lodash"
import { analysisMatch, getMatchInfo } from "@/http/api/football.ts"
import { IMatchInfo } from "@/models/match.ts"
import { closeToast, showLoadingToast, showToast } from "vant"
import { defineChartOption, getDecimalPoint } from "@/utils/tools.ts"
import OddsList from "@/pages/detail/src/OddsList.vue"

defineOptions({
  name: "MatchDetail"
})
const route = useRoute()
const router = useRouter()
const match = ref<IMatchInfo>({})
const showEuropeAll = ref(true)
const showEuropeLeague = ref(true)
const showAsiaAll = ref(true)
const showAsiaLeague = ref(true)
const showSizeAll = ref(true)
const showSizeLeague = ref(true)
const showOdds = ref(false)
const showMatching = ref(false)
const isLoading = ref(false)
const currentOddsType = ref(1)
let chart_europe_all: any = null
let chart_europe_league: any = null
let chart_asia_all: any = null
let chart_asia_league: any = null
let chart_size_all: any = null
let chart_size_league: any = null
const europe_score_list = ref<string[]>([])
const asia_score_list = ref<string[]>([])
const size_score_list = ref<string[]>([])
const onGetMatchInfo = () => {
  if (route.query.fid) {
    showLoadingToast({
      message: "加载基础数据...",
      duration: 0
    })
    match.value = {}
    getMatchInfo(route.query.fid as string).then((res: IMatchInfo) => {
      match.value = res
      onAnalysisMatch()
    })
  }
}
const onAnalysisMatch = () => {
  showLoadingToast({
    message: "比赛分析中...",
    duration: 0
  })
  analysisMatch(match.value).then((res2: IMatchInfo) => {
    match.value = res2
    showEuropeAll.value = (match.value.europe_win_all+match.value.europe_even_all+match.value.europe_lose_all>0)
    if (match.value.europe_win_all+match.value.europe_even_all+match.value.europe_lose_all>0) {
      const option1 = _.cloneDeep(defineChartOption(1, "欧赔全网"))
      const total1 = res2.europe_win_all + res2.europe_even_all + res2.europe_lose_all
      option1.series[0].data = [res2.europe_win_all / total1]
      option1.series[1].data = [res2.europe_even_all / total1]
      option1.series[2].data = [res2.europe_lose_all / total1]
      option1.legend = {
        top: '10%',
        formatter: (name: string) => {
          if (name === "胜") {
            return `胜：${getDecimalPoint(res2.europe_win_all/total1*100)}%`
          } else if (name === "平") {
            return `平：${getDecimalPoint(res2.europe_even_all/total1*100)}%`
          } else {
            return `负：${getDecimalPoint(res2.europe_lose_all/total1*100)}%`
          }
        }
      }
      chart_europe_all.setOption(option1)
      showEuropeLeague.value = match.value.europe_win_league+match.value.europe_even_league+match.value.europe_lose_league>0
      if (match.value.europe_win_league+match.value.europe_even_league+match.value.europe_lose_league>0) {
        const option11 = _.cloneDeep(defineChartOption(1, "欧赔本联赛"))
        const total11 = res2.europe_win_league + res2.europe_even_league + res2.europe_lose_league
        option11.series[0].data = [res2.europe_win_league/ total11]
        option11.series[1].data = [res2.europe_even_league / total11]
        option11.series[2].data = [res2.europe_lose_league / total11]
        option11.legend = {
          top: '10%',
          formatter: (name: string) => {
            if (name === "胜") {
              return `胜：${getDecimalPoint(res2.europe_win_league/total11*100)}%`
            } else if (name === "平") {
              return `平：${getDecimalPoint(res2.europe_even_league/total11*100)}%`
            } else {
              return `负：${getDecimalPoint(res2.europe_lose_league/total11*100)}%`
            }
          }
        }
        chart_europe_league.setOption(option11)
      }
      if (match.value.europe_score_list?.length > 0) {
        europe_score_list.value = []
        match.value.europe_score_list?.some((item: any[]) => {
          europe_score_list.value.push(`<span style="color: #895b8a">${item[0]}</span>：${item[1]}场(${(item[1]/total1*100).toFixed(2)}%)`)
          if (europe_score_list.value?.length >= 3) {
            return true
          }
        })
      }
    } else {
      showEuropeLeague.value = false
    }
    showAsiaAll.value = (match.value.asia_win_all+match.value.asia_run_all+match.value.asia_lose_all>0)
    if (match.value.asia_win_all+match.value.asia_run_all+match.value.asia_lose_all>0) {
      const option2 = _.cloneDeep(defineChartOption(2, "亚盘全网"))
      const total2 = res2.asia_win_all + res2.asia_run_all + res2.asia_lose_all
      option2.series[0].data = [res2.asia_win_all / total2]
      option2.series[1].data = [res2.asia_run_all / total2]
      option2.series[2].data = [res2.asia_lose_all / total2]
      option2.legend = {
        top: '10%',
        formatter: (name: string) => {
          if (name === "赢") {
            return `赢：${getDecimalPoint(res2.asia_win_all/total2*100)}%`
          } else if (name === "走") {
            return `走：${getDecimalPoint(res2.asia_run_all/total2*100)}%`
          } else {
            return `输：${getDecimalPoint(res2.asia_lose_all/total2*100)}%`
          }
        }
      }
      chart_asia_all.setOption(option2)
      showAsiaLeague.value = (match.value.asia_win_league+match.value.asia_run_league+match.value.asia_lose_league>0)
      if (match.value.asia_win_league+match.value.asia_run_league+match.value.asia_lose_league>0) {
        const option22 = _.cloneDeep(defineChartOption(2, "亚盘本联赛"))
        const total122 = res2.asia_win_league + res2.asia_run_league + res2.asia_lose_league
        option22.series[0].data = [res2.asia_win_league/ total122]
        option22.series[1].data = [res2.asia_run_league / total122]
        option22.series[2].data = [res2.asia_lose_league / total122]
        option22.legend = {
          top: '10%',
          formatter: (name: string) => {
            if (name === "赢") {
              return `赢：${getDecimalPoint(res2.asia_win_league/total122*100)}%`
            } else if (name === "走") {
              return `走：${getDecimalPoint(res2.asia_run_league/total122*100)}%`
            } else {
              return `输：${getDecimalPoint(res2.asia_lose_league/total122*100)}%`
            }
          }
        }
        chart_asia_league.setOption(option22)
      }
      if (match.value.asia_score_list?.length > 0) {
        asia_score_list.value = []
        match.value.asia_score_list?.some((item: any[]) => {
          asia_score_list.value.push(`<span style="color: #895b8a">${item[0]}</span>：${item[1]}场(${(item[1]/total2*100).toFixed(2)}%)`)
          if (asia_score_list.value.length >=  3) {
            return true
          }
        })
      }
    } else {
      showAsiaLeague.value = false
    }
    showSizeAll.value = (match.value.size_big_all+match.value.size_run_all+match.value.size_small_all>0)
    if (match.value.size_big_all+match.value.size_run_all+match.value.size_small_all>0) {
      const option3 = _.cloneDeep(defineChartOption(3, "大小球全网"))
      const total3 = res2.size_big_all + res2.size_run_all + res2.size_small_all
      option3.series[0].data = [res2.size_big_all / total3]
      option3.series[1].data = [res2.size_run_all / total3]
      option3.series[2].data = [res2.size_small_all / total3]
      option3.legend = {
        top: '10%',
        formatter: (name: string) => {
          if (name === "大") {
            return `大：${getDecimalPoint(res2.size_big_all/total3*100)}%`
          } else if (name === "走") {
            return `走：${getDecimalPoint(res2.size_run_all/total3*100)}%`
          } else {
            return `小：${getDecimalPoint(res2.size_small_all/total3*100)}%`
          }
        }
      }
      chart_size_all.setOption(option3)
      showSizeLeague.value = (match.value.size_big_league+match.value.size_run_league+match.value.size_small_league>0)
      if (match.value.size_big_league+match.value.size_run_league+match.value.size_small_league>0) {
        const option33 = _.cloneDeep(defineChartOption(3, "大小球本联赛"))
        const total33 = res2.size_big_league + res2.size_run_league + res2.size_small_league
        option33.series[0].data = [res2.size_big_league/ total33]
        option33.series[1].data = [res2.size_run_league / total33]
        option33.series[2].data = [res2.size_small_league / total33]
        option33.legend = {
          top: '10%',
          formatter: (name: string) => {
            if (name === "大") {
              return `大：${getDecimalPoint(res2.size_big_league/total33*100)}%`
            } else if (name === "走") {
              return `走：${getDecimalPoint(res2.size_run_league/total33*100)}%`
            } else {
              return `小：${getDecimalPoint(res2.size_small_league/total33*100)}%`
            }
          }
        }
        chart_size_league.setOption(option33)
      }
      if (match.value.size_score_list?.length > 0) {
        size_score_list.value = []
        match.value.size_score_list?.some((item: any[]) => {
          size_score_list.value.push(`<span style="color: #895b8a">${item[0]}</span>：${item[1]}场(${(item[1]/total3*100).toFixed(2)}%)`)
          if (size_score_list.value.length >=  3) {
            return true
          }
        })
      }
    } else {
      showSizeLeague.value = false
    }
    closeToast()
  }).catch(() => {
    closeToast()
    showToast({
      message: "请求失败，请稍后重试",
      position: "bottom"
    });
  }).finally(() => {
    isLoading.value = false
  })
}
onMounted(() => {
  const dom1 = document.getElementById('chart_europe_all')
  if (dom1) {
    chart_europe_all = echarts.init(dom1)
  }
  const dom2 = document.getElementById("chart_europe_league")
  if (dom2) {
    chart_europe_league = echarts.init(dom2)
  }
  const dom3 = document.getElementById("chart_asia_all")
  if (dom3) {
    chart_asia_all = echarts.init(dom3)
  }
  const dom4 = document.getElementById("chart_asia_league")
  if (dom4) {
    chart_asia_league = echarts.init(dom4)
  }
  const dom5 = document.getElementById("chart_size_all")
  if (dom5) {
    chart_size_all = echarts.init(dom5)
  }
  const dom6 = document.getElementById("chart_size_league")
  if (dom6) {
    chart_size_league = echarts.init(dom6)
  }
  window.addEventListener("resize", onChartResize)
  onGetMatchInfo()
})
onBeforeUnmount(() => {
  window.removeEventListener("resize", onChartResize)
  chart_europe_all?.dispose()
  chart_europe_league?.dispose()
  chart_asia_all?.dispose()
  chart_asia_league?.dispose()
  chart_size_all?.dispose()
  chart_size_league?.dispose()
})
const onChartResize = () => {
  chart_europe_all?.resize()
  chart_europe_league?.resize()
  chart_asia_all?.resize()
  chart_asia_league?.resize()
  chart_size_all?.resize()
  chart_size_league?.resize()
}
</script>

<style lang="less" scoped>
.content-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.match-group {
  margin-top: 10px;
  color: #333333;
  font-size: 20px;
  font-weight: bold;
}
.match-time {
  margin-top: 5px;
  margin-bottom: 10px;
  color: red;
  font-size: 12px;
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
  .title {
    font-size: 20px;
    font-weight: bold;
    color: orange;
    margin-bottom: 10px;
  }
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
.chart {
  width: 100%;
  height: 100px;
}
:deep(.van-notice-bar__content) {
  white-space: pre-line;
}
</style>
