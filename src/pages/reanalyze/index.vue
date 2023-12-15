<template>
  <div class="app-container padding-tabbar">
    <van-nav-bar title="复盘比赛" fixed />
    <van-form class="w-full my-3">
      <van-cell-group inset>
        <van-field v-model="searchValue.matchDate" label="比赛日期" placeholder="请选择比赛日期" is-link readonly @click="showDatePicker=true"/>
      </van-cell-group>
    </van-form>
    <van-pull-refresh class="w-full" style="min-height: 100vh" v-model="pagination.refreshing" @refresh="onGetMatchByDate(true)">
      <van-list v-model:loading="pagination.loading" :finished="pagination.finished" finished-text="没有更多比赛" @load="onGetMatchByDate(false)" :immediate-check="false">
        <match-item v-for="match in matchList" :key="match.fid" :match="match" />
      </van-list>
    </van-pull-refresh>
    <van-popup v-model:show="showDatePicker" position="bottom">
      <van-date-picker v-model="selectDate" :max-date="maxDate" :min-date="minDate" @confirm="onConfirmDate" @cancel="showDatePicker=false" />
    </van-popup>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from "vue"
import dayjs from "dayjs"
import _ from "lodash"
import { getMatchesByDate } from "@/http/api/football.ts"
import MatchItem from "@/pages/home/src/MatchItem.vue"
import { IMatchInfo } from "@/models/match.ts"
import { defaultPagination, IPaginationInfo } from "@/http/http.ts"

defineOptions({
  name: "Reanalyze"
})
const searchValue = reactive({
  matchDate: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
})
const pagination = reactive<IPaginationInfo>(_.cloneDeep(defaultPagination))
const showDatePicker = ref(false)
const matchList = ref<IMatchInfo[]>([])
const selectDate = computed(() => {
  return searchValue.matchDate.split("-")
})
const minDate = computed(() => {
  return dayjs().subtract(25, "year").toDate()
})
const maxDate = computed(() => {
  return dayjs().toDate()
})
const onConfirmDate = ({ selectedValues }) => {
  searchValue.matchDate = selectedValues.join('-');
  showDatePicker.value = false
  onGetMatchByDate(true)
}
const onGetMatchByDate = (refresh = true) => {
  if (refresh) {
    pagination.pageNum = 1
  } else {
    pagination.pageNum++
  }
  getMatchesByDate(searchValue.matchDate, pagination).then(res => {
    matchList.value = refresh ? res.data : matchList.value.concat(res.data)
  })
}
onGetMatchByDate()
</script>

<style lang="scss" scoped>

</style>
