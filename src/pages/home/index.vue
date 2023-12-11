<template>
  <div class="app-container">
    <van-nav-bar title="所有比赛" fixed placeholder class="w-full" />
    <van-row class="w-full m-4">
      <van-col :span="8">
        <van-popover v-model:show="showEuropePopover">
          <van-grid square clickable :border="false" column-num="3" style="width: 240px;" >
            <van-grid-item v-for="i in 6" :key="i" text="选项" icon="photo-o" @click="showEuropePopover = false" />
          </van-grid>
          <template #reference>
            <van-button type="primary">自定义内容</van-button>
          </template>
        </van-popover>
      </van-col>
    </van-row>
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
const showEuropePopover = ref(false)
const showAsiaPopover = ref(false)
const showSizePopover = ref(false)
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
  height: 0;
}
</style>
