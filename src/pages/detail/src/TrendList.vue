<template>
  <div class="flex flex-col w-full">
    <van-nav-bar title="查看水位走势" />
    <van-cell title="博彩公司" :value="currentCompany" clickable @click="showCompanyList=true"/>
    <div id="trend_chart" class="chart"></div>
    <van-dialog v-model:show="showCompanyList" title="" :showConfirmButton="false">
      <van-picker title="选择博彩公司" :columns="columns" @confirm="onConfirmCompany" @cancel="showCompanyList=false"/>
    </van-dialog>
<!--    <van-popup v-model="showCompanyList" >-->
<!--      <van-picker title="选择博彩公司" :columns="columns" @confirm="onConfirmCompany" />-->
<!--    </van-popup>-->
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from "vue"
import { PickerOption } from "vant"
import * as echarts from "echarts"
import { IAsiaOddsInfo, IEuropeOddsInfo, IMatchInfo, ISizeOddsInfo } from "@/models/match.ts"
import { useMatchStore } from "@/store/currentMatch.ts"
import { getOddsTrendByCompany } from "@/http/api/football.ts"
import { defineTrendChartOption } from "@/utils/tools.ts"

defineOptions({
  name: "TrendList"
})
const props = withDefaults(defineProps<{
  type?: number,
}>(), {
  type: 2,
})
const match: IMatchInfo = useMatchStore().match
const columns = ref<PickerOption[]>([])
const showCompanyList = ref(false)
const currentCompany = ref("")
let trend_chart: any = undefined
const onConfirmCompany = ({ selectedValues }) => {
  currentCompany.value = selectedValues[0]
  showCompanyList.value = false
  onGetMatchTrend()
}
const onGetMatchTrend = () => {
  getOddsTrendByCompany(match, props.type, currentCompany.value).then((res) => {
    const options = defineTrendChartOption(props.type)
    options.xAxis.data = res.x
    options.series[0].data = res.y_win
    options.series[1].data = res.y_run
    options.series[2].data = res.y_lose
    trend_chart.setOption(options)
  })
}
onMounted(() => {
  if (props.type === 1) {
    columns.value = match.europe_odds_items?.map((item: IEuropeOddsInfo) => {
      return {
        text: item.company_zh,
        value: item.company_zh
      }
    })
  } else if (props.type === 3) {
    columns.value = match.size_odds_items?.map((item: IAsiaOddsInfo) => {
      return {
        text: item.company_zh,
        value: item.company_zh
      }
    })
  } else {
    columns.value = match.asia_odds_items?.map((item: ISizeOddsInfo) => {
      return {
        text: item.company_zh,
        value: item.company_zh
      }
    })
  }
  if (columns.value.length > 0) {
    currentCompany.value = columns.value[0].text as string
  }
  const dom = document.getElementById("trend_chart")
  if (dom) {
    trend_chart = echarts.init(dom)
    onGetMatchTrend()
  }
  window.addEventListener("resize", onChartResize)
})
onBeforeUnmount(() => {
  window.removeEventListener("resize", onChartResize)
})
const onChartResize = () => {
  trend_chart?.resize()
}
</script>

<style lang="less" scoped>
.chart {
  width: 100%;
  height: 400px;
}
</style>
