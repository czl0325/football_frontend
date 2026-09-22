<template>
  <div class="app-container padding-tabbar">
    <van-nav-bar title="首页" fixed class="w-full" />
    <div class="flex flex-col w-full flex-1 px-2">
      <span class="mt-3">粘贴网页端获取的json数据进行分析</span>
      <van-field class="mt-3" v-model="jsonData" rows="20" type="textarea"></van-field>
      <div class="flex gap-1 mt-3">
        <van-button class="flex-1" type="primary" @click="jsonData='';">清空数据</van-button>
        <van-button class="flex-1" type="primary" @click="onClickAnalyze">开始分析</van-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { showFailToast } from "vant"
import { useMatchStore } from "@/store/currentMatch.ts"

defineOptions({
  name: "Home"
})
const router = useRouter()
const jsonData = ref("")
const onClickAnalyze = () => {
  if (jsonData.value.length <= 0) {
    showFailToast("请输入json数据")
    return
  }
  const store = useMatchStore()
  store.match = JSON.parse(jsonData.value)
  router.push("/match/detail")
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
